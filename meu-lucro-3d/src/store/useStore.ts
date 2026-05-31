import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Sale, Expense, Product, StockItem, ChatMessage, AppSettings } from '../types';
import { mockSales, mockExpenses, mockProducts, mockStockItems, mockChatMessages } from '../lib/mockData';
import { generateId } from '../lib/utils';

const defaultSettings: AppSettings = {
  userName: 'Vinny',
  email: 'vinny@meulucro3d.com.br',
  businessName: 'Meu Lucro 3D',
  phone: '(31) 99999-0000',
  defaultMaterial: 'PLA+',
  openaiApiKey: '',
  accentColor: 'indigo',
  marketplaces: [
    { name: 'Mercado Livre', active: true, defaultFee: 12 },
    { name: 'Shopee', active: true, defaultFee: 14 },
    { name: 'TikTok Shop', active: true, defaultFee: 10 },
    { name: 'Amazon', active: true, defaultFee: 15 },
    { name: 'Venda Direta', active: true, defaultFee: 0 },
    { name: 'Atacado', active: false, defaultFee: 0 },
    { name: 'Loja Física', active: false, defaultFee: 0 },
  ],
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      sales: mockSales,
      expenses: mockExpenses,
      products: mockProducts,
      stockItems: mockStockItems,
      movements: [],
      chatMessages: mockChatMessages,
      darkMode: true,
      sidebarOpen: true,
      settings: defaultSettings,

      addSale: (sale: Sale) =>
        set((state) => ({ sales: [{ ...sale, id: generateId() }, ...state.sales] })),
      updateSale: (id: string, sale: Partial<Sale>) =>
        set((state) => ({
          sales: state.sales.map((s) => (s.id === id ? { ...s, ...sale } : s)),
        })),
      deleteSale: (id: string) =>
        set((state) => ({ sales: state.sales.filter((s) => s.id !== id) })),

      addExpense: (expense: Expense) =>
        set((state) => ({ expenses: [{ ...expense, id: generateId() }, ...state.expenses] })),
      updateExpense: (id: string, expense: Partial<Expense>) =>
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...expense } : e)),
        })),
      deleteExpense: (id: string) =>
        set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),

      addProduct: (product: Product) =>
        set((state) => ({ products: [{ ...product, id: generateId() }, ...state.products] })),
      updateProduct: (id: string, product: Partial<Product>) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
        })),
      deleteProduct: (id: string) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),

      addStockItem: (item: StockItem) =>
        set((state) => ({ stockItems: [{ ...item, id: generateId() }, ...state.stockItems] })),
      updateStockItem: (id: string, item: Partial<StockItem>) =>
        set((state) => ({
          stockItems: state.stockItems.map((s) => (s.id === id ? { ...s, ...item } : s)),
        })),
      deleteStockItem: (id: string) =>
        set((state) => ({ stockItems: state.stockItems.filter((s) => s.id !== id) })),

      addChatMessage: (message: ChatMessage) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, { ...message, id: generateId() }],
        })),
      clearChatMessages: () => set({ chatMessages: mockChatMessages }),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      updateSettings: (settings: Partial<AppSettings>) =>
        set((state) => ({ settings: { ...state.settings, ...settings } })),
    }),
    {
      name: 'meu-lucro-3d-storage',
      partialize: (state) => ({
        sales: state.sales,
        expenses: state.expenses,
        products: state.products,
        stockItems: state.stockItems,
        chatMessages: state.chatMessages,
        darkMode: state.darkMode,
        sidebarOpen: state.sidebarOpen,
        settings: state.settings,
      }),
    }
  )
);

