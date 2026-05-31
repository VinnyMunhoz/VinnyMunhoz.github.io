import {
  ShoppingCart, TrendingUp, Percent, AlertCircle, Star,
  DollarSign, Receipt, Package, Zap, Wallet, BarChart3,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useStore } from '../store/useStore';
import {
  getCurrentMonthSales, getCurrentMonthRevenue, getCurrentMonthProfit,
  getCurrentMonthExpenseTotal, getTopProducts, getExpensesByCategory,
  getWeeklyData, getLastMonthSales, getLastMonthExpenses,
} from '../store/useStore';
import MetricCard from '../components/dashboard/MetricCard';
import { formatCurrency, formatPercent, formatDate } from '../lib/utils';

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

const marketplaceBadgeColors: Record<string, string> = {
  'Mercado Livre': 'bg-yellow-500/20 text-yellow-400',
  'Shopee': 'bg-orange-500/20 text-orange-400',
  'TikTok Shop': 'bg-slate-500/20 text-slate-300',
  'Amazon': 'bg-blue-500/20 text-blue-400',
  'Venda Direta': 'bg-green-500/20 text-green-400',
  'Atacado': 'bg-purple-500/20 text-purple-400',
  'Loja Física': 'bg-indigo-500/20 text-indigo-400',
};

