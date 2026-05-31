import { useState, useMemo } from 'react';
import { CreditCard, Plus, Search, Trash2, Edit2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import RegisterExpenseModal from '../components/modals/RegisterExpenseModal';
import type { ExpenseCategory } from '../types';

interface Props {
  onOpenExpense: () => void;
}

const categoryColors: Record<string, string> = {
  'Filamento': 'bg-indigo-500/20 text-indigo-400',
  'Resina': 'bg-violet-500/20 text-violet-400',
  'Embalagens': 'bg-blue-500/20 text-blue-400',
  'Energia': 'bg-yellow-500/20 text-yellow-400',
  'Ferramentas': 'bg-orange-500/20 text-orange-400',
  'Marketing': 'bg-pink-500/20 text-pink-400',
  'Taxas e Impostos': 'bg-red-500/20 text-red-400',
  'Frete e Logística': 'bg-cyan-500/20 text-cyan-400',
  'Manutenção': 'bg-slate-500/20 text-slate-300',
  'Software e Assinaturas': 'bg-teal-500/20 text-teal-400',
  'Outros': 'bg-gray-500/20 text-gray-400',
};

const categories: ExpenseCategory[] = [
  'Filamento', 'Resina', 'Embalagens', 'Energia', 'Ferramentas',
  'Marketing', 'Taxas e Impostos', 'Frete e Logística', 'Manutenção',
  'Software e Assinaturas', 'Outros',
];

export default function Expenses({ onOpenExpense }: Props) {
  const expenses = useStore((s) => s.expenses);
  const deleteExpense = useStore((s) => s.deleteExpense);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | 'all'>('all');
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch = !search || e.category.toLowerCase().includes(search.toLowerCase()) || e.supplier.toLowerCase().includes(search.toLowerCase()) || e.notes.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === 'all' || e.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [expenses, search, categoryFilter]);

  const total = filtered.reduce((sum, e) => sum + e.value, 0);
  const avgDaily = total / 30;

  // Category breakdown
  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of filtered) {
      map[e.category] = (map[e.category] ?? 0) + e.value;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  const maxCategory = byCategory[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-100">Gastos</h2>
            <span className="px-2.5 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full">
              {filtered.length}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Controle de despesas e custos</p>
        </div>
        <button
          onClick={() => { onOpenExpense(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold hover:from-red-600 hover:to-rose-700 transition-all shadow-lg shadow-red-500/30"
        >
          <Plus size={16} />
          Novo Gasto
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total do Período', value: formatCurrency(total), color: 'text-red-400' },
          { label: 'Maior Categoria', value: maxCategory?.[0] ?? 'N/A', color: 'text-orange-400' },
          { label: 'Média Diária', value: formatCurrency(avgDaily), color: 'text-yellow-400' },
          { label: 'Transações', value: filtered.length.toString(), color: 'text-slate-200' },
        ].map((card, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-500 mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Category summary pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryFilter('all')}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors',
            categoryFilter === 'all'
              ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
          )}
        >
          Todos
        </button>
        {categories.map((cat) => {
          const catTotal = expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.value, 0);
          if (catTotal === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors',
                categoryFilter === cat
                  ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              )}
            >
              {cat}
              <span className="font-semibold">{formatCurrency(catTotal)}</span>
            </button>
          );
        })}
      </div>

      {/* Category Cards row */}
      {byCategory.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {byCategory.slice(0, 4).map(([cat, val]) => (
            <div key={cat} className={cn('rounded-xl p-3 border', categoryColors[cat]?.replace('text-', 'border-').replace('/20', '/20') ?? 'bg-slate-800 border-slate-700')}>
              <div className={cn('text-xs font-medium mb-1', categoryColors[cat]?.split(' ')[1] ?? 'text-slate-400')}>
                {cat}
              </div>
              <p className="text-lg font-bold text-slate-100">{formatCurrency(val)}</p>
              <p className="text-xs text-slate-500 mt-1">
                {total > 0 ? ((val / total) * 100).toFixed(1) : 0}% do total
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
        <Search size={15} className="text-slate-500" />
        <input
          type="text"
          placeholder="Buscar por categoria, fornecedor ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {['Data', 'Categoria', 'Fornecedor', 'Forma Pagamento', 'Descrição', 'Valor', 'Ações'].map((h) => (
                  <th key={h} className={cn('text-xs font-medium text-slate-500 px-4 py-3', h === 'Ações' || h === 'Valor' ? 'text-right pr-5' : 'text-left')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <CreditCard size={32} className="mx-auto mb-3 opacity-30" />
                    <p>Nenhum gasto encontrado</p>
                  </td>
                </tr>
              ) : (
                filtered.map((exp) => (
                  <tr key={exp.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{formatDate(exp.date)}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', categoryColors[exp.category] ?? 'bg-slate-700 text-slate-400')}>
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{exp.supplier || '—'}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{exp.paymentMethod}</td>
                    <td className="px-4 py-3 text-slate-400 max-w-[200px] truncate">{exp.notes || '—'}</td>
                    <td className="px-5 py-3 text-right font-bold text-red-400">{formatCurrency(exp.value)}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <RegisterExpenseModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
