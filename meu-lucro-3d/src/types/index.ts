export type MarketplaceType =
  | 'Mercado Livre'
  | 'Shopee'
  | 'TikTok Shop'
  | 'Amazon'
  | 'Venda Direta'
  | 'Atacado'
  | 'Loja Física';

export type ExpenseCategory =
  | 'Filamento'
  | 'Resina'
  | 'Embalagens'
  | 'Energia'
  | 'Ferramentas'
  | 'Marketing'
  | 'Taxas e Impostos'
  | 'Frete e Logística'
  | 'Manutenção'
  | 'Software e Assinaturas'
  | 'Outros';

export type PaymentMethod =
  | 'Pix'
  | 'Cartão Crédito'
  | 'Cartão Débito'
  | 'Boleto'
  | 'Dinheiro'
  | 'Transferência';

export type SaleStatus = 'completed' | 'pending' | 'cancelled' | 'refunded';

export type MovementType = 'sale' | 'expense' | 'purchase' | 'adjustment';

export type MovementStatus = 'completed' | 'pending' | 'cancelled';

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  marketplace: MarketplaceType;
  date: string;
  marketplaceFee: number;
  shippingCost: number;
  productionCost: number;
  profit: number;
  status: SaleStatus;
}

export interface Expense {
  id: string;
  value: number;
  date: string;
  category: ExpenseCategory;
  supplier: string;
  paymentMethod: PaymentMethod;
  notes: string;
  receipt?: string;
  productId?: string;
}

export interface ProductMarketplace {
  name: MarketplaceType;
  price: number;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  photo?: string;
  productionCost: number;
  packagingCost: number;
  printTime: number;
  weightGrams: number;
  material: string;
  defaultPrice: number;
  currentStock: number;
  marketplaces: ProductMarketplace[];
  unitCost: number;
  unitProfit: number;
  margin: number;
  roi: number;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  totalCost: number;
  unitCost: number;
  supplier: string;
  purchaseDate: string;
  minStock: number;
  category: string;
}

export interface Movement {
  id: string;
  type: MovementType;
  date: string;
  description: string;
  value: number;
  category: string;
  marketplace?: MarketplaceType;
  productId?: string;
  status: MovementStatus;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface MarketplaceConfig {
  name: MarketplaceType;
  active: boolean;
  defaultFee: number;
}

export interface AppSettings {
  userName: string;
  email: string;
  businessName: string;
  phone: string;
  defaultMaterial: string;
  openaiApiKey: string;
  marketplaces: MarketplaceConfig[];
  accentColor: string;
}

export interface AppState {
  sales: Sale[];
  expenses: Expense[];
  products: Product[];
  stockItems: StockItem[];
  movements: Movement[];
  chatMessages: ChatMessage[];
  darkMode: boolean;
  sidebarOpen: boolean;
  settings: AppSettings;

  addSale: (sale: Sale) => void;
  updateSale: (id: string, sale: Partial<Sale>) => void;
  deleteSale: (id: string) => void;

  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addStockItem: (item: StockItem) => void;
  updateStockItem: (id: string, item: Partial<StockItem>) => void;
  deleteStockItem: (id: string) => void;

  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;

  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}
