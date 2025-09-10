import React, { useState, useEffect } from 'react';
import { AnalysisRequest } from '../types';

interface FilterPanelProps {
  onAnalyze: (request: AnalysisRequest) => void;
  onFilterChange: (filters: AnalysisRequest) => void;
  isLoading: boolean;
  filters: AnalysisRequest;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  onAnalyze, 
  onFilterChange, 
  isLoading, 
  filters 
}) => {
  const [formData, setFormData] = useState<AnalysisRequest>({
    ...filters
  });

  useEffect(() => {
    setFormData(filters);
  }, [filters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(newFormData);
    onFilterChange(newFormData);
  };

  const handleClearFilters = () => {
    const clearedFilters = { city: '', roadType: '' };
    setFormData(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h2>Road Filters</h2>
        <button 
          type="button" 
          onClick={handleClearFilters}
          className="clear-filters-btn"
        >
          Clear All
        </button>
      </div>

      <form onSubmit={handleSubmit} className="filter-form">
        <div className="filter-section">
          <h3>Location</h3>
          <div className="form-group">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              placeholder="e.g., Shah Alam, Petaling Jaya"
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <h3>Road Characteristics</h3>
          <div className="form-group">
            <label htmlFor="roadType">Road Type:</label>
            <select
              id="roadType"
              name="roadType"
              value={formData.roadType || ''}
              onChange={handleChange}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="expressway">Expressway</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </select>
          </div>
        </div>


        <div className="filter-actions">
          <button 
            type="submit" 
            disabled={isLoading} 
            className="analyze-btn"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Roads'}
          </button>
        </div>
      </form>

    </div>
  );
};

export default FilterPanel;
