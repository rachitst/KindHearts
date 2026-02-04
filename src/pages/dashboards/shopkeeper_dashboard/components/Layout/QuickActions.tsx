import React from 'react';
import { Plus, FileText, Download, Upload } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105">
        <Plus size={20} />
        <span>New Order</span>
      </button>
      <button className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105">
        <FileText size={20} />
        <span>Generate Report</span>
      </button>
      <button className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105">
        <Download size={20} />
        <span>Export Data</span>
      </button>
      <button className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105">
        <Upload size={20} />
        <span>Import Data</span>
      </button>
    </div>
  );
};

export default QuickActions; 