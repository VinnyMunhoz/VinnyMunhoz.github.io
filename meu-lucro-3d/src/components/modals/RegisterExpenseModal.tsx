import { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { generateId } from '../../lib/utils';
import type { ExpenseCategory, PaymentMethod, Expense } from '../../types';

interface Props {
  onClose: () => void;
}

const categories: ExpenseCategory[] = [
  'Filamento', 'Resina', 'Embalagens', 'Energia', 'Ferramentas',
  'Marketing', 'Taxas e Impostos', 'Frete e Logística', 'Manutenção',
  'Software e Assinaturas', 'Outros',
];

const paymentMethods: PaymentMethod[] = [
  'Pix', 'Cartão Crédito', 'Cartão Débito', 'Boleto', 'Dinheiro', 'Transferência',
];

export default function RegisterExpenseModal({ onClose }: Props) {
  const products = useStore((s) => s.products);
  const addExpense = useStore((s) => s.addExpense);

  const [value, setValue] = useState('');
  const [date, setDate] = useState('2026-05-31');
  const [category, setCategory] = useState<ExpenseCategory>('Filamento');
  const [supplier, setSupplier] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Pix');
  const [notes, setNotes] = useState('');
  const [productId, setProductId] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const expense: Expense = {
      id: generateId(),
      value: parseFloat(value) || 0,
      date,
      category,
      supplier,
      paymentMethod,
      notes,
      productId: productId || undefined,
    };
    addExpense(expense);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <CreditCard size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Registrar Gasto</h2>
              <p className="text-xs text-slate-500">Adicione uma nova despesa ao sistema</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0,00"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-red-500 transition-colors placeholder-slate-600"
            />
          </div>

          {/* Date + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-red-500 transition-colors"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Fornecedor</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Nome do fornecedor"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-red-500 transition-colors placeholder-slate-600"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Forma de Pagamento</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-red-500 transition-colors"
            >
              {paymentMethods.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Related Product */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Produto Relacionado (opcional)</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-red-500 transition-colors"
            >
              <option value="">Sem produto específico</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Observação</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva o gasto..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-red-500 transition-colors placeholder-slate-600 resize-none"
            />
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
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold hover:from-red-600 hover:to-rose-700 transition-all shadow-lg shadow-red-500/30"
            >
              Registrar Gasto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
