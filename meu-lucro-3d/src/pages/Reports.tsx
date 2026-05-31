import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts';
import { Download, BarChart3, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  getCurrentMonthRevenue, getCurrentMonthProfit, getCurrentMonthExpenseTotal,
  getExpensesByCategory, getMarketplaceData, getMonthlyData, getTopProducts,
} from '../store/useStore';
import { formatCurrency, formatPercent, cn } from '../lib/utils';

type Period = '1m' | '3m' | '6m' | '1y';

const PIE_COLORS = ['#f59e0b', '#f97316', '#1d4ed8', '#10b981', '#6366f1', '#8b5cf6', '#ec4899'];
const CATEGORY_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export default function Reports() {
  const sales = useStore((s) => s.sales);
  const expenses = useStore((s) => s.expenses);

  const [period, setPeriod] = useState<Period>('1m');

  const revenue = getCurrentMonthRevenue(sales);
  const profit = getCurrentMonthProfit(sales);
  const expenseTotal = getCurrentMonthExpenseTotal(expenses);
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  const monthlyData = getMonthlyData(sales, expenses);
  const expensesByCategory = getExpensesByCategory(expenses);
  const marketplaceData = getMarketplaceData(sales);
  const topProducts = getTopProducts(sales);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Relatórios</h2>
          <p className="text-sm text-slate-500 mt-1">Análise completa do seu negócio</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1">
            {[
              { label: '1M', value: '1m' },
              { label: '3M', value: '3m' },
              { label: '6M', value: '6m' },
              { label: '1A', value: '1y' },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value as Period)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  period === p.value
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-slate-500 hover:text-slate-300'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors">
            <Download size={15} />
            Exportar
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Faturamento', value: formatCurrency(revenue), sub: 'Este mês', icon: DollarSign, color: 'from-blue-500 to-cyan-600', trend: '+12,3%' },
          { label: 'Lucro Líquido', value: formatCurrency(profit), sub: 'Este mês', icon: TrendingUp, color: 'from-green-500 to-emerald-600', trend: '+8,7%' },
          { label: 'Total Gastos', value: formatCurrency(expenseTotal), sub: 'Este mês', icon: BarChart3, color: 'from-red-500 to-rose-600', trend: '-3,2%' },
          { label: 'Margem', value: formatPercent(margin), sub: 'Sobre faturamento', icon: Percent, color: 'from-indigo-500 to-violet-600', trend: '+2,1%' },
        ].map((card, idx) => {
          const Icon = card.icon;
          const isPositive = card.trend.startsWith('+');
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500">{card.label}</span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <Icon size={15} className="text-white" />
                </div>
              </div>
              <p className="text-xl font-bold text-slate-100 mb-1">{card.value}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">{card.sub}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {card.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Revenue vs Expenses vs Profit */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-slate-100 mb-1">Lucro por Mês</h3>
        <p className="text-xs text-slate-500 mb-5">Comparativo de faturamento, gastos e lucro</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#e2e8f0' }}
              formatter={(v: number) => formatCurrency(v)}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            <Bar dataKey="revenue" name="Faturamento" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" name="Lucro" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Marketplace distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-slate-100 mb-1">Vendas por Marketplace</h3>
          <p className="text-xs text-slate-500 mb-4">Distribuição do faturamento</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie
                  data={marketplaceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {marketplaceData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#e2e8f0' }} formatter={(v: number) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {marketplaceData.map((item, idx) => {
                const total = marketplaceData.reduce((s, i) => s + i.value, 0);
                const pct = total > 0 ? (item.value / total) * 100 : 0;
                return (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                      <span className="text-slate-400 truncate max-w-[100px]">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-300 font-medium">{pct.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expenses by category - horizontal bars */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-slate-100 mb-1">Gastos por Categoria</h3>
          <p className="text-xs text-slate-500 mb-4">Ranking de despesas</p>
          <div className="space-y-3">
            {expensesByCategory.map((item, idx) => {
              const total = expensesByCategory.reduce((s, i) => s + i.value, 0);
              const pct = total > 0 ? (item.value / total) * 100 : 0;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{pct.toFixed(1)}%</span>
                      <span className="text-slate-100 font-semibold">{formatCurrency(item.value)}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Growth trend */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-slate-100 mb-1">Evolução do Negócio</h3>
        <p className="text-xs text-slate-500 mb-5">Tendência de crescimento nos últimos 6 meses</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#e2e8f0' }} formatter={(v: number) => formatCurrency(v)} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            <Area type="monotone" dataKey="revenue" name="Faturamento" stroke="#6366f1" fill="url(#gradRevenue)" strokeWidth={2} />
            <Area type="monotone" dataKey="profit" name="Lucro" stroke="#10b981" fill="url(#gradProfit)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-slate-100 mb-4">Produtos Mais Rentáveis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-medium text-slate-500 px-3 py-2">#</th>
                <th className="text-left text-xs font-medium text-slate-500 px-3 py-2">Produto</th>
                <th className="text-right text-xs font-medium text-slate-500 px-3 py-2">Unidades</th>
                <th className="text-right text-xs font-medium text-slate-500 px-3 py-2">Faturamento</th>
                <th className="text-right text-xs font-medium text-slate-500 px-3 py-2">Lucro Total</th>
                <th className="text-right text-xs font-medium text-slate-500 px-3 py-2">Margem</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, idx) => {
                const m = p.revenue > 0 ? (p.profit / p.revenue) * 100 : 0;
                return (
                  <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-3 py-3">
                      <span className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                        idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        idx === 1 ? 'bg-slate-500/20 text-slate-400' :
                        idx === 2 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-slate-800 text-slate-500'
                      )}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-200">{p.name}</td>
                    <td className="px-3 py-3 text-slate-300 text-right">{p.units}</td>
                    <td className="px-3 py-3 text-slate-300 text-right">{formatCurrency(p.revenue)}</td>
                    <td className="px-3 py-3 font-semibold text-green-400 text-right">{formatCurrency(p.profit)}</td>
                    <td className="px-3 py-3 text-right">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', m >= 60 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400')}>
                        {formatPercent(m)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
