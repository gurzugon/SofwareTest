import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAnalyzeRoadsMutation, useGetHealthQuery } from './store/apiSlice';
import FilterPanel from './components/FilterPanel';
import RoadMap from './components/RoadMap';
import { AnalysisRequest, AnalysisResponse, Road } from './types';
import './App.css';

const AppContent: React.FC = () => {
  const [analyzeRoads, { data: results, isLoading, error }] = useAnalyzeRoadsMutation();
  const { data: healthData } = useGetHealthQuery();
  const [filteredRoads, setFilteredRoads] = useState<Road[]>([]);
  const [filters, setFilters] = useState<AnalysisRequest>({});
  const [hasFilters, setHasFilters] = useState(false);


  const handleAnalyze = async (request: AnalysisRequest) => {
    try {
      setFilters(request);
      setHasFilters(true);
      await analyzeRoads(request).unwrap();
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const handleFilterChange = (newFilters: AnalysisRequest) => {
    setFilters(newFilters);
    
    // Check if any filters are applied
    const hasActiveFilters = Object.values(newFilters).some(value => 
      value !== '' && value !== undefined && value !== null
    );
    setHasFilters(hasActiveFilters);
    
    // Update filtered roads based on results
    if (results && results.roads) {
      setFilteredRoads(results.roads);
    }
  };

  return (
    <div className="dashboard-app">
      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        {/* Left Filter Panel */}
        <div className="dashboard-sidebar">
          <FilterPanel 
            onAnalyze={handleAnalyze} 
            onFilterChange={handleFilterChange}
            isLoading={isLoading} 
            filters={filters}
          />
        </div>

        {/* Right Map Area */}
        <div className="dashboard-main">
          <RoadMap 
            allRoads={filteredRoads}
            results={hasFilters && results ? results : null} 
            isLoading={isLoading}
            showAllRoads={!hasFilters}
          />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
