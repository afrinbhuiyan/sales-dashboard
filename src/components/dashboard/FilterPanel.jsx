// components/dashboard/FilterPanel.jsx
import React, { useState } from 'react';
import { Filter, Calendar, DollarSign, Mail, Phone } from 'lucide-react';

const FilterPanel = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minPrice: '',
    customerEmail: '',
    phoneNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
      minPrice: '',
      customerEmail: '',
      phoneNumber: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="glass-card rounded-2xl border border-cyan-500/20 bg-black/40 backdrop-blur-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-bold text-cyan-300">Filter Sales Data</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Start Date */}
        <div>
          <label className=" text-sm text-cyan-300 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>

        {/* End Date */}
        <div>
          <label className=" text-sm text-cyan-300 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>

        {/* Min Price */}
        <div>
          <label className=" text-sm text-cyan-300 mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Min Price
          </label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Min amount"
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>

        {/* Email */}
        <div>
          <label className=" text-sm text-cyan-300 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Customer Email
          </label>
          <input
            type="email"
            name="customerEmail"
            value={filters.customerEmail}
            onChange={handleChange}
            placeholder="email@example.com"
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>

        {/* Phone */}
        <div>
          <label className=" text-sm text-cyan-300 mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={filters.phoneNumber}
            onChange={handleChange}
            placeholder="+1234567890"
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleApply}
          className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition"
        >
          Apply Filters
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;