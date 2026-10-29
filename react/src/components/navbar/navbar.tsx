import React, { useState } from 'react';
import { Search, Maximize2, Mail, Bell, Settings } from 'lucide-react';

export interface NavbarProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onAddNew?: () => void;
  searchPlaceholder?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search'
}) => {
  const [localSearch, setLocalSearch] = useState('');

  const isControlled = onSearchChange !== undefined;
  const currentSearchValue = isControlled ? (searchTerm ?? '') : localSearch;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isControlled) {
      onSearchChange(e.target.value);
    } else {
      setLocalSearch(e.target.value);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E8EAF0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 flex-shrink-0">
      {/* Global Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative w-64 sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={currentSearchValue}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-12 py-1.5 bg-gray-50 border border-[#E8EAF0] rounded-md text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#315EFB] focus:bg-white transition-all"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-medium bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded pointer-events-none">
            ⌘ K
          </span>
        </div>
      </div>

      {/* Right Action Icons & User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Fullscreen Toggle */}
        <button
          type="button"
          title="Toggle Fullscreen"
          onClick={toggleFullscreen}
          className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Mail with Notification Badge */}
        <div className="relative">
          <button
            type="button"
            title="Messages"
            className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4" />
          </button>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            1
          </span>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          title="Notifications"
          className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Settings Gear */}
        <button
          type="button"
          title="Settings"
          className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-[#E8EAF0]">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80"
            alt="User profile"
            className="w-8 h-8 rounded-full object-cover border border-[#E8EAF0]"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
