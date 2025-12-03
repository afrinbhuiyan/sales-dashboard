import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  ArrowUpDown, 
  Smartphone, 
  Mail, 
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getSalesData } from '../../utils/api';
import Pagination from '../common/Pagination';

const SalesTable = ({ filters = {} }) => {
  const [salesData, setSalesData] = useState({
    sales: [],
    beforeToken: null,
    afterToken: null,
    total: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });
  const [isMobileView, setIsMobileView] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadData = async (pageToken = null) => {
    setLoading(true);
    try {
      console.log('Loading data with filters:', filters, 'pageToken:', pageToken);
      const data = await getSalesData(pageToken, filters);
      console.log('Data loaded:', data);
      setSalesData(data);
    } catch (err) {
      console.error('Error loading data:', err);
      alert("Data load হয়নি। Internet চেক করো।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Filters changed or component mounted:', filters);
    setCurrentPage(1);
    loadData();
  }, [filters]);

  const handlePageChange = (pageToken, direction) => {
    if (!pageToken) return;
    
    if (direction === 'after') {
      setCurrentPage(prev => prev + 1);
    } else {
      setCurrentPage(prev => prev - 1);
    }
    
    loadData(pageToken);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleRowExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const sortedSales = [...salesData.sales].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
    }
    if (sortConfig.key === 'price') {
      const aPrice = parseFloat(a.price) || 0;
      const bPrice = parseFloat(b.price) || 0;
      return sortConfig.direction === 'asc' ? aPrice - bPrice : bPrice - aPrice;
    }
    return 0;
  });

  const formatPrice = (price) => {
    const num = Number(price);
    if (isNaN(num)) return '$0.00';
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (date) => {
    try {
      if (isMobileView) {
        return new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: '2-digit'
        });
      }
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading && salesData.sales.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 md:p-16 text-center">
        <Loader2 className="w-12 h-12 mx-auto text-cyan-400 animate-spin" />
        <p className="mt-4 text-cyan-300">Loading sales data...</p>
        <p className="text-sm text-cyan-300/70 mt-2">
          {Object.keys(filters).length > 0 ? 'Applying filters...' : 'Fetching recent sales...'}
        </p>
      </div>
    );
  }

  if (salesData.sales.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 md:p-16 text-center">
        <div className="text-cyan-400 mb-4">
          <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-lg md:text-2xl font-bold text-cyan-300 mb-2">No Sales Found</p>
        <p className="text-cyan-300/70 text-sm md:text-base px-4">
          {Object.keys(filters).length > 0 
            ? 'Try adjusting your filters or select a different date range.'
            : 'No sales data available for the selected period.'}
        </p>
        {Object.keys(filters).length > 0 && (
          <div className="mt-6 p-4 bg-cyan-900/20 rounded-lg border border-cyan-500/30 mx-4 md:mx-16">
            <p className="text-sm text-cyan-300 mb-2">Current Filters:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {filters.startDate && (
                <span className="px-2 py-1 bg-cyan-800/40 rounded-full text-xs md:text-sm text-cyan-300">
                  From: {filters.startDate}
                </span>
              )}
              {filters.endDate && (
                <span className="px-2 py-1 bg-cyan-800/40 rounded-full text-xs md:text-sm text-cyan-300">
                  To: {filters.endDate}
                </span>
              )}
              {filters.minPrice && (
                <span className="px-2 py-1 bg-cyan-800/40 rounded-full text-xs md:text-sm text-cyan-300">
                  Min: ${filters.minPrice}
                </span>
              )}
              {filters.customerEmail && (
                <span className="px-2 py-1 bg-cyan-800/40 rounded-full text-xs md:text-sm text-cyan-300 truncate max-w-[120px]">
                  Email: {filters.customerEmail.substring(0, 10)}...
                </span>
              )}
              {filters.phoneNumber && (
                <span className="px-2 py-1 bg-cyan-800/40 rounded-full text-xs md:text-sm text-cyan-300">
                  Phone: {filters.phoneNumber}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile Card View
  if (isMobileView) {
    return (
      <div className="glass-card rounded-2xl border border-cyan-500/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-cyan-500/10">
        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Sales
              </h2>
              <p className="text-xs text-cyan-300/70">
                Page {currentPage} • {salesData.sales.length} items
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-cyan-300/70">Sort by:</div>
              <div className="flex gap-2 mt-1">
                <button 
                  onClick={() => handleSort('date')}
                  className={`px-2 py-1 rounded text-xs ${sortConfig.key === 'date' ? 'bg-cyan-600 text-white' : 'bg-cyan-900/40 text-cyan-300'}`}
                >
                  Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                  onClick={() => handleSort('price')}
                  className={`px-2 py-1 rounded text-xs ${sortConfig.key === 'price' ? 'bg-cyan-600 text-white' : 'bg-cyan-900/40 text-cyan-300'}`}
                >
                  Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Card List */}
        <div className="divide-y divide-cyan-500/10">
          {sortedSales.map((sale, index) => (
            <div 
              key={sale._id || index} 
              className={`p-4 ${expandedRow === index ? 'bg-cyan-900/10' : ''}`}
              onClick={() => toggleRowExpand(index)}
            >
              {/* Main Card Content */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-100">
                      {formatDate(sale.date)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-xl font-bold text-green-400">
                      {formatPrice(sale.price)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-300 truncate">
                      {sale.customerEmail || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <button className="ml-2">
                  {expandedRow === index ? (
                    <ChevronUp className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-cyan-400" />
                  )}
                </button>
              </div>

              {/* Expanded Details */}
              {expandedRow === index && (
                <div className="mt-4 pt-4 border-t border-cyan-500/20 space-y-3 animate-slideDown">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-cyan-300/70">Phone</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Smartphone className="w-3 h-3 text-gray-400" />
                        <p className="text-sm text-gray-300">
                          {sale.customerPhone || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-cyan-300/70">Currency</p>
                      <p className="text-sm text-gray-300 mt-1">
                        {sale.currency || 'USD'}
                      </p>
                    </div>
                  </div>
                  
                  {sale.customerName && (
                    <div>
                      <p className="text-xs text-cyan-300/70">Customer Name</p>
                      <p className="text-sm text-gray-300 mt-1">{sale.customerName}</p>
                    </div>
                  )}
                  
                  {sale.customerCountry && (
                    <div>
                      <p className="text-xs text-cyan-300/70">Country</p>
                      <p className="text-sm text-gray-300 mt-1">{sale.customerCountry}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination for Mobile */}
        <div className="p-4 border-t border-cyan-500/20">
          <Pagination
            onPageChange={handlePageChange}
            beforeToken={salesData.beforeToken}
            afterToken={salesData.afterToken}
            currentPage={currentPage}
            isLoading={loading}
          />
        </div>
      </div>
    );
  }

  // Desktop Table View
  return (
    <div className="glass-card rounded-2xl border border-cyan-500/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-cyan-500/10">
      {/* Header */}
      <div className="p-6 border-b border-cyan-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Sales Data
            </h2>
            <p className="text-sm text-cyan-300/70 mt-1">
              Showing {salesData.sales.length} sales on this page • Page {currentPage}
            </p>
          </div>
          
          {/* Active filters summary */}
          {Object.keys(filters).some(key => filters[key]) && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-cyan-300">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => 
                  value && (
                    <span 
                      key={key} 
                      className="px-3 py-1 bg-cyan-900/40 rounded-full text-xs text-cyan-300 border border-cyan-500/30"
                    >
                      {key}: {value}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-cyan-500/20 bg-black/30">
              <th className="text-left p-4 text-cyan-300 text-sm font-medium whitespace-nowrap">
                <button 
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-2 hover:text-cyan-400 transition-colors focus:outline-none"
                  title="Sort by date"
                >
                  <Calendar className="w-4 h-4" />
                  Date & Time
                  <ArrowUpDown className="w-4 h-4" />
                  {sortConfig.key === 'date' && (
                    <span className="text-xs">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 text-cyan-300 text-sm font-medium whitespace-nowrap">
                <button 
                  onClick={() => handleSort('price')}
                  className="flex items-center gap-2 hover:text-cyan-400 transition-colors focus:outline-none"
                  title="Sort by amount"
                >
                  <DollarSign className="w-4 h-4" />
                  Amount
                  <ArrowUpDown className="w-4 h-4" />
                  {sortConfig.key === 'price' && (
                    <span className="text-xs">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-4 text-cyan-300 text-sm font-medium whitespace-nowrap">
                <Mail className="w-4 h-4 inline mr-2" />
                Customer Email
              </th>
              <th className="text-left p-4 text-cyan-300 text-sm font-medium whitespace-nowrap">
                <Smartphone className="w-4 h-4 inline mr-2" />
                Phone Number
              </th>
              <th className="text-left p-4 text-cyan-300 text-sm font-medium whitespace-nowrap">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSales.map((sale, index) => (
              <tr 
                key={sale._id || index} 
                className={`border-b border-cyan-500/10 hover:bg-white/5 transition-colors ${
                  index % 2 === 0 ? 'bg-black/10' : 'bg-black/5'
                }`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <div>
                      <div className="text-cyan-100 font-medium">
                        {formatDate(sale.date)}
                      </div>
                      <div className="text-xs text-cyan-300/70 mt-1">
                        {new Date(sale.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="text-xl font-bold text-cyan-400">
                        {formatPrice(sale.price)}
                      </div>
                      <div className="text-xs text-cyan-300/70 mt-1">
                        {sale.currency || 'USD'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-gray-300 truncate max-w-[200px]">
                        {sale.customerEmail || 'N/A'}
                      </div>
                      {sale.customerName && (
                        <div className="text-sm text-gray-400 mt-1 truncate max-w-[200px]">
                          {sale.customerName}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-gray-300">
                        {sale.customerPhone || 'N/A'}
                      </div>
                      {sale.customerCountry && (
                        <div className="text-xs text-gray-400 mt-1">
                          {sale.customerCountry}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleRowExpand(index)}
                    className="text-cyan-400 hover:text-cyan-300 transition"
                    title="View details"
                  >
                    {expandedRow === index ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        onPageChange={handlePageChange}
        beforeToken={salesData.beforeToken}
        afterToken={salesData.afterToken}
        currentPage={currentPage}
        isLoading={loading}
      />
    </div>
  );
};

export default SalesTable;