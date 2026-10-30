import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/sidebar/sidebar';
import Customer from './pages/customer/customer';
import Biller from './pages/biller/biller';
import Supplier from './pages/supplier/supplier';
import Store from './pages/store/store';
import Warehouse from './pages/warehouse/warehouse';
import Dashboard from './pages/dashboard/dashboard';
import { Settings, Menu } from 'lucide-react';

export default function App() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);

  return (
    <BrowserRouter>
      {/* 1. Root Shell: Locked height, no outer page scroll */}
      <div className="flex h-screen overflow-hidden bg-[#FFFFFF] font-sans text-[#000000] relative">
        
        {/* 2. Independent Sidebar: Stays fixed, scrolls internally if needed */}
        <Sidebar
          isMobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* 3. Main Content: Independent vertical scroll */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto bg-[#F8F9FA] custom-scrollbar relative">
          {/* Mobile hamburger header for small screens */}
          <div className="lg:hidden h-14 bg-white border-b border-[#E8EAF0] px-4 flex items-center justify-between sticky top-0 z-40">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-md text-[#526078] hover:text-[#000000] hover:bg-[#F5F7FF] transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#315EFB] flex items-center justify-center text-white font-bold text-xs">
                L
              </div>
              <span className="font-semibold text-sm text-[#000000]">LancersLoom</span>
            </div>
            <div className="w-8" />
          </div>

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/customer" element={<Navigate to="/customers" replace />} />
            <Route path="/billers" element={<Biller />} />
            <Route path="/biller" element={<Navigate to="/billers" replace />} />
            <Route path="/suppliers" element={<Supplier />} />
            <Route path="/supplier" element={<Navigate to="/suppliers" replace />} />
            <Route path="/stores" element={<Store />} />
            <Route path="/store" element={<Navigate to="/stores" replace />} />
            <Route path="/warehouses" element={<Warehouse />} />
            <Route path="/warehouse" element={<Navigate to="/warehouses" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {/* 4. Floating Quick Settings Cog */}
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
          <button
            type="button"
            title="Quick Settings"
            onClick={() => setShowQuickSettings(!showQuickSettings)}
            className="w-9 h-9 bg-[#315EFB] hover:bg-[#2448D8] text-white rounded-l-md flex items-center justify-center shadow-lg transition-transform hover:-translate-x-0.5 cursor-pointer"
          >
            <Settings className="w-4 h-4 animate-spin-slow" />
          </button>
        </div>

        {/* Quick Settings Drawer */}
        {showQuickSettings && (
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-[#E8EAF0] shadow-2xl z-50 p-5 flex flex-col justify-between animate-fade-in">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8EAF0]">
                <h3 className="font-semibold text-sm text-[#000000]">Quick Settings</h3>
                <button
                  onClick={() => setShowQuickSettings(false)}
                  className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="py-4 space-y-4 text-xs text-[#526078]">
                <div>
                  <label className="font-medium text-[#000000] block mb-1">Theme Accent</label>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#315EFB] inline-block ring-2 ring-offset-1 ring-[#315EFB]" />
                    <span className="font-medium text-[#000000]">Electric Cobalt Blue (#315EFB)</span>
                  </div>
                </div>
                <div>
                  <label className="font-medium text-[#000000] block mb-1">Brand Guideline</label>
                  <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                    Active Brand Accent: Electric Cobalt Blue. Strict brand compliance.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowQuickSettings(false)}
              className="w-full py-2 bg-[#1D273B] hover:bg-[#111827] text-white rounded-md text-xs font-semibold"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}
