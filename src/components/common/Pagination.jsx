import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  onPageChange, 
  beforeToken, 
  afterToken, 
  currentPage,
  isLoading 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-t border-cyan-500/20 bg-black/20">
      <div className="text-sm text-cyan-300">
        <span className="font-medium">Page {currentPage}</span>
        <span className="mx-2">•</span>
        <span>Use tokens for navigation</span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(beforeToken, 'before')}
          disabled={!beforeToken || isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            beforeToken && !isLoading
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 cursor-pointer'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        
        <div className="h-8 w-px bg-cyan-500/30"></div>
        
        <button
          onClick={() => onPageChange(afterToken, 'after')}
          disabled={!afterToken || isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            afterToken && !isLoading
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 cursor-pointer'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;