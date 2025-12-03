// components/dashboard/Chart.jsx
import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { getSalesData } from '../../utils/api';

const Chart = ({ filters = {} }) => {
  const [chartData, setChartData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [averageSale, setAverageSale] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date for X-axis
  const formatXAxis = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm p-4 rounded-lg border border-cyan-500/30 shadow-2xl">
          <p className="text-cyan-300 font-bold">{formatXAxis(label)}</p>
          <p className="text-cyan-400 text-lg font-bold mt-1">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {payload[0].payload.count || 1} sales
          </p>
        </div>
      );
    }
    return null;
  };

  // Load chart data
  useEffect(() => {
    const loadChartData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Load all sales data for the chart (no pagination limit for chart)
        let allSales = [];
        let pageToken = null;
        let hasMore = true;
        
        // Collect data from multiple pages for better chart representation
        while (hasMore && allSales.length < 500) { // Max 500 records for chart
          const data = await getSalesData(pageToken, { ...filters, limit: 100 });
          
          if (data.sales && data.sales.length > 0) {
            allSales = [...allSales, ...data.sales];
            pageToken = data.afterToken;
            hasMore = !!data.afterToken;
          } else {
            hasMore = false;
          }
        }

        console.log('Chart data loaded:', allSales.length, 'sales');

        if (allSales.length === 0) {
          setChartData([]);
          setTotalSales(0);
          setAverageSale(0);
          setLoading(false);
          return;
        }

        // Group sales by date
        const salesByDate = {};
        allSales.forEach(sale => {
          const date = new Date(sale.date).toISOString().split('T')[0]; // YYYY-MM-DD
          if (!salesByDate[date]) {
            salesByDate[date] = {
              total: 0,
              count: 0,
              date: date
            };
          }
          salesByDate[date].total += parseFloat(sale.price) || 0;
          salesByDate[date].count += 1;
        });

        // Convert to array and sort by date
        const chartDataArray = Object.values(salesByDate)
          .map(item => ({
            ...item,
            date: item.date,
            total: parseFloat(item.total.toFixed(2))
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Calculate statistics
        const total = chartDataArray.reduce((sum, item) => sum + item.total, 0);
        const avg = total / allSales.length;

        setChartData(chartDataArray);
        setTotalSales(total);
        setAverageSale(avg);

      } catch (err) {
        console.error('Error loading chart data:', err);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [filters]);

  // Loading state
  if (loading) {
    return (
      <div className="glass-card rounded-2xl border border-cyan-500/20 bg-black/40 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Sales Trend
            </h2>
            <p className="text-sm text-cyan-300/70">Loading chart data...</p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-48 w-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="glass-card rounded-2xl border border-cyan-500/20 bg-black/40 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Sales Trend
            </h2>
            <p className="text-sm text-cyan-300/70">Chart could not be loaded</p>
          </div>
        </div>
        <div className="h-64 flex flex-col items-center justify-center">
          <div className="text-cyan-400 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.406 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-cyan-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (chartData.length === 0) {
    return (
      <div className="glass-card rounded-2xl border border-cyan-500/20 bg-black/40 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Sales Trend
            </h2>
            <p className="text-sm text-cyan-300/70">No data available for selected period</p>
          </div>
        </div>
        <div className="h-64 flex flex-col items-center justify-center">
          <div className="text-cyan-400 mb-4">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-cyan-300 text-lg font-bold">No Sales Data</p>
          <p className="text-cyan-300/70 text-sm mt-2">
            Try selecting a different date range or adjusting filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl border border-cyan-500/20 bg-black/40 backdrop-blur-xl p-6">
      {/* Header with stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-cyan-300 flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            Sales Trend Over Time
          </h2>
          <p className="text-cyan-300/70">
            Daily total sales amount for selected period
          </p>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-black/40 rounded-xl p-4 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">Period</span>
            </div>
            <p className="text-xl font-bold text-cyan-100">
              {chartData.length} days
            </p>
          </div>
          
          <div className="bg-black/40 rounded-xl p-4 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-sm text-cyan-300">Total Sales</span>
            </div>
            <p className="text-xl font-bold text-green-400">
              {formatCurrency(totalSales)}
            </p>
          </div>
          
          <div className="bg-black/40 rounded-xl p-4 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-cyan-300">Avg. Sale</span>
            </div>
            <p className="text-xl font-bold text-blue-400">
              {formatCurrency(averageSale)}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#0d9488" 
              opacity={0.2}
              vertical={false}
            />
            
            <XAxis
              dataKey="date"
              stroke="#67e8f9"
              fontSize={12}
              tickFormatter={formatXAxis}
              axisLine={{ stroke: '#06b6d4', opacity: 0.5 }}
              tickLine={false}
            />
            
            <YAxis
              stroke="#67e8f9"
              fontSize={12}
              tickFormatter={(value) => formatCurrency(value)}
              axisLine={{ stroke: '#06b6d4', opacity: 0.5 }}
              tickLine={false}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={10}
              formatter={(value) => (
                <span className="text-cyan-300 text-sm">{value}</span>
              )}
            />
            
            <Area
              type="monotone"
              dataKey="total"
              name="Daily Sales"
              stroke="#06b6d4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSales)"
              activeDot={{ 
                r: 6, 
                stroke: '#ffffff', 
                strokeWidth: 2,
                fill: '#06b6d4'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart footer with insights */}
      <div className="mt-6 pt-6 border-t border-cyan-500/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-cyan-300/70">Peak Day</p>
            <p className="text-lg font-bold text-cyan-100">
              {chartData.length > 0 
                ? formatXAxis(chartData.reduce((max, day) => day.total > max.total ? day : max, chartData[0]).date)
                : 'N/A'}
            </p>
            <p className="text-sm text-green-400">
              {chartData.length > 0 
                ? formatCurrency(chartData.reduce((max, day) => day.total > max.total ? day : max, chartData[0]).total)
                : ''}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-cyan-300/70">Current Trend</p>
            <p className="text-lg font-bold text-cyan-100">
              {chartData.length >= 2 
                ? chartData[chartData.length - 1].total > chartData[chartData.length - 2].total 
                  ? '↗ Rising' 
                  : '↘ Falling'
                : 'Stable'}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-cyan-300/70">Total Transactions</p>
            <p className="text-lg font-bold text-cyan-100">
              {chartData.reduce((sum, day) => sum + (day.count || 1), 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;