import { useState } from 'react';
import { X, ShoppingCart, TrendingUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { generateId, formatCurrency } from '../../lib/utils';
import type { MarketplaceType, Sale } from '../../types';

interface Props {
  onClose: () => void;
}

const marketplaces: MarketplaceType[] = [
  'Mercado Livre', 'Shopee', 'TikTok Shop', 'Amazon', 'Venda Direta', 'Atacado', 'Loja Física',
];

const defaultFees: Record<MarketplaceType, number> = {
  'Mercado Livre': 12,
  'Shopee': 14,
  'TikTok Shop': 10,
  'Amazon': 15,
  'Venda Direta': 0,
  'Atacado': 0,
  'Loja Física': 0,
};

export default function RegisterSaleModal({ onClose }: Props) {
  const products = useStore((s) => s.products);
  const addSale = useStore((s) => s.addSale);

  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(products[0]?.defaultPrice ?? 0);
  const [marketplace, setMarketplace] = useState<MarketplaceType>('Mercado Livre');
  const [date, setDate] = useState('2026-05-31');
  const [marketplaceFee, setMarketplaceFee] = useState(12);
  const [shippingCost, setShippingCost] = useState(0);
  const [productionCost, setProductionCost] = useState(products[0]?.unitCost ?? 0);

  const revenue = quantity * unitPrice;
  const feeValue = revenue * (marketplaceFee / 100);
  const profit = revenue - feeValue - shippingCost - productionCost * quantity;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  function handleProductChange(id: string) {
    setProductId(id);
    const p = products.find((x) => x.id === id);
    if (p) {
      setUnitPrice(p.defaultPrice);
      setProductionCost(p.unitCost);
    }
  }

  function handleMarketplaceChange(m: MarketplaceType) {
    setMarketplace(m);
    setMarketplaceFee(defaultFees[m]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const product = products.find((p) => p.id === productId);
    const sale: Sale = {
      id: generateId(),
      productId,
      productName: product?.name ?? 'Produto',
      quantity,
      unitPrice,
      marketplace,
      date,
      marketplaceFee,
      shippingCost,
      productionCost,
      profit,
      status: 'completed',
    };
    addSale(sale);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <ShoppingCart size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Registrar Venda</h2>
              <p className="text-xs text-slate-500">Adicione uma nova venda ao sistema</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Produto</label>
            <select
              value={productId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Quantity + Unit Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Quantidade</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Preço Unitário (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Marketplace</label>
            <select
              value={marketplace}
              onChange={(e) => handleMarketplaceChange(e.target.value as MarketplaceType)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
            >
              {marketplaces.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Fee + Shipping + Cost */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Taxa (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={marketplaceFee}
                onChange={(e) => setMarketplaceFee(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Frete (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Custo Unit. (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={productionCost}
                onChange={(e) => setProductionCost(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Calculation summary */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-indigo-400" />
              <span className="text-sm font-semibold text-slate-200">Resultado da Venda</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Receita Total:</span>
                <span className="text-slate-200 font-medium">{formatCurrency(revenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Taxa ({marketplaceFee}%):</span>
                <span className="text-red-400 font-medium">-{formatCurrency(feeValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Frete:</span>
                <span className="text-red-400 font-medium">-{formatCurrency(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Custo Prod.:</span>
                <span className="text-red-400 font-medium">-{formatCurrency(productionCost * quantity)}</span>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-2 flex justify-between items-center">
              <span className="text-slate-300 font-semibold">Lucro Estimado</span>
              <div className="text-right">
                <span className={`text-lg font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(profit)}
                </span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${profit >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {margin.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold hover:from-indigo-600 hover:to-violet-700 transition-all shadow-lg shadow-indigo-500/30"
            >
              Registrar Venda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
