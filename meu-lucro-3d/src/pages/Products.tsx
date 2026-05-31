import { useState } from 'react';
import { Package, Plus, LayoutGrid, List, Search, Trash2, Edit2, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatPercent, cn } from '../lib/utils';
import type { Product } from '../types';
import { generateId } from '../lib/utils';

type ViewMode = 'grid' | 'list';
type SortBy = 'margin' | 'profit' | 'name' | 'stock';

const categoryColors: Record<string, string> = {
  'Miniaturas': 'bg-purple-500/20 text-purple-400',
  'Suportes': 'bg-blue-500/20 text-blue-400',
  'Organizadores': 'bg-indigo-500/20 text-indigo-400',
  'Decoração': 'bg-pink-500/20 text-pink-400',
  'Cozinha': 'bg-orange-500/20 text-orange-400',
  'Acessórios': 'bg-green-500/20 text-green-400',
};

const materialColors: Record<string, string> = {
  'PLA': 'text-blue-400',
  'PLA+': 'text-indigo-400',
  'PETG': 'text-green-400',
  'PLA+ Silk': 'text-pink-400',
  'PLA+ Silk Dourado': 'text-yellow-400',
  'Resina': 'text-purple-400',
};

function ProductModal({ product, onClose, onSave }: {
  product?: Product;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [name, setName] = useState(product?.name ?? '');
  const [sku, setSku] = useState(product?.sku ?? '');
  const [category, setCategory] = useState(product?.category ?? 'Suportes');
  const [productionCost, setProductionCost] = useState(product?.productionCost ?? 0);
  const [packagingCost, setPackagingCost] = useState(product?.packagingCost ?? 0);
  const [defaultPrice, setDefaultPrice] = useState(product?.defaultPrice ?? 0);
  const [currentStock, setCurrentStock] = useState(product?.currentStock ?? 0);
  const [material, setMaterial] = useState(product?.material ?? 'PLA+');
  const [printTime, setPrintTime] = useState(product?.printTime ?? 0);
  const [weightGrams, setWeightGrams] = useState(product?.weightGrams ?? 0);

  const unitCost = productionCost + packagingCost;
  const margin = defaultPrice > 0 ? ((defaultPrice - unitCost) / defaultPrice) * 100 : 0;
  const roi = unitCost > 0 ? ((defaultPrice - unitCost) / unitCost) * 100 : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: product?.id ?? generateId(),
      name, sku, category, productionCost, packagingCost, defaultPrice,
      currentStock, material, printTime, weightGrams,
      unitCost, unitProfit: defaultPrice - unitCost, margin, roi,
      marketplaces: product?.marketplaces ?? [],
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-100">{product ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Nome do Produto</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">SKU</label>
              <input value={sku} onChange={(e) => setSku(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500">
                {['Miniaturas', 'Suportes', 'Organizadores', 'Decoração', 'Cozinha', 'Acessórios', 'Outros'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Material</label>
              <input value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Preço de Venda (R$)</label>
              <input type="number" step="0.01" value={defaultPrice} onChange={(e) => setDefaultPrice(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Custo Produção (R$)</label>
              <input type="number" step="0.01" value={productionCost} onChange={(e) => setProductionCost(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Custo Embalagem (R$)</label>
              <input type="number" step="0.01" value={packagingCost} onChange={(e) => setPackagingCost(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tempo Impressão (h)</label>
              <input type="number" step="0.5" value={printTime} onChange={(e) => setPrintTime(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Peso (g)</label>
              <input type="number" value={weightGrams} onChange={(e) => setWeightGrams(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Estoque Atual</label>
              <input type="number" value={currentStock} onChange={(e) => setCurrentStock(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700 flex items-center gap-6 text-sm">
            <div>
              <p className="text-slate-500 text-xs">Custo Total</p>
              <p className="text-slate-200 font-semibold">{formatCurrency(unitCost)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Margem</p>
              <p className={`font-semibold ${margin >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>{formatPercent(margin)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">ROI</p>
              <p className={`font-semibold ${roi >= 100 ? 'text-green-400' : 'text-yellow-400'}`}>{formatPercent(roi)}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800">Cancelar</button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold">Salvar Produto</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Products() {
  const products = useStore((s) => s.products);
  const addProduct = useStore((s) => s.addProduct);
  const updateProduct = useStore((s) => s.updateProduct);
  const deleteProduct = useStore((s) => s.deleteProduct);

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('margin');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();

  const filtered = products
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'margin') return b.margin - a.margin;
      if (sortBy === 'profit') return b.unitProfit - a.unitProfit;
      if (sortBy === 'stock') return b.currentStock - a.currentStock;
      return a.name.localeCompare(b.name);
    });

  function handleSave(p: Product) {
    if (editProduct) {
      updateProduct(p.id, p);
    } else {
      addProduct(p);
    }
    setEditProduct(undefined);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-100">Produtos</h2>
            <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full">{products.length}</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Gerencie seu catálogo de produtos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1">
            <button onClick={() => setViewMode('grid')} className={cn('p-1.5 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300')}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setViewMode('list')} className={cn('p-1.5 rounded-lg transition-colors', viewMode === 'list' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300')}>
              <List size={16} />
            </button>
          </div>
          <button
            onClick={() => { setEditProduct(undefined); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold hover:from-indigo-600 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/30"
          >
            <Plus size={16} />
            Novo Produto
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
          <Search size={15} className="text-slate-500" />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300 outline-none"
        >
          <option value="margin">Ordenar por Margem</option>
          <option value="profit">Ordenar por Lucro</option>
          <option value="name">Ordenar por Nome</option>
          <option value="stock">Ordenar por Estoque</option>
        </select>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group">
              {/* Photo placeholder */}
              <div className="w-full h-32 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:from-indigo-500/20 group-hover:to-violet-500/20 transition-all">
                <Package size={36} className="text-indigo-400/50" />
              </div>

              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-100 text-sm leading-tight">{product.name}</p>
                  {product.margin >= 65 && <Star size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full', categoryColors[product.category] ?? 'bg-slate-700 text-slate-400')}>
                    {product.category}
                  </span>
                  <span className={cn('text-xs font-medium', materialColors[product.material] ?? 'text-slate-400')}>
                    {product.material}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{product.sku}</p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div>
                    <p className="text-xs text-slate-500">Preço</p>
                    <p className="text-sm font-bold text-slate-100">{formatCurrency(product.defaultPrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Custo</p>
                    <p className="text-sm text-slate-300">{formatCurrency(product.unitCost)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Margem</p>
                    <p className={`text-sm font-bold ${product.margin >= 60 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {formatPercent(product.margin)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Estoque</p>
                    <p className={`text-sm font-bold ${product.currentStock <= 5 ? 'text-red-400' : 'text-slate-200'}`}>
                      {product.currentStock} un.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => { setEditProduct(product); setShowModal(true); }}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 transition-colors border border-indigo-500/20 flex items-center justify-center gap-1"
                  >
                    <Edit2 size={12} /> Editar
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {['Produto', 'SKU', 'Categoria', 'Preço', 'Custo', 'Lucro Unit.', 'Margem', 'ROI', 'Estoque', 'Ações'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-200">{product.name}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{product.sku}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', categoryColors[product.category] ?? 'bg-slate-700 text-slate-400')}>
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-100">{formatCurrency(product.defaultPrice)}</td>
                  <td className="px-4 py-3 text-slate-300">{formatCurrency(product.unitCost)}</td>
                  <td className="px-4 py-3 text-green-400 font-semibold">{formatCurrency(product.unitProfit)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', product.margin >= 60 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400')}>
                      {formatPercent(product.margin)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-indigo-400">{formatPercent(product.roi)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('font-semibold', product.currentStock <= 5 ? 'text-red-400' : 'text-slate-200')}>
                      {product.currentStock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditProduct(product); setShowModal(true); }} className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={() => { setShowModal(false); setEditProduct(undefined); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
