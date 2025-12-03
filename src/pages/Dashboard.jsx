// Dashboard.jsx - Updated with Chart
import React, { useState } from "react";
import Header from "../components/dashboard/Header";
import SalesTable from "../components/dashboard/SalesTable";
import FilterPanel from "../components/dashboard/FilterPanel";
import SalesChart from "../components/dashboard/Chart";

const Dashboard = () => {
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState('chart');

  const handleFilterChange = (newFilters) => {
    console.log('Dashboard: Filters changed', newFilters);
    setFilters(newFilters);
  };

  return (
    <div className=" text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <FilterPanel onFilterChange={handleFilterChange} />
        
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex border-b border-cyan-500/20">
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-6 py-3 font-medium text-sm transition-all ${
                activeTab === 'chart'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-cyan-300/70 hover:text-cyan-300'
              }`}
            >
              Sales Chart
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-6 py-3 font-medium text-sm transition-all ${
                activeTab === 'table'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-cyan-300/70 hover:text-cyan-300'
              }`}
            >
              Sales Table
            </button>
          </div>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === 'chart' ? (
          <SalesChart filters={filters} />
        ) : (
          <SalesTable filters={filters} />
        )}
        
       
      </div>
    </div>
  );
};

export default Dashboard;