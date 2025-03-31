import React, { useState, useEffect } from "react";
import { usePostStore } from "../store/usePostStore"; // Import the store
import { toast } from "react-hot-toast";

const FilterPage = () => {
  const { applyFilters } = usePostStore(); // Get applyFilters from the store
  const [filters, setFilters] = useState({
    website: "",
    minAmount: "",
    maxAmount: "",
    distance: "",
  });

  // Apply filters whenever filters state changes (real-time filtering)
  useEffect(() => {
    applyFilters(filters); // Call applyFilters whenever filters change
  }, [filters, applyFilters]);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Explicitly apply filters when the button is clicked
  const handleApplyFilters = () => {
    applyFilters(filters); // Call applyFilters from the store
    toast.success("Filters applied!"); // Optional: Show a success message
  };

  return (
    <div className="w-80 fixed top-20 right-0 h-screen overflow-y-auto bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-xl font-bold text-purple-600 mb-4">Filters</h2>

      {/* Website Name Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website Name
        </label>
        <input
          type="text"
          name="website"
          placeholder="Enter website name"
          value={filters.website}
          onChange={handleFilterChange} // Trigger on change
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Amount Range Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount Range
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            name="minAmount"
            placeholder="Min"
            value={filters.minAmount}
            onChange={handleFilterChange} // Trigger on change
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            name="maxAmount"
            placeholder="Max"
            value={filters.maxAmount}
            onChange={handleFilterChange} // Trigger on change
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Distance Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Distance (km)
        </label>
        <input
          type="number"
          name="distance"
          placeholder="Enter max distance"
          value={filters.distance}
          onChange={handleFilterChange} // Trigger on change
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={handleApplyFilters}
        className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterPage;