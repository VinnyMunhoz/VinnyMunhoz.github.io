import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  ArrowLeftRight,
  ShoppingCart,
  CreditCard,
  Package,
  Warehouse,
  BarChart3,
  Bot,
  Settings,
  Box,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home, exact: true },
  { to: '/movimentacoes', label: 'Movimentações', icon: ArrowLeftRight },
  { to: '/vendas', label: 'Vendas', icon: ShoppingCart },
  { to: '/gastos', label: 'Gastos', icon: CreditCard },
  { to: '/produtos', label: 'Produtos', icon: Package },
  { to: '/estoque', label: 'Estoque', icon: Warehouse },
  { to: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { to: '/assistente', label: 'Assistente IA', icon: Bot },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
];

export default function Sidebar() {
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const settings = useStore((s) => s.settings);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'relative flex flex-col h-full transition-all duration-300 ease-in-out',
        'bg-slate-900 dark:bg-slate-950 border-r border-slate-800',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-slate-800',
        !sidebarOpen && 'justify-center px-2'
      )}>
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Box size={18} className="text-white" />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <p className="font-bold text-white text-sm leading-tight whitespace-nowrap">Meu Lucro 3D</p>
            <p className="text-xs text-slate-400 whitespace-nowrap">Controle Financeiro</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === '/' || location.pathname === ''
              : location.pathname.startsWith(item.to);

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.exact}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    'group relative',
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800',
                    !sidebarOpen && 'justify-center px-2'
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon
                    size={18}
                    className={cn(
                      'flex-shrink-0 transition-colors',
                      isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                    )}
                  />
                  {sidebarOpen && (
                    <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
                  )}
                  {isActive && (
                    <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  )}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-slate-700">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className={cn(
        'border-t border-slate-800 p-3',
        !sidebarOpen && 'flex justify-center'
      )}>
        <div className={cn(
          'flex items-center gap-3 rounded-xl p-2 hover:bg-slate-800 transition-colors cursor-pointer',
          !sidebarOpen && 'justify-center'
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{settings.userName}</p>
              <p className="text-xs text-slate-500 truncate">{settings.businessName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center hover:bg-slate-600 transition-colors z-10 shadow-md"
      >
        {sidebarOpen ? (
          <ChevronLeft size={12} className="text-slate-300" />
        ) : (
          <ChevronRight size={12} className="text-slate-300" />
        )}
      </button>
    </aside>
  );
}
