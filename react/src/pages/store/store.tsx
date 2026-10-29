import React, { useState } from 'react';
import { Navbar } from '../../components/navbar/navbar';
import { FileText, FileSpreadsheet, RotateCw, Plus, Edit, Eye, Trash2, CheckSquare, Square, X } from 'lucide-react';

interface StoreItem {
  id: string;
  name: string;
  code: string;
  tag: string;
  manager: string;
  city: string;
  phone: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_STORES: StoreItem[] = [
  { id: '1', name: 'Downtown Flagship Outlet', code: 'STR-001', tag: 'Flagship', manager: 'Emma Watson', city: 'New York, NY', phone: '+1 555-3001', status: 'Active' },
  { id: '2', name: 'Freshmart Metro Center', code: 'STR-002', tag: 'Freshmart', manager: 'Liam Neeson', city: 'Chicago, IL', phone: '+1 555-3002', status: 'Active' },
  { id: '3', name: 'Westfield Mall Branch', code: 'STR-003', tag: 'Retail', manager: 'Sophia Loren', city: 'Los Angeles, CA', phone: '+1 555-3003', status: 'Active' },
  { id: '4', name: 'Harbor Express Store', code: 'STR-004', tag: 'Express', manager: 'Lucas Silva', city: 'Miami, FL', phone: '+1 555-3004', status: 'Inactive' },
];

export const Store: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [stores, setStores] = useState<StoreItem[]>(INITIAL_STORES);

  const [formData, setFormData] = useState({
    name: '',
    tag: 'Retail',
    manager: '',
    city: '',
    phone: '',
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStores.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStores.map(s => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      setStores(prev => prev.filter(s => s.id !== id));
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleAddStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newStore: StoreItem = {
      id: Date.now().toString(),
      name: formData.name,
      code: `STR-00${stores.length + 1}`,
      tag: formData.tag || 'Retail',
      manager: formData.manager || 'Store Manager',
      city: formData.city || 'Austin, TX',
      phone: formData.phone || '+1 555-0100',
      status: 'Active',
    };

    setStores([newStore, ...stores]);
    setFormData({ name: '', tag: 'Retail', manager: '', city: '', phone: '' });
    setIsModalOpen(false);
  };

  const filteredStores = stores.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : s.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex flex-col min-h-full">
      {/* Shared Reusable Navbar */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search stores by branch name, code, manager, city..."
      />

      {/* Main Page Body */}
      <div className="p-6 space-y-5 max-w-[1600px] w-full mx-auto">
        {/* Header Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Store List</h1>
            <p className="text-xs text-[#526078] mt-0.5">Manage branch locations, storefronts, and retail outlets</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              title="Export PDF"
              onClick={() => alert('Exporting Stores to PDF...')}
              className="w-9 h-9 rounded-md bg-white border border-[#E8EAF0] flex items-center justify-center text-red-500 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
            </button>

            <button
              type="button"
              title="Export Excel / CSV"
              onClick={() => alert('Exporting Stores to CSV...')}
              className="w-9 h-9 rounded-md bg-white border border-[#E8EAF0] flex items-center justify-center text-emerald-600 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>

            <button
              type="button"
              title="Refresh Stores"
              onClick={handleRefresh}
              className="w-9 h-9 rounded-md bg-white border border-[#E8EAF0] flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#315EFB]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#315EFB] hover:bg-[#2448D8] text-white px-4 py-2 rounded-md font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Store</span>
            </button>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex items-center justify-between bg-white border border-[#E8EAF0] rounded-lg p-2.5 shadow-2xs">
          <div className="flex items-center gap-1.5">
            {(['All', 'Active', 'Inactive'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#315EFB] text-white shadow-2xs font-semibold'
                    : 'text-[#526078] hover:text-[#000000] hover:bg-[#F5F7FF]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#526078]">
            Showing <span className="font-semibold text-slate-800">{filteredStores.length}</span> records
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#E9ECEF]/70 text-slate-700 font-semibold border-b border-[#E8EAF0]">
                  <th className="py-3 px-4 w-12 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-slate-500 hover:text-[#315EFB] transition-colors"
                    >
                      {selectedIds.length === filteredStores.length && filteredStores.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-[#315EFB]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Store Name</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Category Tag</th>
                  <th className="py-3 px-4">Manager</th>
                  <th className="py-3 px-4">City / Location</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF0] text-slate-700">
                {filteredStores.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[#526078]">
                      No stores found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStores.map(store => {
                    const isSelected = selectedIds.includes(store.id);
                    return (
                      <tr
                        key={store.id}
                        className={`transition-colors ${
                          isSelected ? 'bg-[#F5F7FF]' : 'hover:bg-slate-50/50'
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleSelectOne(store.id)}
                            className="text-slate-400 hover:text-[#315EFB] transition-colors"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#315EFB]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {store.name}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {store.code}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#ECFDF5] text-emerald-700 border border-emerald-200">
                            {store.tag}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {store.manager}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {store.city}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {store.phone}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                              store.status === 'Active'
                                ? 'bg-[#ECFDF5] text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {store.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              title="Edit"
                              className="p-1 text-slate-400 hover:text-[#315EFB] transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              title="View"
                              className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              title="Delete"
                              onClick={() => handleDelete(store.id)}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="px-6 py-4 bg-white border-t border-[#E8EAF0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#526078]">
              Showing <span className="font-semibold text-slate-800">1</span> to{' '}
              <span className="font-semibold text-slate-800">{filteredStores.length}</span> of{' '}
              <span className="font-semibold text-slate-800">{stores.length}</span> entries
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled
                className="w-8 h-8 rounded-md border border-[#E8EAF0] bg-white flex items-center justify-center text-slate-500 disabled:opacity-40"
              >
                ‹
              </button>
              <button className="bg-[#315EFB] text-white shadow-2xs rounded-md w-8 h-8 flex items-center justify-center text-xs font-semibold">
                1
              </button>
              <button className="w-8 h-8 rounded-md border border-[#E8EAF0] bg-white flex items-center justify-center text-slate-500 disabled:opacity-40">
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Store Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E8EAF0]">
            <div className="px-6 py-4 border-b border-[#E8EAF0] flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-800">Add New Store</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStore} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Store / Outlet Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Freshmart Central"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-[#E8EAF0] rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#315EFB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Store Tag
                  </label>
                  <input
                    type="text"
                    placeholder="Freshmart / Retail"
                    value={formData.tag}
                    onChange={e => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full border border-[#E8EAF0] rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#315EFB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Store Manager
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Emma Watson"
                    value={formData.manager}
                    onChange={e => setFormData({ ...formData, manager: e.target.value })}
                    className="w-full border border-[#E8EAF0] rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#315EFB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    City / Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chicago, IL"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border border-[#E8EAF0] rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#315EFB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 555-0100"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-[#E8EAF0] rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#315EFB]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8EAF0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-[#1D273B] hover:bg-[#111827] text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#315EFB] hover:bg-[#2448D8] text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Save Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
