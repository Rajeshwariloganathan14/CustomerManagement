import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/navbar/navbar';
import {
  Users,
  Store as StoreIcon,
  Warehouse as WarehouseIcon,
  Truck,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  RotateCw,
  FileSpreadsheet,
  FileText,
  Plus,
  Clock,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

type DateRange = 'today' | '7d' | '30d' | 'quarter' | 'ytd';
type ActiveTab = 'feed' | 'stores' | 'warehouses' | 'suppliers' | 'billers';

interface ActivityItem {
  id: string;
  type: 'customer' | 'store' | 'warehouse' | 'supplier' | 'biller';
  title: string;
  description: string;
  time: string;
  entityCode: string;
  badge: string;
  badgeColor: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'customer',
    title: 'New Customer Registered',
    description: 'Sarah Jenkins registered through North America portal',
    time: '12 mins ago',
    entityCode: 'CUST-002',
    badge: 'Customer',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: 'act-2',
    type: 'biller',
    title: 'Invoicing Batch Cleared',
    description: 'Metro Finance Group processed $48,500 monthly statement',
    time: '34 mins ago',
    entityCode: 'BIL-001',
    badge: 'Billing',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'act-3',
    type: 'store',
    title: 'Daily Store Settlement Complete',
    description: 'Downtown Flagship Outlet reached $18,420 sales volume today',
    time: '1 hour ago',
    entityCode: 'STR-001',
    badge: 'Retail Store',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    id: 'act-4',
    type: 'warehouse',
    title: 'High Capacity Alert',
    description: 'East Port Cold Storage Facility reached 91% allocated capacity',
    time: '2 hours ago',
    entityCode: 'WH-003',
    badge: 'Logistics',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 'act-5',
    type: 'supplier',
    title: 'Inbound PO Batch Verified',
    description: 'Global Tech Components shipped 4,200 units with on-time seal',
    time: '3 hours ago',
    entityCode: 'SUP-001',
    badge: 'Supplier',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200'
  },
  {
    id: 'act-6',
    type: 'customer',
    title: 'Customer Profile Updated',
    description: 'Kenji Takahashi changed enterprise contact in Tokyo branch',
    time: '4 hours ago',
    entityCode: 'CUST-005',
    badge: 'Customer',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  }
];

const STORE_PERFORMANCE = [
  { id: '1', name: 'Downtown Flagship Outlet', code: 'STR-001', tag: 'Flagship', manager: 'Emma Watson', city: 'New York, NY', revenue: '$142,500', health: '99.8%', status: 'Active' },
  { id: '2', name: 'Freshmart Metro Center', code: 'STR-002', tag: 'Freshmart', manager: 'Liam Neeson', city: 'Chicago, IL', revenue: '$118,900', health: '99.4%', status: 'Active' },
  { id: '3', name: 'Westfield Mall Branch', code: 'STR-003', tag: 'Retail', manager: 'Sophia Loren', city: 'Los Angeles, CA', revenue: '$96,400', health: '97.2%', status: 'Active' },
  { id: '4', name: 'Harbor Express Store', code: 'STR-004', tag: 'Express', manager: 'Lucas Silva', city: 'Miami, FL', revenue: '$64,200', health: '94.0%', status: 'Active' }
];

const WAREHOUSE_STATUS = [
  { id: '1', name: 'Central Logistics Hub A', code: 'WH-001', total: '120,000 sq ft', usedPercent: 82, supervisor: 'Robert Vance', city: 'Dallas, TX', status: 'Optimal' },
  { id: '2', name: 'West Coast Distribution Center', code: 'WH-002', total: '95,000 sq ft', usedPercent: 68, supervisor: 'Hannah Abbott', city: 'Seattle, WA', status: 'Normal' },
  { id: '3', name: 'East Port Cold Storage Facility', code: 'WH-003', total: '60,000 sq ft', usedPercent: 91, supervisor: 'Gregor Clegane', city: 'Newark, NJ', status: 'Near Peak' },
  { id: '4', name: 'Southern Overflow Yard', code: 'WH-004', total: '45,000 sq ft', usedPercent: 42, supervisor: 'Arthur Dent', city: 'Atlanta, GA', status: 'Available' }
];

