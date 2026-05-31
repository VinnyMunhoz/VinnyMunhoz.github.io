import { useState } from 'react';
import {
  Plus,
  X,
  ShoppingCart,
  CreditCard,
  Image,
  Mic,
  Upload,
  Package,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface FloatingButtonProps {
  onOpenSale: () => void;
  onOpenExpense: () => void;
}

const menuItems = [
  { icon: ShoppingCart, label: 'Registrar Venda', color: 'from-green-500 to-emerald-600', key: 'sale' },
  { icon: CreditCard, label: 'Registrar Gasto', color: 'from-red-500 to-rose-600', key: 'expense' },
  { icon: Package, label: 'Cadastrar Produto', color: 'from-blue-500 to-indigo-600', key: 'product' },
  { icon: Image, label: 'Enviar Imagem', color: 'from-purple-500 to-violet-600', key: 'image' },
  { icon: Mic, label: 'Gravar Áudio', color: 'from-orange-500 to-amber-600', key: 'audio' },
  { icon: Upload, label: 'Importar Arquivo', color: 'from-cyan-500 to-teal-600', key: 'import' },
];

export default function FloatingButton({ onOpenSale, onOpenExpense }: FloatingButtonProps) {
  const [open, setOpen] = useState(false);

  function handleAction(key: string) {
    setOpen(false);
    if (key === 'sale') onOpenSale();
    else if (key === 'expense') onOpenExpense();
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Menu Items */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col-reverse gap-3 animate-slide-up">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => handleAction(item.key)}
                className="flex items-center gap-3 group"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <span className="bg-slate-800/90 backdrop-blur border border-slate-700 text-slate-200 text-sm font-medium px-3 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.label}
                </span>
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center shadow-xl',
                    'bg-gradient-to-br', item.color,
                    'hover:scale-110 transition-transform'
                  )}
                >
                  <Icon size={20} className="text-white" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'w-14 h-14 rounded-full shadow-2xl',
          'bg-gradient-to-br from-indigo-500 to-violet-600',
          'flex items-center justify-center',
          'hover:scale-110 active:scale-95 transition-all duration-200',
          'shadow-indigo-500/40',
        )}
      >
        <div className={cn('transition-transform duration-300', open && 'rotate-45')}>
          {open ? (
            <X size={24} className="text-white" />
          ) : (
            <Plus size={24} className="text-white" />
          )}
        </div>
      </button>
    </>
  );
}
