# LancersLoom Management Software Design System & Migration Guide

> **Single Source of Truth** for all LancersLoom Management Software applications (Inventory Management, Order Management, CRM, ERP, Warehouse Management, etc.).
> 
> **For Developers & Antigravity AI Agents**: This document specifies both the visual design tokens and the architectural blueprint. If a project has already been started with existing pages and components, follow the **[Antigravity AI Agent Migration Playbook](#antigravity-ai-agent-migration-playbook)** below to systematically refactor the application.

---

## Quick Summary of Core Principles

1. **Primary Accent**: Electric Cobalt Blue (`#315EFB`) is the **only** primary brand accent.
2. **Absolute Color Rule**: **NO ORANGE** (`#FF7034`, `#E85B20`, `orange-500`, `orange-600`, `bg-orange-50`, etc.) anywhere in the codebase. All legacy orange elements must be converted to Cobalt Blue tokens.
3. **Shell Layout & Sidebar Scroll**: The sidebar must **never scroll when the page scrolls**. The sidebar occupies `100vh` independently; if its menu items exceed screen height, the sidebar scrolls internally. The main content container scrolls independently.
4. **Shared Reusable Navbar**: Every page must use the unified `<Navbar />` component (`src/components/navbar/navbar.tsx`) instead of duplicating header markup.
5. **Clean Editorial Aesthetic**: Minimalist white/neutral canvas (`#FFFFFF` / `#F8F9FA`), subtle borders (`#E8EAF0`), crisp typography, and generous whitespace.

---

## 1. Design Tokens & Color System

### 1.1 Core Design Tokens

| Token | Hex / Class | Role & Usage |
|-------|-------------|--------------|
| `--primary-accent` | `#315EFB` | Active nav items, primary buttons, focus rings, link hover, active pagination, icon highlights |
| `--primary-accent-hover` | `#2448D8` | Hover state for primary buttons and interactive accents |
| `--light-accent-bg` | `#F5F7FF` | Nav item hover, selected table rows, subtle pill tags, active dropdown options, dropzone hover |
| `--primary-text` | `#000000` | Headings, primary labels, main text |
| `--secondary-text` | `#526078` | Subtitles, muted labels, secondary icons, inactive nav items |
| `--main-bg` | `#FFFFFF` | Cards, modals, sidebars, navbar, table rows |
| `--canvas-bg` | `#F8F9FA` | Main page background behind cards |
| `--subtle-border` | `#E8EAF0` | 1px hairline borders for cards, inputs, tables, dividers |

### 1.2 Preserved Functional Colors

| Color | Hex / Class | Use |
|-------|-------------|-----|
| Success / Active Switch | `#10B981` (`emerald-500`) | Toggle switches (`role="switch"`), success badges, stock in status |
| Danger / Delete | `#EF4444` (`red-500`) / `#DC2626` | Delete buttons, close icons, critical stock alerts, print action |
| Secondary Dark Action | `#1D273B` / `#111827` | Secondary modal buttons (Cancel, Close, Reset) |
| Excel Export | `#059669` (`emerald-600`) | CSV / Excel export button |
| PDF Export | `#EF4444` (`red-500`) | PDF print / export button |
| Pastel Badges | `#ECFDF5` (`text-emerald-700`) | Store badges (e.g. Freshmart, category tags) |

### 1.3 `src/index.css` Base Configuration

Every project must include these CSS variables and base rules:

```css
@import "tailwindcss";

:root {
  /* LancersLoom Strategic Accent Colour Tokens */
  --primary-accent: #315EFB;
  --primary-accent-hover: #2448D8;
  --light-accent-bg: #F5F7FF;
  --primary-text: #000000;
  --secondary-text: #526078;
  --main-bg: #FFFFFF;
  --canvas-bg: #F8F9FA;
  --subtle-border: #E8EAF0;

  /* Typography */
  --font: "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "Geist Mono", monospace;

  /* Radius */
  --r-sm: 4px;
  --r-md: 8px;
  --r-lg: 12px;
  --r-xl: 16px;
  --r-full: 9999px;
}

@layer base {
  * {
    border-color: var(--subtle-border);
  }

  body {
    font-family: var(--font);
    background-color: var(--main-bg);
    color: var(--primary-text);
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* Hairline border utilities */
.hairline-border {
  border: 1px solid #E8EAF0;
}

/* Custom Sleek Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E8EAF0;
  border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #C7CBD5;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #E8EAF0 transparent;
}
```

---

## 2. Shell & Layout Architecture

### 2.1 The Two-Column Independent Scroll Pattern

The most common bug in management apps is having the sidebar scroll along with the page content. Management systems must lock the viewport to `100vh` and decouple sidebar scrolling from content scrolling.

```
+-----------------------------------------------------------------------------------+
|  VIEWPORT: h-screen overflow-hidden flex bg-white                                 |
|                                                                                   |
|  +--------------------+  +-----------------------------------------------------+  |
|  | <Sidebar />        |  | <main className="flex-1 flex flex-col h-full        |  |
|  |                    |  |       overflow-y-auto custom-scrollbar">            |  |
|  | - w-64             |  |                                                     |  |
|  | - h-screen         |  |  +-----------------------------------------------+  |  |
|  | - sticky top-0     |  |  | <Navbar /> (sticky top-0 h-16 z-30)           |  |  |
|  | - flex-shrink-0    |  |  +-----------------------------------------------+  |  |
|  | - overflow-hidden  |  |                                                     |  |
|  |                    |  |  +-----------------------------------------------+  |  |
|  |  [Logo & Brand]    |  |  | Page Body: p-6 space-y-5                      |  |  |
|  |                    |  |  |  - Header with Actions                        |  |  |
|  |  [Nav Items list]  |  |  |  - Filters / Search Bar                       |  |  |
|  |   overflow-y-auto  |  |  |  - Data Table or Form                         |  |  |
|  |   min-h-0          |  |  |  - Pagination                                 |  |  |
|  |   custom-scrollbar |  |  |  - Footer                                     |  |  |
|  |                    |  |  +-----------------------------------------------+  |  |
|  |                    |  |                                                     |  |
|  +--------------------+  +-----------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### 2.2 Shell Implementation (`App.tsx`)

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/sidebar/sidebar';
// import your pages...

export default function App() {
  return (
    <BrowserRouter>
      {/* 1. Root Shell: Locked height, no outer page scroll */}
      <div className="flex h-screen overflow-hidden bg-[#FFFFFF] font-sans text-[#000000]">
        
        {/* 2. Independent Sidebar: Stays fixed, scrolls internally if needed */}
        <Sidebar />

        {/* 3. Main Content: Independent vertical scroll */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto bg-[#F8F9FA] custom-scrollbar">
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            {/* Page routes */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
```

### 2.3 Sidebar Implementation (`src/components/sidebar/sidebar.tsx`)

```tsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Box, LayoutList, /* ...icons */ } from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: 'Products', path: '/products', icon: Box },
  { name: 'Category', path: '/category', icon: LayoutList },
  // ...other routes
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#FFFFFF] h-screen sticky top-0 border-r border-[#E8EAF0] flex flex-col py-5 px-3 select-none flex-shrink-0 overflow-hidden">
      {/* Brand Header */}
      <Link
        to="/products"
        className="flex items-center gap-3 px-3 pb-5 mb-4 border-b border-[#E8EAF0] hover:opacity-90 transition-opacity group flex-shrink-0"
      >
        <img
          src="/logo.jpeg"
          alt="LancersLoom Logo"
          className="w-10 h-10 object-contain rounded-xl p-1"
        />
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
    </aside>
  );
};

export default Sidebar;
```

---

## 3. Shared Reusable Navbar Component

Instead of repeating navbar markup in every page file, management applications must import `<Navbar />`.

### 3.1 Implementation (`src/components/navbar/navbar.tsx`)

```tsx
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
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-medium bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
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
          className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Mail with Notification Badge */}
        <div className="relative">
          <button
            type="button"
            title="Messages"
            className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
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
          className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Settings Gear */}
        <button
          type="button"
          title="Settings"
          className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
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
```

---

## 4. UI Patterns & Component Guidelines

### 4.1 Page Header Toolbar

```tsx
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
  <div>
    <h1 className="text-xl font-bold text-slate-800 tracking-tight">Category List</h1>
    <p className="text-xs text-slate-500 mt-0.5">Manage your product categories</p>
  </div>

  <div className="flex items-center gap-2 flex-wrap">
    {/* PDF export button */}
    <button className="w-9 h-9 rounded-md bg-white border border-[#E8EAF0] flex items-center justify-center text-red-500 hover:bg-gray-50 shadow-2xs">
      <FileText className="w-4 h-4" />
    </button>

    {/* CSV export button */}
    <button className="w-9 h-9 rounded-md bg-white border border-[#E8EAF0] flex items-center justify-center text-emerald-600 hover:bg-gray-50 shadow-2xs">
      <FileSpreadsheet className="w-4 h-4" />
    </button>

    {/* Refresh Button with Cobalt Spinner */}
    <button onClick={handleRefresh} className="w-9 h-9 rounded-md bg-white border border-[#E8EAF0] flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-2xs">
      <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#315EFB]' : ''}`} />
    </button>

    {/* Primary "Add New" Action Button */}
    <button
      onClick={() => setIsAddModalOpen(true)}
      className="flex items-center gap-2 bg-[#315EFB] hover:bg-[#2448D8] text-white px-4 py-2 rounded-md font-semibold text-xs shadow-xs transition-colors"
    >
      <Plus className="w-4 h-4" />
      <span>Add Category</span>
    </button>
  </div>