const SUPPLIER_OVERVIEW = [
  { id: '1', name: 'Global Tech Components', code: 'SUP-001', contactPerson: 'David Chen', country: 'Taiwan', fulfillment: '99.2%', activeOrders: 14, status: 'Active' },
  { id: '2', name: 'Nordic Logistics Supplies', code: 'SUP-002', contactPerson: 'Astrid Lindgren', country: 'Sweden', fulfillment: '98.8%', activeOrders: 8, status: 'Active' },
  { id: '3', name: 'Prime Packaging Ltd', code: 'SUP-003', contactPerson: 'Arthur Pendelton', country: 'United Kingdom', fulfillment: '97.5%', activeOrders: 11, status: 'Active' },
  { id: '4', name: 'Delta Materials Co.', code: 'SUP-004', contactPerson: 'Carlos Mendes', country: 'Brazil', fulfillment: '95.1%', activeOrders: 5, status: 'Inactive' }
];

const BILLER_OVERVIEW = [
  { id: '1', name: 'Metro Finance Group', code: 'BIL-001', taxNumber: 'TX-992019', invoicedThisMonth: '$184,200', accuracy: '100%', status: 'Active' },
  { id: '2', name: 'Apex Invoicing Partners', code: 'BIL-002', taxNumber: 'TX-883192', invoicedThisMonth: '$142,800', accuracy: '99.6%', status: 'Active' },
  { id: '3', name: 'Global Commerce Billing', code: 'BIL-003', taxNumber: 'GB-339102', invoicedThisMonth: '$112,500', accuracy: '99.1%', status: 'Active' },
  { id: '4', name: 'Horizon Billing LLC', code: 'BIL-004', taxNumber: 'TX-440192', invoicedThisMonth: '$43,400', accuracy: '98.5%', status: 'Active' }
];

const MONTHLY_CHART_DATA = [
  { month: 'Nov', revenue: 380, volume: 1420, stores: 88, billers: 92 },
  { month: 'Dec', revenue: 420, volume: 1650, stores: 94, billers: 95 },
  { month: 'Jan', revenue: 395, volume: 1510, stores: 91, billers: 93 },
  { month: 'Feb', revenue: 440, volume: 1720, stores: 95, billers: 97 },
  { month: 'Mar', revenue: 465, volume: 1840, stores: 97, billers: 98 },
  { month: 'Apr', revenue: 482, volume: 1960, stores: 98, billers: 99 }
];

