import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

interface SidebarItem {
  name: string;
  path: string;
  icon: (props: { className?: string; strokeWidth?: number }) => React.JSX.Element;
}

// Custom SVGs matched to the uploaded sidebar design
const CustomersIcon = ({ className = "w-4 h-4", strokeWidth = 1.75 }: { className?: string; strokeWidth?: number }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="10" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const BillersIcon = ({ className = "w-4 h-4", strokeWidth = 1.75 }: { className?: string; strokeWidth?: number }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M19 15v6" />
    <path d="m16 18 3-3 3 3" />
  </svg>
);

const SuppliersIcon = ({ className = "w-4 h-4", strokeWidth = 1.75 }: { className?: string; strokeWidth?: number }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M19 13.5v7" />
    <path d="M21 15a2 2 0 0 0-2-1.5h-.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3H19a2 2 0 0 1-2-1.5" />
  </svg>
);

const StoresIcon = ({ className = "w-4 h-4", strokeWidth = 1.75 }: { className?: string; strokeWidth?: number }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
    <path d="M13 14l-2 3h3l-2 3" />
  </svg>
);

const WarehousesIcon = ({ className = "w-4 h-4", strokeWidth = 1.75 }: { className?: string; strokeWidth?: number }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    <path d="M6 10v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </svg>
);

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: 'Customers', path: '/customers', icon: CustomersIcon },
  { name: 'Billers', path: '/billers', icon: BillersIcon },
  { name: 'Suppliers', path: '/suppliers', icon: SuppliersIcon },
  { name: 'Stores', path: '/stores', icon: StoresIcon },
  { name: 'Warehouses', path: '/warehouses', icon: WarehousesIcon },
];

export interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Independent Fixed Sidebar */}
      <aside
        className={`w-64 bg-[#FFFFFF] h-screen sticky top-0 border-r border-[#E8EAF0] flex flex-col py-5 px-3 select-none flex-shrink-0 overflow-hidden z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 fixed lg:static inset-y-0 left-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <Link
          to="/customers"
          onClick={onCloseMobile}
          className="flex items-center gap-3 px-3 pb-5 mb-4 border-b border-[#E8EAF0] hover:opacity-90 transition-opacity group flex-shrink-0"
        >
          {!logoError ? (
            <img
              src="/logo.jpeg"
              alt="LancersLoom Logo"
              onError={() => setLogoError(true)}
              className="w-10 h-10 object-contain rounded-xl p-1 bg-white border border-[#E8EAF0]"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#315EFB] flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
              L
            </div>
          )}
          <div className="min-w-0">
            <h2 className="font-semibold text-[17px] text-[#000000] leading-tight tracking-[-0.03em] truncate group-hover:text-[#315EFB] transition-colors">
              LancersLoom
            </h2>
            <p className="text-[10px] text-[#526078] tracking-[0.1em] font-semibold mt-0.5 truncate">
              Management Suite
            </p>
          </div>
        </Link>

        {/* Internal Scrollable Menu: Never scrolls the main page! */}
        <nav className="flex-1 space-y-1 overflow-y-auto min-h-0 pr-1.5 custom-scrollbar">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-[14px] font-medium tracking-[-0.01em] transition-all duration-200 ${
                    isActive
                      ? 'bg-[#315EFB] text-[#FFFFFF] shadow-[0_2px_8px_rgba(49,94,251,0.25)]'
                      : 'text-[#526078] hover:text-[#000000] hover:bg-[#F5F7FF]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-[#FFFFFF]' : 'text-[#526078]'
                      }`}
                      strokeWidth={1.75}
                    />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-[#E8EAF0] px-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F5F7FF] border border-[#E8EAF0] flex items-center justify-center text-xs font-semibold text-[#315EFB]">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#000000] truncate">Admin User</p>
              <p className="text-[11px] text-[#526078] truncate">admin@lancersloom.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