// Selectors
export function getCurrentMonthSales(sales: Sale[]) {
  const now = new Date('2026-05-31');
  return sales.filter((s) => {
    const d = new Date(s.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
}

export function getLastMonthSales(sales: Sale[]) {
  const now = new Date('2026-05-31');
  const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return sales.filter((s) => {
    const d = new Date(s.date);
    return d.getFullYear() === last.getFullYear() && d.getMonth() === last.getMonth();
  });
}

export function getCurrentMonthExpenses(expenses: Expense[]) {
  const now = new Date('2026-05-31');
  return expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
}

export function getLastMonthExpenses(expenses: Expense[]) {
  const now = new Date('2026-05-31');
  const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === last.getFullYear() && d.getMonth() === last.getMonth();
  });
}

export function getCurrentMonthRevenue(sales: Sale[]) {
  return getCurrentMonthSales(sales).reduce(
    (sum, s) => sum + s.quantity * s.unitPrice,
    0
  );
}

export function getCurrentMonthProfit(sales: Sale[]) {
  return getCurrentMonthSales(sales).reduce((sum, s) => sum + s.profit, 0);
}

export function getCurrentMonthExpenseTotal(expenses: Expense[]) {
  return getCurrentMonthExpenses(expenses).reduce((sum, e) => sum + e.value, 0);
}

export function getTopProducts(sales: Sale[]) {
  const monthSales = getCurrentMonthSales(sales);
  const map: Record<string, { name: string; units: number; revenue: number; profit: number }> = {};
  for (const s of monthSales) {
    if (!map[s.productId]) {
      map[s.productId] = { name: s.productName, units: 0, revenue: 0, profit: 0 };
    }
    map[s.productId]!.units += s.quantity;
    map[s.productId]!.revenue += s.quantity * s.unitPrice;
    map[s.productId]!.profit += s.profit;
  }
  return Object.values(map).sort((a, b) => b.profit - a.profit);
}

export function getExpensesByCategory(expenses: Expense[]) {
  const monthExpenses = getCurrentMonthExpenses(expenses);
  const map: Record<string, number> = {};
  for (const e of monthExpenses) {
    map[e.category] = (map[e.category] ?? 0) + e.value;
  }
  return Object.entries(map)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);
}

export function getWeeklyData(sales: Sale[], expenses: Expense[]) {
  const weeks = [];
  const baseDate = new Date('2026-05-31');
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(baseDate);
    weekStart.setDate(weekStart.getDate() - i * 7 - 6);
    const weekEnd = new Date(baseDate);
    weekEnd.setDate(weekEnd.getDate() - i * 7);

    const weekSales = sales.filter((s) => {
      const d = new Date(s.date);
      return d >= weekStart && d <= weekEnd;
    });
    const weekExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return d >= weekStart && d <= weekEnd;
    });

    const revenue = weekSales.reduce((sum, s) => sum + s.quantity * s.unitPrice, 0);
    const expenseTotal = weekExpenses.reduce((sum, e) => sum + e.value, 0);
    const profit = weekSales.reduce((sum, s) => sum + s.profit, 0);

    weeks.push({
      label: `S${8 - i}`,
      revenue: Math.round(revenue * 100) / 100,
      expenses: Math.round(expenseTotal * 100) / 100,
      profit: Math.round(profit * 100) / 100,
    });
  }
  return weeks;
}

export function getMonthlyData(sales: Sale[], expenses: Expense[]) {
  const months = [];
  const baseDate = new Date('2026-05-31');
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
    const monthSales = sales.filter((s) => {
      const d = new Date(s.date);
      return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth();
    });
    const monthExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth();
    });

    const revenue = monthSales.reduce((sum, s) => sum + s.quantity * s.unitPrice, 0);
    const expenseTotal = monthExpenses.reduce((sum, e) => sum + e.value, 0);
    const profit = monthSales.reduce((sum, s) => sum + s.profit, 0);

    months.push({
      label: monthNames[date.getMonth()] ?? '',
      revenue: Math.round(revenue * 100) / 100,
      expenses: Math.round(expenseTotal * 100) / 100,
      profit: Math.round(profit * 100) / 100,
    });
  }
  return months;
}

export function getMarketplaceData(sales: Sale[]) {
  const map: Record<string, number> = {};
  for (const s of sales) {
    map[s.marketplace] = (map[s.marketplace] ?? 0) + s.quantity * s.unitPrice;
  }
  return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }));
}