export const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'volume'>('revenue');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);

  // Quick Action form state
  const [quickActionType, setQuickActionType] = useState<'customer' | 'store' | 'supplier' | 'biller' | 'warehouse'>('customer');
  const [quickFormName, setQuickFormName] = useState('');
  const [quickFormMeta, setQuickFormMeta] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast('All operational metrics and entity data refreshed');
    }, 650);
  };

  const handleExportCSV = () => {
    triggerToast('Exporting complete Operational Dashboard summary as CSV...');
  };

  const handleExportPDF = () => {
    triggerToast('Generating executive print-ready PDF overview...');
  };

  const handleQuickActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickFormName.trim()) return;
    triggerToast(`Created new ${quickActionType.toUpperCase()}: "${quickFormName}" successfully!`);
    setQuickFormName('');
    setQuickFormMeta('');
    setIsQuickActionModalOpen(false);
  };

  // Dynamic filter for search term
  const filteredActivities = useMemo(() => {
    if (!searchTerm.trim()) return ACTIVITIES;
    const term = searchTerm.toLowerCase();
    return ACTIVITIES.filter(
      item =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.entityCode.toLowerCase().includes(term) ||
        item.badge.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const filteredStores = useMemo(() => {
    if (!searchTerm.trim()) return STORE_PERFORMANCE;
    const term = searchTerm.toLowerCase();
    return STORE_PERFORMANCE.filter(
      s =>
        s.name.toLowerCase().includes(term) ||
        s.city.toLowerCase().includes(term) ||
        s.manager.toLowerCase().includes(term) ||
        s.tag.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const filteredWarehouses = useMemo(() => {
    if (!searchTerm.trim()) return WAREHOUSE_STATUS;
    const term = searchTerm.toLowerCase();
    return WAREHOUSE_STATUS.filter(
      w =>
        w.name.toLowerCase().includes(term) ||
        w.city.toLowerCase().includes(term) ||
        w.supervisor.toLowerCase().includes(term) ||
        w.code.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Adjust display KPIs based on selected date range
  const metrics = useMemo(() => {
    switch (dateRange) {
      case 'today':
        return {
          customers: '24',
          customerGrowth: '+4 today',
          storesRevenue: '$18.4K',
          storesGrowth: '+9.2%',
          warehouseUtil: '74.8%',
          utilDesc: '239,400 sq ft allocated',
          suppliersFulfilled: '99.4%',
          ordersCount: '34 orders today',
          invoicingTotal: '$16,200',
          invoicingStatus: '100% cleared'
        };
      case '7d':
        return {
          customers: '142',
          customerGrowth: '+18.5%',
          storesRevenue: '$112.8K',
          storesGrowth: '+11.2%',
          warehouseUtil: '74.8%',
          utilDesc: '320,000 sq ft network',
          suppliersFulfilled: '98.9%',
          ordersCount: '168 dispatches',
          invoicingTotal: '$124,500',
          invoicingStatus: '4 billers active'
        };
      case 'quarter':
        return {
          customers: '2,940',
          customerGrowth: '+22.4%',
          storesRevenue: '$1.42M',
          storesGrowth: '+16.8%',
          warehouseUtil: '76.2%',
          utilDesc: 'Network expansion ready',
          suppliersFulfilled: '98.2%',
          ordersCount: '1,940 dispatches',
          invoicingTotal: '$1.48M',
          invoicingStatus: 'Quarterly audit passed'
        };
      case 'ytd':
        return {
          customers: '4,850',
          customerGrowth: '+34.1%',
          storesRevenue: '$4.89M',
          storesGrowth: '+24.5%',
          warehouseUtil: '75.4%',
          utilDesc: '4 Strategic Regional Hubs',
          suppliersFulfilled: '98.5%',
          ordersCount: '6,420 dispatches',
          invoicingTotal: '$4.95M',
          invoicingStatus: 'Full fiscal compliance'
        };
      case '30d':
      default:
        return {
          customers: '1,284',
          customerGrowth: '+14.2%',
          storesRevenue: '$422,000',
          storesGrowth: '+12.8%',
          warehouseUtil: '74.8%',
          utilDesc: '239,400 sq ft used',
          suppliersFulfilled: '98.6%',
          ordersCount: '48 verified vendors',
          invoicingTotal: '$482,900',
          invoicingStatus: '99.1% clearance'
        };
    }
  }, [dateRange]);

  return (
    <div className="flex flex-col min-h-full pb-12">
      {/* 1. Shared Reusable Navbar */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search customers, stores, warehouses, billers..."
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1D273B] text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#315EFB]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Page Body */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* 2. Top Header & Control Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1 border-b border-[#E8EAF0]/60">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#000000] tracking-tight">Executive Operations Dashboard</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-[#526078] mt-1">
              Real-time intelligence across Customers, Stores, Warehouses, Suppliers, and Billing Partners.
            </p>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date Range Selector Pill */}
            <div className="flex items-center bg-white border border-[#E8EAF0] p-1 rounded-lg text-xs font-medium text-[#526078] shadow-2xs">
              {(['today', '7d', '30d', 'quarter', 'ytd'] as DateRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-2.5 py-1 rounded-md transition-all uppercase text-[10px] tracking-wider font-semibold ${
                    dateRange === range
                      ? 'bg-[#315EFB] text-white shadow-2xs'
                      : 'hover:text-[#000000] hover:bg-[#F5F7FF]'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range}
                </button>
              ))}
            </div>

            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              title="Export PDF Report"
              className="w-9 h-9 rounded-md bg-white border border-[#E8EAF0] flex items-center justify-center text-red-500 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              title="Export CSV Data"
              className="w-9 h-9 rounded-md bg-white border border-[#E8EAF0] flex items-center justify-center text-emerald-600 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>

            {/* Live Refresh Button */}
            <button
              onClick={handleRefresh}
              title="Refresh Dashboard Data"
              className="w-9 h-9 rounded-md bg-white border border-[#E8EAF0] flex items-center justify-center text-[#526078] hover:text-[#000000] hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#315EFB]' : ''}`} />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => setIsQuickActionModalOpen(true)}
              className="flex items-center gap-2 bg-[#315EFB] hover:bg-[#2448D8] text-white px-3.5 py-2 rounded-md font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Create</span>
            </button>
          </div>
        </div>

        {/* 3. Core 5-Pillar Metric Cards (Customers, Stores, Warehouses, Suppliers, Billers) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Customers */}
          <Link
            to="/customers"
            className="group bg-white rounded-xl border border-[#E8EAF0] p-4 shadow-2xs hover:border-[#315EFB]/60 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold tracking-wider text-[#526078] uppercase">Customers</span>
                <div className="w-8 h-8 rounded-lg bg-[#F5F7FF] flex items-center justify-center text-[#315EFB] group-hover:bg-[#315EFB] group-hover:text-white transition-colors">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#000000]">{metrics.customers}</span>
                <span className="flex items-center text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  {metrics.customerGrowth}
                </span>
              </div>
              <p className="text-[11px] text-[#526078] mt-1.5 truncate">
                1,195 Active • 89 Inactive
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#E8EAF0] flex items-center justify-between text-[11px] font-medium text-[#315EFB]">
              <span>Manage Customers</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Stores */}
          <Link
            to="/stores"
            className="group bg-white rounded-xl border border-[#E8EAF0] p-4 shadow-2xs hover:border-[#315EFB]/60 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold tracking-wider text-[#526078] uppercase">Retail Stores</span>
                <div className="w-8 h-8 rounded-lg bg-[#F5F7FF] flex items-center justify-center text-[#315EFB] group-hover:bg-[#315EFB] group-hover:text-white transition-colors">
                  <StoreIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#000000]">24 Outlets</span>
                <span className="flex items-center text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  {metrics.storesGrowth}
                </span>
              </div>
              <p className="text-[11px] text-[#526078] mt-1.5 truncate">
                {metrics.storesRevenue} revenue • 96% health
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#E8EAF0] flex items-center justify-between text-[11px] font-medium text-[#315EFB]">
              <span>Store Branches</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Warehouses */}
          <Link
            to="/warehouses"
            className="group bg-white rounded-xl border border-[#E8EAF0] p-4 shadow-2xs hover:border-[#315EFB]/60 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold tracking-wider text-[#526078] uppercase">Warehouses</span>
                <div className="w-8 h-8 rounded-lg bg-[#F5F7FF] flex items-center justify-center text-[#315EFB] group-hover:bg-[#315EFB] group-hover:text-white transition-colors">
                  <WarehouseIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#000000]">{metrics.warehouseUtil}</span>
                <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                  4 Hubs
                </span>
              </div>
              <p className="text-[11px] text-[#526078] mt-1.5 truncate">
                {metrics.utilDesc}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#E8EAF0] flex items-center justify-between text-[11px] font-medium text-[#315EFB]">
              <span>Logistics Storage</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Suppliers */}
          <Link
            to="/suppliers"
            className="group bg-white rounded-xl border border-[#E8EAF0] p-4 shadow-2xs hover:border-[#315EFB]/60 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold tracking-wider text-[#526078] uppercase">Suppliers</span>
                <div className="w-8 h-8 rounded-lg bg-[#F5F7FF] flex items-center justify-center text-[#315EFB] group-hover:bg-[#315EFB] group-hover:text-white transition-colors">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#000000]">{metrics.suppliersFulfilled}</span>
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  On-Time
                </span>
              </div>
              <p className="text-[11px] text-[#526078] mt-1.5 truncate">
                {metrics.ordersCount}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#E8EAF0] flex items-center justify-between text-[11px] font-medium text-[#315EFB]">
              <span>Vendor Directory</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 5: Billers */}
          <Link
            to="/billers"
            className="group bg-white rounded-xl border border-[#E8EAF0] p-4 shadow-2xs hover:border-[#315EFB]/60 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold tracking-wider text-[#526078] uppercase">Billing & Invoicing</span>
                <div className="w-8 h-8 rounded-lg bg-[#F5F7FF] flex items-center justify-center text-[#315EFB] group-hover:bg-[#315EFB] group-hover:text-white transition-colors">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#000000]">{metrics.invoicingTotal}</span>
                <span className="flex items-center text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  +8.4%
                </span>
              </div>
              <p className="text-[11px] text-[#526078] mt-1.5 truncate">
                {metrics.invoicingStatus}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#E8EAF0] flex items-center justify-between text-[11px] font-medium text-[#315EFB]">
              <span>Invoicing Hub</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

        </div>

        {/* 4. Visual Charts & Capacity Overview (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue & Billing Performance Chart (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8EAF0] p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8EAF0]">
                <div>
                  <h3 className="font-semibold text-sm text-[#000000]">Invoicing & Revenue Volume Trend</h3>
                  <p className="text-xs text-[#526078]">Aggregated throughput across billing partners and physical stores</p>
                </div>
                {/* Metric toggle */}
                <div className="flex items-center bg-gray-50 border border-[#E8EAF0] p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setChartMetric('revenue')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      chartMetric === 'revenue'
                        ? 'bg-[#315EFB] text-white shadow-xs'
                        : 'text-[#526078] hover:text-[#000000]'
                    }`}
                  >
                    Revenue ($k)
                  </button>
                  <button
                    onClick={() => setChartMetric('volume')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      chartMetric === 'volume'
                        ? 'bg-[#315EFB] text-white shadow-xs'
                        : 'text-[#526078] hover:text-[#000000]'
                    }`}
                  >
                    Volume (Units)
                  </button>
                </div>
              </div>

              {/* Dynamic SVG / Bar Chart Representation */}
              <div className="pt-6">
                <div className="flex items-end justify-between gap-2 sm:gap-6 h-52 px-2 pb-2 border-b border-[#E8EAF0]">
                  {MONTHLY_CHART_DATA.map((d) => {
                    const value = chartMetric === 'revenue' ? d.revenue : d.volume / 4;
                    const maxVal = chartMetric === 'revenue' ? 520 : 520;
                    const heightPercent = Math.min(100, Math.round((value / maxVal) * 100));

                    return (
                      <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group relative">
                        {/* Hover Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 bg-[#1D273B] text-white text-[11px] py-1 px-2 rounded pointer-events-none whitespace-nowrap shadow-lg">
                          <span className="font-semibold">
                            {chartMetric === 'revenue' ? `$${d.revenue},000` : `${d.volume} units`}
                          </span>
                          <span className="text-gray-300 ml-1">({d.month})</span>
                        </div>

                        {/* Bar Graphic with Cobalt Gradient */}
                        <div className="w-full max-w-[42px] bg-[#F5F7FF] rounded-t-md h-full flex items-end overflow-hidden">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full bg-gradient-to-t from-[#315EFB] to-[#547CFF] rounded-t-md group-hover:from-[#2448D8] group-hover:to-[#315EFB] transition-all duration-300 shadow-xs"
                          />
                        </div>
                        <span className="text-[11px] font-medium text-[#526078] group-hover:text-[#315EFB] transition-colors">
                          {d.month}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Chart Summary Footnote */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-xs text-[#526078]">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#315EFB]" />
                      <span>{chartMetric === 'revenue' ? 'Invoiced Revenue' : 'Dispatched Volume'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#E8EAF0]" />
                      <span>Forecast Target</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+14.8% growth vs last period</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E8EAF0] flex items-center justify-between text-xs text-[#526078]">
              <span>Primary Source: Metro Finance & Invoicing Engine</span>
              <Link to="/billers" className="text-[#315EFB] font-medium hover:underline flex items-center gap-1">
                View All Invoices <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Warehouse Logistics Capacity Meters (1 Col) */}
          <div className="bg-white rounded-xl border border-[#E8EAF0] p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E8EAF0]">
                <div>
                  <h3 className="font-semibold text-sm text-[#000000]">Warehouse Capacity</h3>
                  <p className="text-xs text-[#526078]">Space allocation & status by facility</p>
                </div>
                <Link
                  to="/warehouses"
                  className="p-1 text-[#315EFB] hover:bg-[#F5F7FF] rounded-md transition-colors"
                  title="Go to Warehouses"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Progress bars list */}
              <div className="mt-4 space-y-4">
                {filteredWarehouses.map((wh) => {
                  const isHigh = wh.usedPercent >= 90;
                  const isModerate = wh.usedPercent >= 75 && wh.usedPercent < 90;

                  return (
                    <div key={wh.id} className="group">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-[#000000] truncate max-w-[170px]" title={wh.name}>
                          {wh.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                            isHigh
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : isModerate
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {wh.status}
                          </span>
                          <span className="font-semibold text-slate-800">{wh.usedPercent}%</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${wh.usedPercent}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            isHigh
                              ? 'bg-amber-500'
                              : isModerate
                              ? 'bg-[#315EFB]'
                              : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#526078] mt-1">
                        <span>{wh.city}</span>
                        <span>{wh.total}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E8EAF0] flex items-center justify-between text-xs">
              <span className="text-[#526078]">Total Capacity: 320,000 sq ft</span>
              <Link to="/warehouses" className="text-[#315EFB] font-semibold hover:underline">
                Optimize Logistics →
              </Link>
            </div>
          </div>

        </div>

        {/* 5. Operations Hub: Tabbed Multi-Entity Matrix & Activity Feed */}
        <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-2xs overflow-hidden">
          {/* Tabs Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 pt-4 border-b border-[#E8EAF0] gap-3">
            <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => setActiveTab('feed')}
                className={`px-3 py-2 text-xs font-semibold rounded-t-md border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'feed'
                    ? 'border-[#315EFB] text-[#315EFB] bg-[#F5F7FF]/50'
                    : 'border-transparent text-[#526078] hover:text-[#000000]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Live Operational Feed
                <span className="ml-1 px-1.5 py-0.2 bg-slate-100 rounded text-[10px] text-slate-600">
                  {filteredActivities.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('stores')}
                className={`px-3 py-2 text-xs font-semibold rounded-t-md border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'stores'
                    ? 'border-[#315EFB] text-[#315EFB] bg-[#F5F7FF]/50'
                    : 'border-transparent text-[#526078] hover:text-[#000000]'
                }`}
              >
                <StoreIcon className="w-3.5 h-3.5" />
                Retail Stores Network
              </button>

              <button
                onClick={() => setActiveTab('suppliers')}
                className={`px-3 py-2 text-xs font-semibold rounded-t-md border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'suppliers'
                    ? 'border-[#315EFB] text-[#315EFB] bg-[#F5F7FF]/50'
                    : 'border-transparent text-[#526078] hover:text-[#000000]'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                Suppliers & Sourcing
              </button>

              <button
                onClick={() => setActiveTab('billers')}
                className={`px-3 py-2 text-xs font-semibold rounded-t-md border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'billers'
                    ? 'border-[#315EFB] text-[#315EFB] bg-[#F5F7FF]/50'
                    : 'border-transparent text-[#526078] hover:text-[#000000]'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                Billing Partners
              </button>
            </div>

            {/* Quick Status Count */}
            <div className="pb-2 sm:pb-0 text-xs text-[#526078] flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Tab Content 1: Live Operational Feed */}
          {activeTab === 'feed' && (
            <div className="divide-y divide-[#E8EAF0]">
              {filteredActivities.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#526078]">
                  No operational activities found matching your search.
                </div>
              ) : (
                filteredActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-4 sm:px-6 hover:bg-[#F5F7FF]/40 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-lg bg-[#F5F7FF] border border-[#E8EAF0] flex items-center justify-center text-[#315EFB] flex-shrink-0 mt-0.5">
                        {act.type === 'customer' && <Users className="w-4 h-4" />}
                        {act.type === 'store' && <StoreIcon className="w-4 h-4" />}
                        {act.type === 'warehouse' && <WarehouseIcon className="w-4 h-4" />}
                        {act.type === 'supplier' && <Truck className="w-4 h-4" />}
                        {act.type === 'biller' && <Receipt className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-semibold text-[#000000]">{act.title}</h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${act.badgeColor}`}>
                            {act.badge}
                          </span>
                          <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {act.entityCode}
                          </span>
                        </div>
                        <p className="text-xs text-[#526078] mt-0.5">{act.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 text-right">
                      <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">{act.time}</span>
                      <Link
                        to={`/${act.type}s`}
                        className="text-[#315EFB] hover:text-[#2448D8] p-1 rounded hover:bg-[#F5F7FF]"
                        title={`Inspect ${act.type}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab Content 2: Stores Leaderboard */}
          {activeTab === 'stores' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#E9ECEF]/70 text-slate-700 font-semibold border-b border-[#E8EAF0]">
                    <th className="px-5 py-3">Store Name</th>
                    <th className="px-5 py-3">Code</th>
                    <th className="px-5 py-3">Format Tag</th>
                    <th className="px-5 py-3">Store Manager</th>
                    <th className="px-5 py-3">City</th>
                    <th className="px-5 py-3">Monthly Vol.</th>
                    <th className="px-5 py-3">Operational Health</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EAF0]">
                  {filteredStores.map((s) => (
                    <tr key={s.id} className="hover:bg-[#F5F7FF]/50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-[#000000]">{s.name}</td>
                      <td className="px-5 py-3 font-mono text-gray-500">{s.code}</td>
                      <td className="px-5 py-3">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">
                          {s.tag}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[#526078]">{s.manager}</td>
                      <td className="px-5 py-3 text-[#526078]">{s.city}</td>
                      <td className="px-5 py-3 font-semibold text-[#000000]">{s.revenue}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-medium text-emerald-700">{s.health}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          to="/stores"
                          className="text-[#315EFB] hover:text-[#2448D8] font-semibold text-xs hover:underline"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab Content 3: Suppliers & Sourcing */}
          {activeTab === 'suppliers' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#E9ECEF]/70 text-slate-700 font-semibold border-b border-[#E8EAF0]">
                    <th className="px-5 py-3">Supplier Name</th>
                    <th className="px-5 py-3">Code</th>
                    <th className="px-5 py-3">Contact Person</th>
                    <th className="px-5 py-3">Origin Country</th>
                    <th className="px-5 py-3">Fulfillment Rate</th>
                    <th className="px-5 py-3">Active Inbound POs</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EAF0]">
                  {SUPPLIER_OVERVIEW.map((sup) => (
                    <tr key={sup.id} className="hover:bg-[#F5F7FF]/50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-[#000000]">{sup.name}</td>
                      <td className="px-5 py-3 font-mono text-gray-500">{sup.code}</td>
                      <td className="px-5 py-3 text-[#526078]">{sup.contactPerson}</td>
                      <td className="px-5 py-3">
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded text-[11px] font-medium">
                          {sup.country}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-semibold text-emerald-600">{sup.fulfillment}</td>
                      <td className="px-5 py-3 text-slate-700">{sup.activeOrders} Shipments</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          sup.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {sup.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          to="/suppliers"
                          className="text-[#315EFB] hover:text-[#2448D8] font-semibold text-xs hover:underline"
                        >
                          Directory
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab Content 4: Billing Partners */}
          {activeTab === 'billers' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#E9ECEF]/70 text-slate-700 font-semibold border-b border-[#E8EAF0]">
                    <th className="px-5 py-3">Biller / Invoicing Agency</th>
                    <th className="px-5 py-3">Code</th>
                    <th className="px-5 py-3">Tax Number</th>
                    <th className="px-5 py-3">Invoiced This Month</th>
                    <th className="px-5 py-3">Accuracy Score</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EAF0]">
                  {BILLER_OVERVIEW.map((b) => (
                    <tr key={b.id} className="hover:bg-[#F5F7FF]/50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-[#000000]">{b.name}</td>
                      <td className="px-5 py-3 font-mono text-gray-500">{b.code}</td>
                      <td className="px-5 py-3 font-mono text-gray-600">{b.taxNumber}</td>
                      <td className="px-5 py-3 font-bold text-[#000000]">{b.invoicedThisMonth}</td>
                      <td className="px-5 py-3 text-emerald-700 font-semibold">{b.accuracy}</td>
                      <td className="px-5 py-3">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          to="/billers"
                          className="text-[#315EFB] hover:text-[#2448D8] font-semibold text-xs hover:underline"
                        >
                          Statements
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer of the Operational Hub */}
          <div className="px-4 sm:px-6 py-3 bg-slate-50 border-t border-[#E8EAF0] flex items-center justify-between text-xs text-[#526078]">
            <span>Showing verified live entries from 5 enterprise subsystems</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Auto-refresh enabled</span>
            </div>
          </div>
        </div>

        {/* 6. Quick Action Navigation Cards (Fast Route to Any Page) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          <Link
            to="/customers"
            className="p-3 bg-white border border-[#E8EAF0] hover:border-[#315EFB] rounded-lg flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#F5F7FF] text-[#315EFB] flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#000000] block group-hover:text-[#315EFB] transition-colors">
                  Customers
                </span>
                <span className="text-[10px] text-[#526078]">Add & verify client CRM</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#526078] group-hover:text-[#315EFB] group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/stores"
            className="p-3 bg-white border border-[#E8EAF0] hover:border-[#315EFB] rounded-lg flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#F5F7FF] text-[#315EFB] flex items-center justify-center">
                <StoreIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#000000] block group-hover:text-[#315EFB] transition-colors">
                  Store Outlets
                </span>
                <span className="text-[10px] text-[#526078]">Retail & Freshmart tags</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#526078] group-hover:text-[#315EFB] group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/warehouses"
            className="p-3 bg-white border border-[#E8EAF0] hover:border-[#315EFB] rounded-lg flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#F5F7FF] text-[#315EFB] flex items-center justify-center">
                <WarehouseIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#000000] block group-hover:text-[#315EFB] transition-colors">
                  Warehouses
                </span>
                <span className="text-[10px] text-[#526078]">Logistics & sq ft space</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#526078] group-hover:text-[#315EFB] group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/suppliers"
            className="p-3 bg-white border border-[#E8EAF0] hover:border-[#315EFB] rounded-lg flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#F5F7FF] text-[#315EFB] flex items-center justify-center">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#000000] block group-hover:text-[#315EFB] transition-colors">
                  Suppliers
                </span>
                <span className="text-[10px] text-[#526078]">Global vendor network</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#526078] group-hover:text-[#315EFB] group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/billers"
            className="p-3 bg-white border border-[#E8EAF0] hover:border-[#315EFB] rounded-lg flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#F5F7FF] text-[#315EFB] flex items-center justify-center">
                <Receipt className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#000000] block group-hover:text-[#315EFB] transition-colors">
                  Billers
                </span>
                <span className="text-[10px] text-[#526078]">Tax IDs & invoices</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#526078] group-hover:text-[#315EFB] group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

      </div>

      {/* 7. Quick Create Modal Dialog */}
      {isQuickActionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-[#E8EAF0] animate-fade-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E8EAF0] flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-semibold text-sm text-[#000000]">Quick Create Operation</h3>
                <p className="text-[11px] text-[#526078]">Instantly add an item into any management subsystem</p>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickActionModalOpen(false)}
                className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleQuickActionSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Target Entity Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['customer', 'store', 'supplier', 'biller', 'warehouse'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setQuickActionType(type)}
                      className={`py-2 px-2.5 text-xs font-semibold rounded-md border text-center capitalize transition-all ${
                        quickActionType === type
                          ? 'border-[#315EFB] bg-[#F5F7FF] text-[#315EFB] shadow-2xs'
                          : 'border-[#E8EAF0] text-[#526078] hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {quickActionType === 'customer'
                    ? 'Customer Full Name *'
                    : quickActionType === 'store'
                    ? 'Store Branch Name *'
                    : quickActionType === 'supplier'
                    ? 'Supplier Company Name *'
                    : quickActionType === 'biller'
                    ? 'Biller Company Name *'
                    : 'Warehouse Facility Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. New ${quickActionType.charAt(0).toUpperCase() + quickActionType.slice(1)}...`}
                  value={quickFormName}
                  onChange={(e) => setQuickFormName(e.target.value)}
                  className="w-full border border-[#E8EAF0] rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#315EFB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {quickActionType === 'customer'
                    ? 'Email Address'
                    : quickActionType === 'store'
                    ? 'Location City (e.g. Boston, MA)'
                    : quickActionType === 'supplier'
                    ? 'Contact Person & Country'
                    : quickActionType === 'biller'
                    ? 'Tax Registration Number'
                    : 'Storage Capacity (sq ft)'}
                </label>
                <input
                  type="text"
                  placeholder="Optional details / metadata..."
                  value={quickFormMeta}
                  onChange={(e) => setQuickFormMeta(e.target.value)}
                  className="w-full border border-[#E8EAF0] rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#315EFB]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E8EAF0]">
                <button
                  type="button"
                  onClick={() => setIsQuickActionModalOpen(false)}
                  className="px-4 py-2 bg-[#1D273B] hover:bg-[#111827] text-white rounded-md text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#315EFB] hover:bg-[#2448D8] text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Create {quickActionType.charAt(0).toUpperCase() + quickActionType.slice(1)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
