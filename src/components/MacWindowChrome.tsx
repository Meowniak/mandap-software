import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  PackageCheck,
  Users2,
  Building2,
  Receipt,
  FileSpreadsheet,
  HardDriveDownload,
  Search,
  Sparkles,
  Laptop,
  CheckCircle2,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { StudioConfig } from '../types';

interface MacWindowChromeProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  config: StudioConfig;
  onOpenDatabaseModal: () => void;
  onOpenSearchModal: () => void;
  onOpenDocumentation: () => void;
  children: React.ReactNode;
}

export const MacWindowChrome: React.FC<MacWindowChromeProps> = ({
  activeTab,
  setActiveTab,
  config,
  onOpenDatabaseModal,
  onOpenSearchModal,
  onOpenDocumentation,
  children,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [trafficNotification, setTrafficNotification] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Timeline', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects & Assignees', icon: FolderKanban },
    { id: 'deliverables', label: 'Deliverables Studio', icon: PackageCheck },
    { id: 'employees', label: 'Employees & Crew', icon: Users2 },
    { id: 'clients', label: 'Clients & Accounts', icon: Building2 },
    { id: 'expenses', label: 'Budget & Expenses', icon: Receipt },
    { id: 'billing', label: 'Milestone Billing', icon: FileSpreadsheet },
  ];

  const handleTrafficClick = (action: 'close' | 'minimize' | 'zoom') => {
    if (action === 'close') {
      setTrafficNotification('Local database is actively synchronized in browser storage.');
    } else if (action === 'minimize') {
      setSidebarCollapsed(!sidebarCollapsed);
      setTrafficNotification(sidebarCollapsed ? 'Sidebar expanded' : 'Sidebar minimized for focus');
    } else {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        setTrafficNotification('Entered full canvas');
      } else {
        document.exitFullscreen().catch(() => {});
        setTrafficNotification('Exited full canvas');
      }
    }
    setTimeout(() => setTrafficNotification(null), 2500);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-950 text-slate-100 antialiased overflow-hidden font-sans">
      {/* Top macOS Tahoe Menu & Window Title Bar */}
      <header className="no-print flex h-11 shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 backdrop-blur-md select-none">
        {/* Left: Authentic macOS Traffic Lights & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-2">
            <button
              onClick={() => handleTrafficClick('close')}
              className="group relative flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 hover:bg-rose-600 transition-colors shadow-xs"
              title="Close window / Storage Status"
              aria-label="Close"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] leading-none text-rose-950 font-bold">×</span>
            </button>
            <button
              onClick={() => handleTrafficClick('minimize')}
              className="group relative flex h-3 w-3 items-center justify-center rounded-full bg-amber-500 hover:bg-amber-600 transition-colors shadow-xs"
              title="Toggle sidebar minimize"
              aria-label="Minimize"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] leading-none text-amber-950 font-bold">−</span>
            </button>
            <button
              onClick={() => handleTrafficClick('zoom')}
              className="group relative flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-xs"
              title="Toggle Fullscreen"
              aria-label="Fullscreen"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[7px] leading-none text-emerald-950 font-bold">+</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Window Title with Mac Tahoe typography */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <span className="font-semibold text-slate-100 tracking-tight">{config.studioName}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">macOS Tahoe 26</span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-[11px] text-indigo-400">Apple M1 Pro</span>
          </div>
        </div>

        {/* Center: Search & Quick Navigation Bar */}
        <button
          onClick={onOpenSearchModal}
          className="hidden md:flex items-center gap-2 rounded-md border border-slate-800 bg-slate-950/60 px-3 py-1 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors w-64 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span>Search projects, crew, deliverables...</span>
          </div>
          <kbd className="rounded border border-slate-700/60 bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">
            ⌘K
          </kbd>
        </button>

        {/* Right: Local Database status, time & system badge */}
        <div className="flex items-center gap-3 text-xs">
          {trafficNotification && (
            <div className="flex items-center gap-1.5 rounded bg-indigo-500/20 px-2 py-0.5 text-[11px] text-indigo-300 border border-indigo-500/30 animate-fade-in">
              <CheckCircle2 className="h-3 w-3 text-indigo-400" />
              <span>{trafficNotification}</span>
            </div>
          )}

          <button
            onClick={onOpenDocumentation}
            className="flex items-center gap-1.5 rounded border border-slate-800 bg-slate-900 px-2.5 py-1 text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors text-xs"
            title="Operating Manual & Developer Guide"
          >
            <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-medium">User Manual</span>
          </button>

          <button
            onClick={onOpenDatabaseModal}
            className="flex items-center gap-1.5 rounded border border-slate-800 bg-slate-900 px-2.5 py-1 text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors text-xs"
            title="Local JSON Database Backup & Restore"
          >
            <HardDriveDownload className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-medium">Local DB</span>
          </button>

          <div className="flex items-center gap-2 border-l border-slate-800 pl-3 font-mono text-[11px] tabular-nums text-slate-400">
            <Calendar className="h-3 w-3 text-slate-500" />
            <span>{currentTime || '09:41 AM'}</span>
          </div>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left macOS Tahoe Sidebar */}
        <aside
          className={`no-print flex shrink-0 flex-col border-r border-slate-800/80 bg-slate-900/60 backdrop-blur-xl transition-all duration-200 select-none ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Studio Brand Card */}
          <div className="p-4 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-sky-600 text-white shadow-md">
                <Laptop className="h-5 w-5" />
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <h1 className="text-sm font-semibold text-slate-100 truncate tracking-tight">
                    {config.studioName}
                  </h1>
                  <p className="text-[11px] text-slate-400 truncate">Tahoe Studio OS</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
            {!sidebarCollapsed && (
              <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Operations
              </div>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`group flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-slate-100'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* System Spec & Architecture Footnote */}
          <div className="border-t border-slate-800/80 p-3 bg-slate-950/40">
            {!sidebarCollapsed ? (
              <div className="space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Architecture</span>
                  <span className="font-mono text-slate-300">Apple Silicon M1 Pro</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Storage</span>
                  <span className="font-mono text-emerald-400">Local Browser DB</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Sparkles className="h-4 w-4 text-indigo-400" />
              </div>
            )}
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
