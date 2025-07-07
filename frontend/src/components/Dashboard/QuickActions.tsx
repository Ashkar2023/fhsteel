// Quick Action Buttons Component
import React from "react";
const QuickActions: React.FC = () => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full sm:w-auto">
          New Sale
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full sm:w-auto">
          Add Product
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
