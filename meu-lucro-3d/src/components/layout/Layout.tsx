import { Outlet } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import Sidebar from './Sidebar';
import Header from './Header';
import FloatingButton from '../common/FloatingButton';
import RegisterSaleModal from '../modals/RegisterSaleModal';
import RegisterExpenseModal from '../modals/RegisterExpenseModal';

interface LayoutProps {
  onOpenSale: () => void;
  onOpenExpense: () => void;
  showSaleModal: boolean;
  showExpenseModal: boolean;
  onCloseSale: () => void;
  onCloseExpense: () => void;
}

export default function Layout({
  onOpenSale,
  onOpenExpense,
  showSaleModal,
  showExpenseModal,
  onCloseSale,
  onCloseExpense,
}: LayoutProps) {
  const sidebarOpen = useStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-10" />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <FloatingButton
        onOpenSale={onOpenSale}
        onOpenExpense={onOpenExpense}
      />

      {/* Modals */}
      {showSaleModal && <RegisterSaleModal onClose={onCloseSale} />}
      {showExpenseModal && <RegisterExpenseModal onClose={onCloseExpense} />}
    </div>
  );
}