export default function Dashboard() {
  const sales = useStore((s) => s.sales);
  const expenses = useStore((s) => s.expenses);
  const settings = useStore((s) => s.settings);

  const currentSales = getCurrentMonthSales(sales);
  const lastSales = getLastMonthSales(sales);
  const lastExpenses = getLastMonthExpenses(expenses);

  const revenue = getCurrentMonthRevenue(sales);
  const expenseTotal = getCurrentMonthExpenseTotal(expenses);
  const profit = getCurrentMonthProfit(sales);
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  const lastRevenue = lastSales.reduce((sum, s) => sum + s.quantity * s.unitPrice, 0);
  const lastProfit = lastSales.reduce((sum, s) => sum + s.profit, 0);
  const lastExpenseTotal = lastExpenses.reduce((sum, e) => sum + e.value, 0);

  const revenueTrend = lastRevenue > 0 ? ((revenue - lastRevenue) / lastRevenue) * 100 : 0;
  const profitTrend = lastProfit > 0 ? ((profit - lastProfit) / lastProfit) * 100 : 0;
  const expenseTrend = lastExpenseTotal > 0 ? ((expenseTotal - lastExpenseTotal) / lastExpenseTotal) * 100 : 0;

  const productionCosts = currentSales.reduce((sum, s) => sum + s.productionCost * s.quantity, 0);
  const marketplaceFees = currentSales.reduce((sum, s) => sum + s.quantity * s.unitPrice * (s.marketplaceFee / 100), 0);

  const topProducts = getTopProducts(sales);
  const expensesByCategory = getExpensesByCategory(expenses);
  const weeklyData = getWeeklyData(sales, expenses);

  // Recent movements (last 5)
  const recentMovements = [
    ...currentSales.map((s) => ({
      id: s.id,
      type: 'sale' as const,
      description: s.productName,
      marketplace: s.marketplace,
      date: s.date,
      value: s.quantity * s.unitPrice,
      profit: s.profit,
    })),
    ...expenses.slice(0, 5).map((e) => ({
      id: e.id,
      type: 'expense' as const,
      description: e.category,
      marketplace: undefined,
      date: e.date,
      value: -e.value,
      profit: -e.value,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const totalSalesCount = currentSales.length;
  const avgTicket = totalSalesCount > 0 ? revenue / totalSalesCount : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">
          Olá, {settings.userName}! 👋
        </h2>
        <p className="text-slate-400 mt-1">
          Aqui está seu resumo financeiro de <span className="text-indigo-400 font-medium">Maio 2026</span>
        </p>
      </div>

      {/* Alert Cards - horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-thin">
        {[
          {
            icon: ShoppingCart,
            label: 'Você vendeu',
            value: formatCurrency(revenue),
            sublabel: `${totalSalesCount} vendas este mês`,
            color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
            iconBg: 'bg-blue-500',
          },
          {
            icon: TrendingUp,
            label: 'Lucro estimado',
            value: formatCurrency(profit),
            sublabel: `Margem de ${formatPercent(margin)}`,
            color: 'bg-green-500/10 border-green-500/20 text-green-400',
            iconBg: 'bg-green-500',
          },
          {
            icon: Percent,
            label: 'Sua margem está em',
            value: formatPercent(margin),
            sublabel: margin > 50 ? 'Excelente! Acima da média' : 'Pode melhorar',
            color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
            iconBg: 'bg-indigo-500',
          },
          {
            icon: AlertCircle,
            label: 'Maior gasto do mês',
            value: expensesByCategory[0]?.category ?? 'N/A',
            sublabel: formatCurrency(expensesByCategory[0]?.value ?? 0),
            color: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
            iconBg: 'bg-orange-500',
          },
          {
            icon: Star,
            label: 'Produto mais lucrativo',
            value: topProducts[0]?.name.split(' ').slice(0, 2).join(' ') ?? 'N/A',
            sublabel: formatCurrency(topProducts[0]?.profit ?? 0) + ' lucro',
            color: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
            iconBg: 'bg-purple-500',
          },
        ].map((alert, idx) => {
          const Icon = alert.icon;
          return (
            <div
              key={idx}
              className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border ${alert.color} min-w-[220px]`}
            >
              <div className={`w-9 h-9 ${alert.iconBg} rounded-lg flex items-center justify-center`}>
                <Icon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{alert.label}</p>
                <p className="text-sm font-bold text-slate-100">{alert.value}</p>
                <p className="text-xs text-slate-500">{alert.sublabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Faturamento Bruto"
          value={formatCurrency(revenue)}
          subtitle={`${totalSalesCount} vendas`}
          icon={DollarSign}
          trend={{ value: revenueTrend, label: 'vs mês ant.' }}
          color="blue"
        />
        <MetricCard
          title="Total de Gastos"
          value={formatCurrency(expenseTotal)}
          subtitle="Despesas do mês"
          icon={Receipt}
          trend={{ value: -expenseTrend, label: 'vs mês ant.' }}
          color="red"
        />
        <MetricCard
          title="Custo dos Produtos"
          value={formatCurrency(productionCosts)}
          subtitle="Custo de produção"
          icon={Package}
          color="orange"
        />
        <MetricCard
          title="Taxas Marketplace"
          value={formatCurrency(marketplaceFees)}
          subtitle="Comissões pagas"
          icon={Zap}
          color="purple"
        />
        <MetricCard
          title="Lucro Líquido"
          value={formatCurrency(profit)}
          subtitle="Após todos os custos"
          icon={TrendingUp}
          trend={{ value: profitTrend, label: 'vs mês ant.' }}
          color="green"
          large
        />
        <MetricCard
          title="Margem de Lucro"
          value={formatPercent(margin)}
          subtitle="Sobre faturamento"
          icon={Percent}
          color="indigo"
        />
        <MetricCard
          title="Ticket Médio"
          value={formatCurrency(avgTicket)}
          subtitle="Por venda"
          icon={ShoppingCart}
          color="blue"
        />
        <MetricCard
          title="Dinheiro Disponível"
          value={formatCurrency(profit - expenseTotal + productionCosts)}
          subtitle="Caixa estimado"
          icon={Wallet}
          color="green"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Line Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100">Evolução Financeira</h3>
              <p className="text-xs text-slate-500">Últimas 8 semanas</p>
            </div>
            <BarChart3 size={18} className="text-slate-500" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#e2e8f0' }}
                formatter={(v: number) => formatCurrency(v)}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
              <Area type="monotone" dataKey="revenue" name="Faturamento" stroke="#6366f1" fill="url(#colorRevenue)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="profit" name="Lucro" stroke="#10b981" fill="url(#colorProfit)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expenses" name="Gastos" stroke="#ef4444" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-100">Gastos por Categoria</h3>
            <p className="text-xs text-slate-500">Distribuição do mês</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                nameKey="category"
              >
                {expensesByCategory.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#e2e8f0' }}
                formatter={(v: number) => formatCurrency(v)}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {expensesByCategory.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  <span className="text-slate-400">{item.category}</span>
                </div>
                <span className="text-slate-300 font-medium">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-base font-semibold text-slate-100 mb-4">Produtos Mais Lucrativos</h3>
          <div className="space-y-1">
            <div className="grid grid-cols-4 gap-2 text-xs text-slate-500 px-2 pb-2 border-b border-slate-800">
              <span className="col-span-2">Produto</span>
              <span className="text-right">Faturamento</span>
              <span className="text-right">Lucro</span>
            </div>
            {topProducts.slice(0, 5).map((product, idx) => {
              const productMargin = product.revenue > 0 ? (product.profit / product.revenue) * 100 : 0;
              return (
                <div key={idx} className="grid grid-cols-4 gap-2 px-2 py-2 rounded-xl hover:bg-slate-800/50 transition-colors">
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-slate-200 truncate">{product.name.split(' ').slice(0, 3).join(' ')}</p>
                    <p className="text-xs text-slate-500">{product.units} un.</p>
                  </div>
                  <span className="text-sm text-slate-300 text-right self-center">{formatCurrency(product.revenue)}</span>
                  <div className="text-right self-center">
                    <p className="text-sm font-semibold text-green-400">{formatCurrency(product.profit)}</p>
                    <p className="text-xs text-slate-500">{formatPercent(productMargin)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Biggest Expenses */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-base font-semibold text-slate-100 mb-4">Maiores Gastos do Mês</h3>
          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 px-2 pb-2 border-b border-slate-800">
              <span className="col-span-2">Categoria</span>
              <span className="text-right">Valor</span>
            </div>
            {expensesByCategory.map((item, idx) => {
              const pct = expenseTotal > 0 ? (item.value / expenseTotal) * 100 : 0;
              return (
                <div key={idx} className="px-2 py-2 rounded-xl hover:bg-slate-800/50 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-200">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{formatPercent(pct)}</span>
                      <span className="text-sm font-semibold text-slate-100">{formatCurrency(item.value)}</span>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full">
                    <div
                      className="h-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-base font-semibold text-slate-100 mb-4">Atividade Recente</h3>
        <div className="space-y-2">
          {recentMovements.map((mov) => (
            <div key={mov.id} className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  mov.type === 'sale' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {mov.type === 'sale' ? (
                    <ArrowUpRight size={16} className="text-green-400" />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{mov.description}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-500">{formatDate(mov.date)}</p>
                    {mov.marketplace && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${marketplaceBadgeColors[mov.marketplace] ?? 'bg-slate-700 text-slate-400'}`}>
                        {mov.marketplace}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${mov.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {mov.value >= 0 ? '+' : ''}{formatCurrency(Math.abs(mov.value))}
                </p>
                {mov.type === 'sale' && (
                  <p className="text-xs text-slate-500">Lucro: {formatCurrency(mov.profit)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
