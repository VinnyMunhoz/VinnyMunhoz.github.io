import { useLocation } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Menu, User } from 'lucide-react';
import { useStore } from '../../store/useStore';

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/movimentacoes': 'Movimentações',
  '/vendas': 'Vendas',
  '/gastos': 'Gastos',
  '/produtos': 'Produtos',
  '/estoque': 'Estoque',
  '/relatorios': 'Relatórios',
  '/assistente': 'Assistente IA',
  '/configuracoes': 'Configurações',
};

export default function Header() {
  const location = useLocation();
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const settings = useStore((s) => s.settings);

  const title = routeTitles[location.pathname] ?? 'Dashboard';

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-slate-800 dark:border-slate-800 bg-slate-900/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-20">
      {/* Left: mobile menu + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-100 dark:text-slate-100">{title}</h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            {new Date('2026-05-31').toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 w-56">
          <Search size={14} className="text-slate-500" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full"
            readOnly
          />
          <kbd className="text-xs text-slate-600 bg-slate-700 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Modo claro' : 'Modo escuro'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>

        {/* Avatar */}
        <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <span className="hidden sm:block text-sm font-medium text-slate-300">{settings.userName}</span>
        </button>
      </div>
    </header>
  );
}
