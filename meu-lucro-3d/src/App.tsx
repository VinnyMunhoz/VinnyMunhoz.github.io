import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Movements from './pages/Movements';
import Sales from './pages/Sales';
import Expenses from './pages/Expenses';
import Products from './pages/Products';
import Stock from './pages/Stock';
import Reports from './pages/Reports';
import AIAssistant from './pages/AIAssistant';
import Settings from './pages/Settings';

export default function App() {
  const darkMode = useStore((s) => s.darkMode);
  const [showSale, setShowSale] = useState(false);
  const [showExpense, setShowExpense] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [darkMode]);

  return (
    <BrowserRouter basename="/meu-lucro-3d">
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              onOpenSale={() => setShowSale(true)}
              onOpenExpense={() => setShowExpense(true)}
              showSaleModal={showSale}
              showExpenseModal={showExpense}
              onCloseSale={() => setShowSale(false)}
              onCloseExpense={() => setShowExpense(false)}
            />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="movimentacoes" element={<Movements />} />
          <Route path="vendas" element={<Sales onOpenSale={() => setShowSale(true)} />} />
          <Route path="gastos" element={<Expenses onOpenExpense={() => setShowExpense(true)} />} />
          <Route path="produtos" element={<Products />} />
          <Route path="estoque" element={<Stock />} />
          <Route path="relatorios" element={<Reports />} />
          <Route path="assistente" element={<AIAssistant />} />
          <Route path="configuracoes" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
