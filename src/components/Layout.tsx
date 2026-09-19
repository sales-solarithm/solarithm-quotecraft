import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuthStore, useProfileStore } from '../store';
import { FileText, Users, Building, LogOut, LayoutDashboard, FileSpreadsheet, Menu, X, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export function Layout() {
  const { user, role } = useAuthStore();
  const { lockedEmail, lockedName, lockedRole } = useProfileStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleReturnToLauncher = () => {
    if (window.opener) {
      window.close();
    } else {
      window.location.href = 'https://solarithm.com';
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Quotations', path: '/quotations', icon: FileText },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Companies', path: '/companies', icon: Building },
  ];

  const currentEmail = user?.email || lockedEmail || 'sales@solarithm.com';
  const currentName = user?.displayName || lockedName || 'Solarithm Sales';
  const currentRole = lockedRole || role || 'Sales Executive';

  return (
    <div className="flex h-screen overflow-hidden bg-[#121212] text-white">
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar: Collapsible slide-out drawer on mobile (<=768px), docked on desktop */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-[#1E1E1E] border-r border-[#333333] flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out md:static md:translate-x-0",
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        <div>
          {/* Brand Header Badge */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#2A2A2A]">
            <div className="flex items-center gap-3 min-w-0">
              {/* Gold Icon Container */}
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#121212] flex items-center justify-center font-bold shrink-0 shadow-md shadow-[#D4AF37]/20">
                <FileSpreadsheet className="w-5 h-5 text-[#121212]" />
              </div>
              {/* Two-Tone Header Text */}
              <div className="flex flex-col min-w-0">
                <h1 className="text-sm font-bold text-white tracking-tight truncate">
                  Solarithm <span className="text-[#D4AF37]">QuoteCraft</span>
                </h1>
                <p className="text-[10px] text-gray-400 tracking-tight truncate mt-0.5">
                  Commercial Solar Proposal Generator
                </p>
              </div>
            </div>
            {/* Close Button on Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg md:hidden hover:bg-[#2A2A2A] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Navigation - Automatically closes mobile drawer when clicked */}
          <nav className="p-3 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3.5 py-2.5 rounded-md transition-all text-sm tracking-wide",
                      isActive 
                        ? "bg-[#2A2A2A] text-[#D4AF37] border-l-[3px] border-[#D4AF37] font-semibold shadow-sm" 
                        : "text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50 transition-colors"
                    )
                  }
                >
                  <item.icon className="w-4 h-4 mr-3 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-[#333333] bg-[#1E1E1E]">
          <div className="flex items-center justify-between bg-[#2A2A2A] border border-[#333333] rounded-lg p-2.5">
            <div className="flex flex-col overflow-hidden mr-2">
              <span className="text-xs font-semibold text-white truncate">{currentName}</span>
              <span className="text-[10px] text-[#D4AF37] font-medium uppercase tracking-wider">{currentRole}</span>
            </div>
            <button 
              onClick={handleReturnToLauncher}
              className="p-1.5 rounded text-gray-400 hover:text-rose-400 hover:bg-[#333333] transition-colors"
              title="Return to Launcher"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#121212] min-w-0">
        <header className="h-14 border-b border-[#333333] bg-[#1E1E1E]/60 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger button on mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#2A2A2A] md:hidden focus:outline-none transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand Label */}
            <div className="md:hidden flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-[#D4AF37] text-[#121212] flex items-center justify-center font-bold shrink-0">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#121212]" />
              </div>
              <span className="text-xs font-bold text-white tracking-tight truncate">
                Solarithm <span className="text-[#D4AF37]">QuoteCraft</span>
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-[#2A2A2A] border border-[#333333] px-3 py-1 rounded-full text-xs min-w-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="text-gray-400 shrink-0">Authenticated Session:</span>
              <span className="font-medium text-white truncate max-w-[180px] md:max-w-none">{currentEmail}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="sm:hidden flex items-center gap-1.5 text-xs text-gray-300 bg-[#2A2A2A] border border-[#333333] px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3 h-3 text-[#D4AF37] shrink-0" />
              <span className="max-w-[120px] truncate">{currentEmail}</span>
            </div>
            <span className="hidden xs:inline text-xs text-gray-500 font-mono">v2.4</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
