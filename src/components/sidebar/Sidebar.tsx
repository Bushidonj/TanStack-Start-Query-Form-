import { Link, useRouter } from '@tanstack/react-router';
import { ChevronDown, FileText, Layout, Search, Settings, Clock, Plus, LogOut } from 'lucide-react';
import { useState } from 'react';
import { authService } from '../../services/auth.service';

export default function Sidebar() {
    const [isGeralExpanded, setIsGeralExpanded] = useState(true);
    const router = useRouter();

    const handleLogout = async () => {
        console.log('[Auth] Attempting logout...');
        await authService.logout();
        console.log('[Auth] ✅ Logout successful');
        router.navigate({ to: '/login' });
    };

    return (
        <aside className="w-64 bg-notion-sidebar border-r border-notion-border flex flex-col h-full select-none">
            {/* Top Header */}
            <div className="p-4 flex items-center justify-between group hover:bg-notion-hover cursor-pointer transition-colors">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-5 h-5 bg-blue-500 rounded flex-shrink-0 flex items-center justify-center font-bold text-xs">K</div>
                    <span className="font-semibold truncate">Kanban SaaS</span>
                </div>
                <ChevronDown size={14} className="text-notion-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Quick Search & Tools */}
            <div className="px-2 py-2 flex flex-col gap-0.5">
                <SidebarItem icon={<Search size={16} />} label="Pesquisar" />
                <SidebarItem icon={<Clock size={16} />} label="Atividades" />
                <SidebarItem icon={<Settings size={16} />} label="Configurações" />
            </div>

            {/* Menu Geral */}
            <div className="mt-4 flex flex-col px-2">
                <div
                    className="flex items-center gap-1 p-2 text-notion-text-muted hover:bg-notion-hover rounded cursor-pointer transition-colors"
                    onClick={() => setIsGeralExpanded(!isGeralExpanded)}
                >
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isGeralExpanded ? '' : '-rotate-90'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">Geral</span>
                </div>

                {isGeralExpanded && (
                    <div className="flex flex-col gap-0.5 mt-1 ml-1">
                        <Link to="/docs" className="block outline-none">
                            {({ isActive }: { isActive: boolean }) => (
                                <SidebarItem
                                    icon={<FileText size={16} />}
                                    label="Docs"
                                    isActive={isActive}
                                />
                            )}
                        </Link>
                        <Link to="/" className="block outline-none">
                            {({ isActive }: { isActive: boolean }) => (
                                <SidebarItem
                                    icon={<Layout size={16} />}
                                    label="Kanban"
                                    isActive={isActive}
                                />
                            )}
                        </Link>
                    </div>
                )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Footer Tools */}
            <div className="p-2 border-t border-notion-border">
                <SidebarItem icon={<Plus size={16} />} label="Novo Quadro" />
                <div
                    onClick={handleLogout}
                    className="flex items-center gap-2 p-2 rounded cursor-pointer transition-colors group text-notion-text-muted hover:bg-notion-hover hover:text-notion-text mt-1"
                >
                    <LogOut size={16} />
                    <span className="text-sm font-medium">Sair</span>
                </div>
            </div>
        </aside>
    );
}

function SidebarItem({ icon, label, isActive }: { icon: React.ReactNode, label: string, isActive?: boolean }) {
    return (
        <div className={`
      flex items-center gap-2 p-2 rounded cursor-pointer transition-colors group
      ${isActive ? 'bg-notion-hover text-notion-text' : 'text-notion-text-muted hover:bg-notion-hover hover:text-notion-text'}
    `}>
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
}
