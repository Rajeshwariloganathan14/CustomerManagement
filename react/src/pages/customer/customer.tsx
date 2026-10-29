import React, { useState } from 'react';
import { Navbar } from '../../components/navbar/navbar';
import { FileText, FileSpreadsheet, RotateCw, Plus, Edit, Eye, Trash2, CheckSquare, Square, X } from 'lucide-react';

interface CustomerItem {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  country: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_CUSTOMERS: CustomerItem[] = [
  { id: '1', name: 'Thomas Anderson', code: 'CUST-001', email: 'thomas@example.com', phone: '+1 555-0192', country: 'United States', status: 'Active' },
  { id: '2', name: 'Sarah Jenkins', code: 'CUST-002', email: 'sarah.j@example.com', phone: '+1 555-0144', country: 'Canada', status: 'Active' },
  { id: '3', name: 'Marcus Sterling', code: 'CUST-003', email: 'm.sterling@example.com', phone: '+44 20 7946 0912', country: 'United Kingdom', status: 'Active' },
  { id: '4', name: 'Elena Rostova', code: 'CUST-004', email: 'elena.r@example.com', phone: '+49 30 123456', country: 'Germany', status: 'Inactive' },
  { id: '5', name: 'Kenji Takahashi', code: 'CUST-005', email: 'takahashi.k@example.com', phone: '+81 3 5555 0183', country: 'Japan', status: 'Active' },
];

export const Customer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [customers, setCustomers] = useState<CustomerItem[]>(INITIAL_CUSTOMERS);

  // New customer form state
  const [formData, setFormData] = useState({
    name: '',
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
    if (selectedIds.length === filteredCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map(c => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newCustomer: CustomerItem = {
      id: Date.now().toString(),
      name: formData.name,
      code: `CUST-00${customers.length + 1}`,
      email: formData.email || 'customer@example.com',
      phone: formData.phone || '+1 555-0000',
      country: formData.country,
      status: 'Active',
    };

    setCustomers([newCustomer, ...customers]);
    setFormData({ name: '', email: '', phone: '', country: 'United States' });
    setIsModalOpen(false);
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : c.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex flex-col min-h-full">
      {/* Shared Reusable Navbar */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search customers by name, code, email..."
      />

      {/* Main Page Body */}
      <div className="p-6 space-y-5 max-w-[1600px] w-full mx-auto">
        {/* Header Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Customer List</h1>
            <p className="text-xs text-[#526078] mt-0.5">Manage customer directory, contact info, and accounts</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* PDF export button */}
            <button
              type="button"
              title="Export PDF"
              onClick={() => alert('Exporting Customers to PDF...')}
              className="w-9 h-9 rounded-md bg-white border border-[#E8EAF0] flex items-center justify-center text-red-500 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* CSV export button */}
            <button
              type="button"
              title="Export Excel / CSV"
              onClick={() => alert('Exporting Customers to CSV...')}
              className="w-9 h-9 rounded-md bg-white border border-[#E8EAF0] flex items-center justify-center text-emerald-600 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>

            {/* Refresh Button with Cobalt Spinner */}
            <button
              type="button"
              title="Refresh Customers"
              onClick={handleRefresh}
              className="w-9 h-9 rounded-md bg-white border border-[#E8EAF0] flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#315EFB]' : ''}`} />
            </button>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#315EFB] hover:bg-[#2448D8] text-white px-4 py-2 rounded-md font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
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
            Showing <span className="font-semibold text-slate-800">{filteredCustomers.length}</span> records
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
                      {selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-[#315EFB]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF0] text-slate-700">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#526078]">
                      No customers found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(customer => {
                    const isSelected = selectedIds.includes(customer.id);
                    return (
                      <tr
                        key={customer.id}
                        className={`transition-colors ${
                          isSelected ? 'bg-[#F5F7FF]' : 'hover:bg-slate-50/50'
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleSelectOne(customer.id)}
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
                          {customer.name}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {customer.code}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {customer.email}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {customer.phone}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {customer.country}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                              customer.status === 'Active'
                                ? 'bg-[#ECFDF5] text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {customer.status}
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
                              onClick={() => handleDelete(customer.id)}
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
              <span className="font-semibold text-slate-800">{filteredCustomers.length}</span> of{' '}
              <span className="font-semibold text-slate-800">{customers.length}</span> entries
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
              <button className="bg-white border border-[#E8EAF0] text-slate-600 hover:bg-gray-50 rounded-md w-8 h-8 flex items-center justify-center text-xs">
                2
              </button>
              <button className="w-8 h-8 rounded-md border border-[#E8EAF0] bg-white flex items-center justify-center text-slate-500 hover:text-slate-800">
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E8EAF0]">
            <div className="px-6 py-4 border-b border-[#E8EAF0] flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-800">Add New Customer</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                    placeholder="john@example.com"
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
                  placeholder="United States"
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;
