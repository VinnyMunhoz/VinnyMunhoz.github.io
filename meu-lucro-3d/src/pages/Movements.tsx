import { useState, useMemo } from 'react';
import {
  ArrowLeftRight, ShoppingCart, CreditCard,
  Search, Filter, Download, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import type { MarketplaceType } from '../types';

type MovementType = 'all' | 'sale' | 'expense';

const ITEMS_PER_PAGE = 15;

const marketplaceBadgeColors: Record<string, string> = {
  'Mercado Livre': 'bg-yellow-500/20 text-yellow-400',
  'Shopee': 'bg-orange-500/20 text-orange-400',
  'TikTok Shop': 'bg-slate-500/20 text-slate-300',
  'Amazon': 'bg-blue-500/20 text-blue-400',
  'Venda Direta': 'bg-green-500/20 text-green-400',
  'Atacado': 'bg-purple-500/20 text-purple-400',
  'Loja Física': 'bg-indigo-500/20 text-indigo-400',
};

interface UnifiedMovement {
  id: string;
  type: 'sale' | 'expense';
  date: string;
  description: string;
  category: string;
  value: number;
  marketplace?: MarketplaceType;
  status: string;
  profit?: number;
}

export default function Movements() {
  const sales = useStore((s) => s.sales);
  const expenses = useStore((s) => s.expenses);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<MovementType>('all');
  const [page, setPage] = useState(1);

  const allMovements: UnifiedMovement[] = useMemo(() => {
    const saleMovements: UnifiedMovement[] = sales.map((s) => ({
      id: s.id,
      type: 'sale',
      date: s.date,
      description: s.productName,
      category: 'Venda',
      value: s.quantity * s.unitPrice,
      marketplace: s.marketplace,
      status: s.status === 'completed' ? 'Concluída' : s.status,
      profit: s.profit,
    }));

    const expenseMovements: UnifiedMovement[] = expenses.map((e) => ({
      id: e.id,
      type: 'expense',
      date: e.date,
      description: e.notes || e.category,
      category: e.category,
      value: -e.value,
      marketplace: undefined,
      status: 'Concluída',
    }));

    return [...saleMovements, ...expenseMovements].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [sales, expenses]);

  const filtered = useMemo(() => {
    return allMovements.filter((m) => {
      const matchesSearch = !search || m.description.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || m.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [allMovements, search, typeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalIncome = filtered.filter((m) => m.value > 0).reduce((sum, m) => sum + m.value, 0);
  const totalExpenses = filtered.filter((m) => m.value < 0).reduce((sum, m) => sum + Math.abs(m.value), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-100">Movimentações</h2>
            <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full">
              {filtered.length}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Histórico completo de entradas e saídas</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors">
          <Download size={15} />
          Exportar
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Entradas', value: totalIncome, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
          { label: 'Total Saídas', value: totalExpenses, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          { label: 'Saldo Período', value: totalIncome - totalExpenses, color: totalIncome - totalExpenses >= 0 ? 'text-green-400' : 'text-red-400', bg: 'bg-slate-800 border-slate-700' },
        ].map((item, idx) => (
          <div key={idx} className={`rounded-xl border p-4 ${item.bg}`}>
            <p className="text-xs text-slate-500 mb-1">{item.label}</p>
            <p className={`text-lg font-bold ${item.color}`}>{formatCurrency(Math.abs(item.value))}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
          <Search size={15} className="text-slate-500" />
          <input
            type="text"
            placeholder="Buscar movimentação..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-500" />
          {(['all', 'sale', 'expense'] as MovementType[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTypeFilter(t); setPage(1); }}
              className={cn(
                'px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                typeFilter === t
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
              )}
            >
              {t === 'all' ? 'Todos' : t === 'sale' ? 'Vendas' : 'Gastos'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Tipo</th>
                <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Data</th>
                <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Descrição</th>
                <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Categoria</th>
                <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Marketplace</th>
                <th className="text-right text-xs font-medium text-slate-500 px-5 py-3">Valor</th>
                <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <ArrowLeftRight size={32} className="mx-auto mb-3 opacity-30" />
                    <p>Nenhuma movimentação encontrada</p>
                  </td>
                </tr>
              ) : (
                paginated.map((mov) => (
                  <tr key={mov.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium',
                        mov.type === 'sale'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      )}>
                        {mov.type === 'sale' ? <ShoppingCart size={11} /> : <CreditCard size={11} />}
                        {mov.type === 'sale' ? 'Venda' : 'Gasto'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{formatDate(mov.date)}</td>
                    <td className="px-4 py-3">
                      <p className="text-slate-200 font-medium truncate max-w-[200px]">{mov.description}</p>
                      {mov.profit !== undefined && (
                        <p className="text-xs text-slate-500">Lucro: {formatCurrency(mov.profit)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-400 text-xs">{mov.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      {mov.marketplace ? (
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          marketplaceBadgeColors[mov.marketplace] ?? 'bg-slate-700 text-slate-400'
                        )}>
                          {mov.marketplace}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className={cn('px-5 py-3 text-right font-bold', mov.value >= 0 ? 'text-green-400' : 'text-red-400')}>
                      {mov.value >= 0 ? '+' : ''}{formatCurrency(Math.abs(mov.value))}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
                        {mov.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800">
            <p className="text-xs text-slate-500">
              {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