</div>
```

### 4.2 Data Table & Selection Highlights

- **Active / Selected Row**: `bg-[#F5F7FF]`
- **Checkbox Focus / Accent**: `checked:bg-[#315EFB]` or `accent-[#315EFB]`
- **Header Background**: `bg-[#E9ECEF]/70 text-slate-700 font-semibold border-b border-[#E8EAF0]`
- **Row Hover**: `hover:bg-slate-50/50`
- **Action Icons**:
  - Edit: `hover:text-[#315EFB]`
  - View: `hover:text-blue-600`
  - Delete: `hover:text-red-500`

### 4.3 Form Inputs & Dropdowns

- **Base input**: `border border-[#E8EAF0] rounded-md px-3.5 py-2 text-xs font-medium text-slate-700`
- **Focus state**: `focus:outline-none focus:border-[#315EFB]` (NEVER `focus:border-orange-500`)
- **Autocomplete / Dropdown hover**: `hover:bg-[#F5F7FF]`
- **Image Dropzone / Upload area**:
  - Base: `border-2 border-dashed border-[#E8EAF0] rounded-lg p-6 bg-white text-center cursor-pointer`
  - Hover: `hover:border-[#315EFB] hover:bg-[#F5F7FF]`
  - Upload Action Button: `bg-[#315EFB] hover:bg-[#2448D8] text-white text-xs font-semibold px-4 py-2 rounded-md`

### 4.4 Modals & Slide-in Drawers

- **Backdrop**: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs`
- **Modal Card**: `bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E8EAF0] animate-fade-in`
- **Modal Header**: `px-6 py-4 border-b border-[#E8EAF0] flex items-center justify-between bg-slate-50/50`
- **Close Button**: `w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center`
- **Submit Button**: `px-5 py-2.5 bg-[#315EFB] hover:bg-[#2448D8] text-white rounded-md text-xs font-semibold shadow-xs transition-colors`
- **Cancel Button**: `px-5 py-2.5 bg-[#1D273B] hover:bg-[#111827] text-white rounded-md text-xs font-semibold shadow-xs transition-colors`

### 4.5 Pagination Controls

- **Active Page**: `bg-[#315EFB] text-white shadow-2xs rounded-md w-8 h-8 flex items-center justify-center text-xs font-semibold`
- **Inactive Page**: `bg-white border border-[#E8EAF0] text-slate-600 hover:bg-gray-50 rounded-md w-8 h-8 flex items-center justify-center text-xs`
- **Previous / Next buttons**: `w-8 h-8 rounded-md border border-[#E8EAF0] bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-40`

### 4.6 Floating Quick Settings Cog

Every management screen contains the floating quick settings trigger on the right screen edge:
```tsx
<div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
  <button
    type="button"
    title="Quick Settings"
    onClick={() => alert('Quick Settings Panel')}
    className="w-9 h-9 bg-[#315EFB] hover:bg-[#2448D8] text-white rounded-l-md flex items-center justify-center shadow-lg transition-transform hover:-translate-x-0.5"
  >
    <Settings className="w-4 h-4 animate-spin-slow" />
  </button>
</div>
```

---

## Antigravity AI Agent Migration Playbook

> **Instructions for Antigravity AI**: When instructed by the user to "apply design.md" or "migrate to LancersLoom management style" on an already-started repository, execute these 6 systematic phases in order:

### Phase 1: CSS & Tokens Setup
1. Verify and update `src/index.css`:
   - Add the CSS variables (`--primary-accent: #315EFB`, `--primary-accent-hover: #2448D8`, `--light-accent-bg: #F5F7FF`, `--primary-text: #000000`, `--secondary-text: #526078`, `--main-bg: #FFFFFF`, `--subtle-border: #E8EAF0`).
   - Add `.custom-scrollbar` and `.hairline-border` rules.
2. Ensure Tailwind CSS v4 or v3 is properly linked.

### Phase 2: Shell Architecture & Independent Sidebar Fix
1. Inspect `src/App.tsx`:
   - Set the root wrapper to `<div className="flex h-screen overflow-hidden bg-[#FFFFFF] font-sans text-[#000000]">`.
   - Wrap the page routes in `<main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto bg-[#F8F9FA] custom-scrollbar">`.
2. Inspect `src/components/sidebar/sidebar.tsx`:
   - Set outer container to `<aside className="w-64 bg-[#FFFFFF] h-screen sticky top-0 border-r border-[#E8EAF0] flex flex-col py-5 px-3 select-none flex-shrink-0 overflow-hidden">`.
   - Set navigation container to `<nav className="flex-1 space-y-1 overflow-y-auto min-h-0 pr-1.5 custom-scrollbar">`.
   - Set active NavLink class to `bg-[#315EFB] text-[#FFFFFF] shadow-[0_2px_8px_rgba(49,94,251,0.25)]`.
   - Set inactive hover to `text-[#526078] hover:text-[#000000] hover:bg-[#F5F7FF]`.
   - Confirm the sidebar **does not scroll when the page content scrolls**.

### Phase 3: Shared Navbar Extraction & Integration
1. Ensure `src/components/navbar/navbar.tsx` exists with:
   - Fullscreen toggle, Messages mail button, Notifications bell, Settings icon, Profile avatar.
   - Global search input with `⌘ K` badge and `focus:border-[#315EFB]`.
   - Clean export (`export const Navbar`, `export default Navbar`).
2. Scan all page files (`src/pages/**/*.tsx`):
   - Remove any inline `<header>` markup or copy-pasted top navbar code.
   - Insert `<Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />` at the top of each page component.

### Phase 4: Complete Orange Color Purge (Target: 0 Occurrences)
1. Run a case-insensitive grep across `src` for:
   - `orange`
   - `#FF7034`
   - `#E85B20`
   - `bg-orange-`
   - `text-orange-`
   - `border-orange-`
2. Perform replacements:
   - `bg-[#FF7034] hover:bg-[#E85B20]` → `bg-[#315EFB] hover:bg-[#2448D8]`
   - `text-orange-500` / `text-orange-600` → `text-[#315EFB]`
   - `focus:border-orange-500` → `focus:border-[#315EFB]`
   - `hover:border-orange-400` → `hover:border-[#315EFB]`
   - `hover:bg-orange-50` / `hover:bg-orange-50/60` → `hover:bg-[#F5F7FF]`
   - `bg-orange-50` / `bg-orange-100` → `bg-[#F5F7FF]`
   - Checkbox rings and radio rings → `#315EFB`
   - Floating settings cog → `bg-[#315EFB] hover:bg-[#2448D8]`

### Phase 5: Table, Modal, and Form Standardization
1. In all data tables:
   - Selected row background → `bg-[#F5F7FF]`.
   - Action icon hovers → `hover:text-[#315EFB]`.
   - Pagination active button → `bg-[#315EFB] text-white`.
2. In all modals:
   - Submit button → `bg-[#315EFB] hover:bg-[#2448D8] text-white`.
   - Inputs focus → `focus:border-[#315EFB]`.
   - Image upload dropzone hover → `hover:border-[#315EFB] hover:bg-[#F5F7FF]`.

### Phase 6: Quality, Build & Deployment Verification
1. Run `grep` across `src` to confirm **0** matches for `orange`, `FF7034`, `E85B20`.
2. Run `npm run build` (`tsc -b && vite build`) to confirm:
   - Zero TypeScript compilation errors (`TS6133`, `TS2304`, etc.).
   - Zero module resolution errors.
3. Run `npm run lint` (`oxlint` or `eslint`) to ensure zero lint errors.
4. **Hosting / SPA Reload Fix (`vercel.json`)**:
   Ensure `vercel.json` exists in project root so reloading any screen (e.g. `/products`, `/create-product`) routes to `index.html` without 404 errors:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

---

## 5. Verification Checklist Table

| Item | Requirement | Verification Command / Check |
|------|-------------|------------------------------|
| **Accent Color** | Only Electric Cobalt Blue `#315EFB` | Grep for `FF7034`, `E85B20`, `orange` in `src` (must return 0) |
| **Hover Color** | `#2448D8` on buttons & badges | Inspect primary buttons |
| **Light BG** | `#F5F7FF` on row selects & hovers | Inspect table row selects & nav hover |
| **Sidebar Scroll** | Independent from main page scroll | Scroll page; sidebar must remain stationary |
| **Sidebar Overflow**| Has internal scroll if items exceed 100vh | `<nav className="... overflow-y-auto min-h-0 ...">` |
| **Navbar** | Single shared `<Navbar />` component | No duplicate `<header className="h-16...">` in pages |
| **SPA Reload** | `vercel.json` SPA rewrite configured | Verify `vercel.json` routes `/(.*)` to `/index.html` |
| **Build Status** | Zero errors | `npm run build` exits with code 0 |
| **Lint Status** | Zero errors | `npm run lint` exits with code 0 |