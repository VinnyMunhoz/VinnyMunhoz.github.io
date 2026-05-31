import { useState } from 'react';
import { Warehouse, Plus, AlertTriangle, CheckCircle, XCircle, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import type { StockItem } from '../types';
import { generateId } from '../lib/utils';

type StockCategory = 'Todos' | 'Filamentos' | 'Resinas' | 'Embalagens' | 'Peças' | 'Produtos Prontos';

function getStockStatus(quantity: number, minStock: number) {
  if (quantity <= 0) return { label: 'Crítico', color: 'bg-red-500/20 text-red-400', icon: XCircle };
  if (quantity <= minStock) return { label: 'Baixo', color: 'bg-yellow-500/20 text-yellow-400', icon: AlertTriangle };
  return { label: 'OK', color: 'bg-green-500/20 text-green-400', icon: CheckCircle };
}

function AddStockModal({ item, onClose, onSave }: {
  item?: StockItem;
  onClose: () => void;
  onSave: (s: StockItem) => void;
}) {
  const [name, setName] = useState(item?.name ?? '');
  const [quantity, setQuantity] = useState(item?.quantity ?? 0);
  const [unit, setUnit] = useState(item?.unit ?? 'un');
  const [unitCost, setUnitCost] = useState(item?.unitCost ?? 0);
  const [supplier, setSupplier] = useState(item?.supplier ?? '');
  const [minStock, setMinStock] = useState(item?.minStock ?? 1);
  const [category, setCategory] = useState<string>(item?.category ?? 'Filamentos');
  const [purchaseDate, setPurchaseDate] = useState(item?.purchaseDate ?? '2026-05-31');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: item?.id ?? generateId(),
      name, quantity, unit, unitCost,
      totalCost: quantity * unitCost,
      supplier, purchaseDate, minStock,
      category: category as StockItem['category'],
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-100">{item ? 'Editar Item' : 'Novo Item de Estoque'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Nome do Item</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500">
                {['Filamentos', 'Resinas', 'Embalagens', 'Peças', 'Produtos Prontos', 'Outros'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Unidade</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500">
                {['un', 'kg', 'g', 'rolo', 'm', 'L', 'mL'].map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Quantidade</label>
              <input type="number" step="0.01" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Estoque Mínimo</label>
              <input type="number" step="0.01" value={minStock} onChange={(e) => setMinStock(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Custo Unitário (R$)</label>
              <input type="number" step="0.01" value={unitCost} onChange={(e) => setUnitCost(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Data Compra</label>
              <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Fornecedor</label>
            <input value={supplier} onChange={(e) => setSupplier(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800">Cancelar</button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Stock() {
  const stockItems = useStore((s) => s.stockItems);
  const addStockItem = useStore((s) => s.addStockItem);
  const updateStockItem = useStore((s) => s.updateStockItem);

  const [activeCategory, setActiveCategory] = useState<StockCategory>('Todos');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<StockItem | undefined>();

  const categories: StockCategory[] = ['Todos', 'Filamentos', 'Resinas', 'Embalagens', 'Peças', 'Produtos Prontos'];

  const lowStockItems = stockItems.filter((s) => s.quantity <= s.minStock);

  const filtered = stockItems.filter((s) => {
    const matchesCat = activeCategory === 'Todos' || s.category === activeCategory;
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.supplier.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  function handleSave(item: StockItem) {
    if (editItem) {
      updateStockItem(item.id, item);
    } else {
      addStockItem(item);
    }
    setEditItem(undefined);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-100">Estoque</h2>
            <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full">{stockItems.length}</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Controle de materiais e produtos</p>
        </div>
        <button
          onClick={() => { setEditItem(undefined); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold hover:from-indigo-600 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/30"
        >
          <Plus size={16} />
          Adicionar Item
        </button>
      </div>

      {/* Low stock alert */}
      {lowStockItems.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-yellow-400">Atenção: {lowStockItems.length} item(ns) com estoque baixo</p>
            <p className="text-xs text-slate-400">
              {lowStockItems.map((i) => i.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const count = cat === 'Todos' ? stockItems.length : stockItems.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition-colors',
                activeCategory === cat
                  ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              )}
            >
              {cat} {count > 0 && <span className="ml-1 text-xs opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
        <Search size={15} className="text-slate-500" />
        <input
          type="text"
          placeholder="Buscar item ou fornecedor..."
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
                {['Item', 'Categoria', 'Quantidade', 'Estoque Mín.', 'Nível', 'Custo Unit.', 'Custo Total', 'Fornecedor', 'Última Compra', 'Status', 'Ações'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-slate-500">
                    <Warehouse size={32} className="mx-auto mb-3 opacity-30" />
                    <p>Nenhum item encontrado</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const status = getStockStatus(item.quantity, item.minStock);
                  const StatusIcon = status.icon;
                  const levelPct = item.minStock > 0 ? Math.min((item.quantity / (item.minStock * 2)) * 100, 100) : 100;
                  return (
                    <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-200">{item.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">{item.category}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-100">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-24">
                          <div className="w-full h-1.5 bg-slate-800 rounded-full">
                            <div
                              className={cn('h-1.5 rounded-full', item.quantity <= 0 ? 'bg-red-500' : item.quantity <= item.minStock ? 'bg-yellow-500' : 'bg-green-500')}
                              style={{ width: `${levelPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{formatCurrency(item.unitCost)}</td>
                      <td className="px-4 py-3 font-semibold text-slate-100">{formatCurrency(item.totalCost)}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{item.supplier}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{formatDate(item.purchaseDate)}</td>
                      <td className="px-4 py-3">
                        <span className={cn('flex items-center gap-1 text-xs px-2 py-0.5 rounded-full w-fit', status.color)}>
                          <StatusIcon size={11} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => { setEditItem(item); setShowModal(true); }}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors whitespace-nowrap"
                        >
                          + Adicionar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddStockModal
          item={editItem}
          onClose={() => { setShowModal(false); setEditItem(undefined); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
