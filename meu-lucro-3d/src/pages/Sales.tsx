import { useState, useMemo } from 'react';
import { ShoppingCart, Plus, Search, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate, formatPercent, cn } from '../lib/utils';
import RegisterSaleModal from '../components/modals/RegisterSaleModal';
import type { MarketplaceType } from '../types';

interface Props {
  onOpenSale: () => void;
}

const marketplaceBadgeColors: Record<string, string> = {
  'Mercado Livre': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
  'Shopee': 'bg-orange-500/20 text-orange-400 border-orange-500/20',
  'TikTok Shop': 'bg-slate-600/30 text-slate-300 border-slate-600/20',
  'Amazon': 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  'Venda Direta': 'bg-green-500/20 text-green-400 border-green-500/20',
  'Atacado': 'bg-purple-500/20 text-purple-400 border-purple-500/20',
  'Loja Física': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20',
};

const ITEMS_PER_PAGE = 12;

export default function Sales({ onOpenSale }: Props) {
  const sales = useStore((s) => s.sales);
  const deleteSale = useStore((s) => s.deleteSale);

  const [search, setSearch] = useState('');
  const [marketplaceFilter, setMarketplaceFilter] = useState<MarketplaceType | 'all'>('all');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const marketplaces = useMemo(() => {
    const set = new Set(sales.map((s) => s.marketplace));
    return Array.from(set);
  }, [sales]);

  const filtered = useMemo(() => {
    return sales.filter((s) => {
      const matchesSearch = !search || s.productName.toLowerCase().includes(search.toLowerCase()) || s.marketplace.toLowerCase().includes(search.toLowerCase());
      const matchesMarket = marketplaceFilter === 'all' || s.marketplace === marketplaceFilter;
      return matchesSearch && matchesMarket;
    });
  }, [sales, search, marketplaceFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalRevenue = filtered.reduce((sum, s) => sum + s.quantity * s.unitPrice, 0);
  const totalProfit = filtered.reduce((sum, s) => sum + s.profit, 0);
  const avgTicket = filtered.length > 0 ? totalRevenue / filtered.length : 0;
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-100">Vendas</h2>
            <span className="px-2.5 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
              {filtered.length}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Gerencie todas as suas vendas</p>
        </div>
        <button
          onClick={() => { onOpenSale(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold hover:from-indigo-600 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/30"
        >
          <Plus size={16} />
          Nova Venda
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Vendas', value: filtered.length.toString(), sub: 'transações', color: 'text-slate-100' },
          { label: 'Faturamento', value: formatCurrency(totalRevenue), sub: 'receita bruta', color: 'text-blue-400' },
          { label: 'Ticket Médio', value: formatCurrency(avgTicket), sub: 'por venda', color: 'text-indigo-400' },
          { label: 'Lucro Total', value: formatCurrency(totalProfit), sub: `Margem ${formatPercent(avgMargin)}`, color: 'text-green-400' },
        ].map((card, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-500 mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
          <Search size={15} className="text-slate-500" />
          <input
            type="text"
            placeholder="Buscar produto ou marketplace..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full"
          />
        </div>
        <select
          value={marketplaceFilter}
          onChange={(e) => { setMarketplaceFilter(e.target.value as MarketplaceType | 'all'); setPage(1); }}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300 outline-none"
        >
          <option value="all">Todos Marketplaces</option>
          {marketplaces.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {['Produto', 'Qtd', 'Preço Unit.', 'Marketplace', 'Data', 'Taxa', 'Frete', 'Custo', 'Lucro', 'Margem', 'Ações'].map((h) => (
                  <th key={h} className={cn('text-xs font-medium text-slate-500 px-4 py-3', h === 'Ações' ? 'text-right pr-5' : 'text-left')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-slate-500">
                    <ShoppingCart size={32} className="mx-auto mb-3 opacity-30" />
                    <p>Nenhuma venda encontrada</p>
                  </td>
                </tr>
              ) : (
                paginated.map((sale) => {
                  const revenue = sale.quantity * sale.unitPrice;
                  const margin = revenue > 0 ? (sale.profit / revenue) * 100 : 0;
                  return (
                    <tr key={sale.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-200 max-w-[160px] truncate">{sale.productName}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{sale.quantity}</td>
                      <td className="px-4 py-3 text-slate-300">{formatCurrency(sale.unitPrice)}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full border',
                          marketplaceBadgeColors[sale.marketplace] ?? 'bg-slate-700 text-slate-400 border-slate-700'
                        )}>
                          {sale.marketplace}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{formatDate(sale.date)}</td>
                      <td className="px-4 py-3 text-slate-400">{sale.marketplaceFee}%</td>
                      <td className="px-4 py-3 text-slate-400">{formatCurrency(sale.shippingCost)}</td>
                      <td className="px-4 py-3 text-slate-400">{formatCurrency(sale.productionCost)}</td>
                      <td className="px-4 py-3 font-semibold text-green-400">{formatCurrency(sale.profit)}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          margin >= 60 ? 'bg-green-500/20 text-green-400' :
                          margin >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        )}>
                          {formatPercent(margin)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => deleteSale(sale.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800">
            <p className="text-xs text-slate-500">
              Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && <RegisterSaleModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
