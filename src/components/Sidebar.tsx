import React from 'react';
import {
  LayoutDashboard,
  PlusSquare,
  BookmarkCheck,
  Building2,
  History,
  Settings2,
  Printer,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  savedAddressCount: number;
  companyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  savedAddressCount,
  companyCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'create-address',
      label: 'Create Address',
      icon: PlusSquare,
      badge: 'New',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'saved-addresses',
      label: 'Saved Addresses',
      icon: BookmarkCheck,
      badge: savedAddressCount > 0 ? savedAddressCount.toString() : null,
      badgeColor: 'bg-emerald-100 text-emerald-700 font-semibold',
    },
    {
      id: 'companies',
      label: 'Companies',
      icon: Building2,
      badge: companyCount > 0 ? companyCount.toString() : null,
      badgeColor: 'bg-slate-200 text-slate-700',
    },
    {
      id: 'print-history',
      label: 'Print History',
      icon: History,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings2,
      badge: null,
    },
  ];

  return (
    <aside
      id="app-sidebar"
      className="no-print w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0"
    >
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dispatch Standard Helper Card */}
      <div className="p-4 m-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-white font-semibold">
          <FileCheck2 className="w-4 h-4 text-blue-400" />
          <span>A4 Half-Page Spec</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Labels occupy 210mm × 148.5mm (top half). Print with standard 100% scale on regular A4 sheets.
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-700/60">
          <span>Courier Spec v2.4</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Ready
          </span>
        </div>
      </div>
    </aside>
  );
};
