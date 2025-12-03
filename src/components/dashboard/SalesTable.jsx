import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getSalesData } from '../../utils/api';


const SalesTable = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getSalesData();
        console.log("API Response:", data);
        setSales(data);
      } catch (err) {
        alert("Data load হয়নি। Internet চেক করো।");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatPrice = (price) => `$${Number(price).toFixed(2)}`;
  const formatDate = (date) => new Date(date).toLocaleString();

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-16 text-center">
        <Loader2 className="w-12 h-12 mx-auto text-cyan-400 animate-spin" />
        <p className="mt-4 text-cyan-300">Loading your sales...</p>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-16 text-center">
        <p className="text-2xl text-cyan-300">No sales found in last 7 days</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl border border-cyan-500/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-cyan-500/10">
      <div className="p-6 border-b border-cyan-500/20">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Recent Sales ({sales.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cyan-500/20">
              <th className="text-left p-4 text-cyan-300 text-sm font-medium">Date & Time</th>
              <th className="text-left p-4 text-cyan-300 text-sm font-medium">Amount</th>
              <th className="text-left p-4 text-cyan-300 text-sm font-medium">Email</th>
              <th className="text-left p-4 text-cyan-300 text-sm font-medium">Phone</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id} className="border-b border-cyan-500/10 hover:bg-white/5 transition">
                <td className="p-4 text-cyan-100">{formatDate(sale.date)}</td>
                <td className="p-4 text-2xl font-bold text-cyan-400">{formatPrice(sale.price)}</td>
                <td className="p-4 text-gray-300">{sale.customerEmail}</td>
                <td className="p-4 text-gray-300">{sale.customerPhone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;