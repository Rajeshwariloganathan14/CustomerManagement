import React, { useState } from 'react';
import { Navbar } from '../../components/navbar/navbar';
import { FileText, FileSpreadsheet, RotateCw, Plus, Edit, Eye, Trash2, CheckSquare, Square, X } from 'lucide-react';

interface SupplierItem {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_SUPPLIERS: SupplierItem[] = [
  { id: '1', name: 'Global Tech Components', code: 'SUP-001', contactPerson: 'David Chen', email: 'david@globaltech.com', phone: '+1 555-4421', country: 'Taiwan', status: 'Active' },
  { id: '2', name: 'Nordic Logistics Supplies', code: 'SUP-002', contactPerson: 'Astrid Lindgren', email: 'orders@nordicsupply.se', phone: '+46 8 123 456', country: 'Sweden', status: 'Active' },
  { id: '3', name: 'Prime Packaging Ltd', code: 'SUP-003', contactPerson: 'Arthur Pendelton', email: 'sales@primepack.co.uk', phone: '+44 20 7123 9988', country: 'United Kingdom', status: 'Active' },
  { id: '4', name: 'Delta Materials Co.', code: 'SUP-004', contactPerson: 'Carlos Mendes', email: 'carlos@deltamaterials.com', phone: '+55 11 9876-5432', country: 'Brazil', status: 'Inactive' },
];

export const Supplier: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [suppliers, setSuppliers] = useState<SupplierItem[]>(INITIAL_SUPPLIERS);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: 'United States',
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSuppliers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSuppliers.map(s => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newSupplier: SupplierItem = {
      id: Date.now().toString(),
      name: formData.name,
      code: `SUP-00${suppliers.length + 1}`,
      contactPerson: formData.contactPerson || 'Vendor Rep',
      email: formData.email || 'orders@vendor.com',
      phone: formData.phone || '+1 555-0100',
      country: formData.country,
      status: 'Active',
    };

    setSuppliers([newSupplier, ...suppliers]);
    setFormData({ name: '', contactPerson: '', email: '', phone: '', country: 'United States' });
    setIsModalOpen(false);
  };

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : s.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex flex-col min-h-full">
      {/* Shared Reusable Navbar */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search suppliers by name, code, contact person..."
      />

      {/* Main Page Body */}
      <div className="p-6 space-y-5 max-w-[1600px] w-full mx-auto">
        {/* Header Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Supplier List</h1>
            <p className="text-xs text-[#526078] mt-0.5">Manage vendors, raw material suppliers, and procurements</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              title="Export PDF"
              onClick={() => alert('Exporting Suppliers to PDF...')}
              className="w-9 h-9 rounded-md bg-white border border-[#E8EAF0] flex items-center justify-center text-red-500 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
            </button>

            <button
              type="button"
              title="Export Excel / CSV"
              onClick={() => alert('Exporting Suppliers to CSV...')}
              className="w-9 h-9 rounded-md bg-white border border-[#E8EAF0] flex items-center justify-center text-emerald-600 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>

            <button
              type="button"
              title="Refresh Suppliers"
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
              <span>Add Supplier</span>
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
            Showing <span className="font-semibold text-slate-800">{filteredSuppliers.length}</span> records
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
                      {selectedIds.length === filteredSuppliers.length && filteredSuppliers.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-[#315EFB]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Supplier Name</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Contact Person</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF0] text-slate-700">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[#526078]">
                      No suppliers found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map(supplier => {
                    const isSelected = selectedIds.includes(supplier.id);
                    return (
                      <tr
                        key={supplier.id}
                        className={`transition-colors ${
                          isSelected ? 'bg-[#F5F7FF]' : 'hover:bg-slate-50/50'
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleSelectOne(supplier.id)}
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
                          {supplier.name}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {supplier.code}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {supplier.contactPerson}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {supplier.email}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {supplier.phone}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {supplier.country}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                              supplier.status === 'Active'
                                ? 'bg-[#ECFDF5] text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {supplier.status}
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
                              onClick={() => handleDelete(supplier.id)}
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
              <span className="font-semibold text-slate-800">{filteredSuppliers.length}</span> of{' '}
              <span className="font-semibold text-slate-800">{suppliers.length}</span> entries
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

      {/* Add Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E8EAF0]">
            <div className="px-6 py-4 border-b border-[#E8EAF0] flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-800">Add New Supplier</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Supplier Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Global Tech Components"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-[#E8EAF0] rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#315EFB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  placeholder="e.g. David Chen"
                  value={formData.contactPerson}
                  onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full border border-[#E8EAF0] rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#315EFB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="contact@vendor.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
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

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Country / Region
                </label>
                <input
                  type="text"
                  placeholder="Taiwan"
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  className="w-full border border-[#E8EAF0] rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#315EFB]"
                />
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
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier;
