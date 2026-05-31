import { useState } from 'react';
import { User, ShoppingBag, Package, Palette, Zap, Save, Check, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

type Tab = 'perfil' | 'marketplaces' | 'produtos' | 'aparencia' | 'integracoes';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'marketplaces', label: 'Marketplaces', icon: ShoppingBag },
  { id: 'produtos', label: 'Produtos', icon: Package },
  { id: 'aparencia', label: 'Aparência', icon: Palette },
  { id: 'integracoes', label: 'Integrações', icon: Zap },
];

const marketplaceDefaults = [
  { name: 'Mercado Livre', fee: 12 },
  { name: 'Shopee', fee: 14 },
  { name: 'TikTok Shop', fee: 10 },
  { name: 'Amazon', fee: 15 },
  { name: 'Venda Direta', fee: 0 },
  { name: 'Atacado', fee: 0 },
  { name: 'Loja Física', fee: 0 },
];

export default function Settings() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);

  const [activeTab, setActiveTab] = useState<Tab>('perfil');
  const [saved, setSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Local form state
  const [userName, setUserName] = useState(settings.userName);
  const [email, setEmail] = useState(settings.email);
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [phone, setPhone] = useState(settings.phone);
  const [openaiApiKey, setOpenaiApiKey] = useState(settings.openaiApiKey);
  const [defaultMaterial, setDefaultMaterial] = useState(settings.defaultMaterial);
  const [marketplaceFees, setMarketplaceFees] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const m of settings.marketplaces) {
      map[m.name] = m.defaultFee;
    }
    return map;
  });
  const [activeMarketplaces, setActiveMarketplaces] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const m of settings.marketplaces) {
      map[m.name] = m.active;
    }
    return map;
  });

  function handleSave() {
    updateSettings({
      userName, email, businessName, phone, openaiApiKey, defaultMaterial,
      marketplaces: settings.marketplaces.map((m) => ({
        ...m,
        defaultFee: marketplaceFees[m.name] ?? m.defaultFee,
        active: activeMarketplaces[m.name] ?? m.active,
      })),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors placeholder-slate-600";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Configurações</h2>
        <p className="text-sm text-slate-500 mt-1">Personalize sua experiência no Meu Lucro 3D</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        {activeTab === 'perfil' && (
          <div className="space-y-4 max-w-lg">
            <h3 className="text-base font-semibold text-slate-100 mb-5">Informações do Perfil</h3>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                <User size={28} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{userName || 'Sem nome'}</p>
                <p className="text-xs text-slate-500">{email || 'Sem email'}</p>
                <button className="mt-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Alterar foto</button>
              </div>
            </div>

            <div>
              <label className={labelClass}>Nome</label>
              <input value={userName} onChange={(e) => setUserName(e.target.value)} className={inputClass} placeholder="Seu nome" />
            </div>
            <div>
              <label className={labelClass}>E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="seu@email.com" />
            </div>
            <div>
              <label className={labelClass}>Nome do Negócio</label>
              <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={inputClass} placeholder="Nome da sua empresa/loja" />
            </div>
            <div>
              <label className={labelClass}>Telefone / WhatsApp</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="(31) 99999-0000" />
            </div>
          </div>
        )}

        {activeTab === 'marketplaces' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-base font-semibold text-slate-100 mb-1">Configuração de Marketplaces</h3>
            <p className="text-sm text-slate-500 mb-5">Ative os marketplaces que você usa e configure as taxas padrão</p>

            <div className="space-y-3">
              {marketplaceDefaults.map(({ name }) => (
                <div key={name} className={cn(
                  'flex items-center justify-between px-4 py-4 rounded-xl border transition-colors',
                  activeMarketplaces[name]
                    ? 'bg-indigo-500/5 border-indigo-500/20'
                    : 'bg-slate-800/50 border-slate-800'
                )}>
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => setActiveMarketplaces((prev) => ({ ...prev, [name]: !prev[name] }))}
                      className={cn(
                        'w-10 h-6 rounded-full transition-all cursor-pointer relative',
                        activeMarketplaces[name] ? 'bg-indigo-500' : 'bg-slate-700'
                      )}
                    >
                      <div className={cn(
                        'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all',
                        activeMarketplaces[name] ? 'left-5' : 'left-1'
                      )} />
                    </div>
                    <span className={cn('text-sm font-medium', activeMarketplaces[name] ? 'text-slate-200' : 'text-slate-500')}>
                      {name}
                    </span>
                  </div>
                  {activeMarketplaces[name] && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Taxa padrão:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          step="0.5"
                          value={marketplaceFees[name] ?? 0}
                          onChange={(e) => setMarketplaceFees((prev) => ({ ...prev, [name]: Number(e.target.value) }))}
                          className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm text-center text-slate-200 outline-none focus:border-indigo-500"
                        />
                        <span className="text-xs text-slate-500">%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'produtos' && (
          <div className="space-y-4 max-w-lg">
            <h3 className="text-base font-semibold text-slate-100 mb-5">Configurações de Produtos</h3>

            <div>
              <label className={labelClass}>Material Padrão</label>
              <select value={defaultMaterial} onChange={(e) => setDefaultMaterial(e.target.value)} className={inputClass}>
                {['PLA', 'PLA+', 'PETG', 'PLA+ Silk', 'Resina', 'TPU', 'ASA', 'ABS'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">Será pré-selecionado ao cadastrar novos produtos</p>
            </div>

            <div>
              <label className={labelClass}>Custo Médio de Energia (R$/kWh)</label>
              <input type="number" step="0.01" defaultValue={0.72} className={inputClass} />
              <p className="text-xs text-slate-500 mt-1">Usado para calcular custo de energia das impressões</p>
            </div>

            <div>
              <label className={labelClass}>Margem Mínima Desejada (%)</label>
              <input type="number" min="0" max="100" defaultValue={50} className={inputClass} />
              <p className="text-xs text-slate-500 mt-1">Alerta quando produto estiver abaixo dessa margem</p>
            </div>

            <div>
              <label className={labelClass}>Tempo de Setup Médio (min)</label>
              <input type="number" min="0" defaultValue={15} className={inputClass} />
            </div>
          </div>
        )}

        {activeTab === 'aparencia' && (
          <div className="space-y-6 max-w-lg">
            <h3 className="text-base font-semibold text-slate-100 mb-5">Aparência do Sistema</h3>

            {/* Dark/Light mode */}
            <div className="flex items-center justify-between px-4 py-4 bg-slate-800/50 rounded-xl border border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-200">Modo Escuro</p>
                <p className="text-xs text-slate-500">Interface em tons escuros</p>
              </div>
              <div
                onClick={toggleDarkMode}
                className={cn(
                  'w-12 h-7 rounded-full transition-all cursor-pointer relative',
                  darkMode ? 'bg-indigo-500' : 'bg-slate-700'
                )}
              >
                <div className={cn(
                  'absolute top-1.5 w-4 h-4 bg-white rounded-full shadow transition-all',
                  darkMode ? 'left-7' : 'left-1.5'
                )} />
              </div>
            </div>

            {/* Accent color */}
            <div>
              <p className="text-sm font-medium text-slate-300 mb-3">Cor de Destaque</p>
              <div className="flex gap-3">
                {[
                  { name: 'indigo', bg: 'bg-indigo-500', label: 'Índigo' },
                  { name: 'violet', bg: 'bg-violet-500', label: 'Violeta' },
                  { name: 'blue', bg: 'bg-blue-500', label: 'Azul' },
                  { name: 'emerald', bg: 'bg-emerald-500', label: 'Verde' },
                  { name: 'rose', bg: 'bg-rose-500', label: 'Rosa' },
                  { name: 'orange', bg: 'bg-orange-500', label: 'Laranja' },
                ].map((color) => (
                  <button
                    key={color.name}
                    onClick={() => updateSettings({ accentColor: color.name })}
                    className={cn(
                      'flex flex-col items-center gap-1.5',
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-xl transition-all',
                      color.bg,
                      settings.accentColor === color.name ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-105'
                    )} />
                    <span className="text-xs text-slate-500">{color.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Compact mode */}
            <div className="flex items-center justify-between px-4 py-4 bg-slate-800/50 rounded-xl border border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-200">Modo Compacto</p>
                <p className="text-xs text-slate-500">Tabelas com menos espaçamento</p>
              </div>
              <div className="w-12 h-7 rounded-full bg-slate-700 relative cursor-pointer">
                <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integracoes' && (
          <div className="space-y-6 max-w-lg">
            <h3 className="text-base font-semibold text-slate-100 mb-5">Integrações e APIs</h3>

            {/* OpenAI */}
            <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">OpenAI (ChatGPT)</p>
                  <p className="text-xs text-slate-500">Para respostas reais do Assistente IA</p>
                </div>
                <span className={cn('ml-auto text-xs px-2 py-0.5 rounded-full', openaiApiKey ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-500')}>
                  {openaiApiKey ? 'Configurado' : 'Não configurado'}
                </span>
              </div>
              <div>
                <label className={labelClass}>Chave de API (sk-...)</label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                    placeholder="sk-..."
                    className={cn(inputClass, 'pr-10')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Obtenha sua chave em <span className="text-indigo-400">platform.openai.com</span>. Ela é armazenada localmente no seu navegador.
                </p>
              </div>
            </div>

            {/* Supabase note */}
            <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                  <span className="text-lg">🗄️</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Supabase (Banco de Dados)</p>
                  <p className="text-xs text-slate-500">Para sincronizar dados entre dispositivos</p>
                </div>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">Em breve</span>
              </div>
              <p className="text-xs text-slate-500">
                A integração com Supabase permitirá backup automático, sincronização entre dispositivos e compartilhamento de dados. Em desenvolvimento para a próxima versão.
              </p>
            </div>

            {/* Mercado Livre API */}
            <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-lg">🛒</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Mercado Livre API</p>
                  <p className="text-xs text-slate-500">Importar vendas automaticamente</p>
                </div>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">Em breve</span>
              </div>
              <p className="text-xs text-slate-500">
                Conecte sua conta do Mercado Livre para importar vendas automaticamente, sem precisar registrar manualmente.
              </p>
            </div>
          </div>
        )}

        {/* Save button */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={handleSave}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all',
              saved
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/30'
            )}
          >
            {saved ? (
              <>
                <Check size={16} />
                Salvo com sucesso!
              </>
            ) : (
              <>
                <Save size={16} />
                Salvar Configurações
              </>
            )}
          </button>
          {saved && (
            <p className="text-xs text-green-400 animate-fade-in">Suas configurações foram atualizadas.</p>
          )}
        </div>
      </div>
    </div>
  );
}
