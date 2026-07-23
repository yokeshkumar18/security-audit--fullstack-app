import { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Search, ChevronDown, Activity, User, MapPin } from 'lucide-react';
import DataTable from './components/DataTable';
import Pagination from './components/Pagination';
import FilterBar from './components/FilterBar';
import UploadWidget from './components/UploadWidget';
import { Toaster } from 'react-hot-toast';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/logs` : 'http://localhost:5000/api/logs';

function App() {
  const [logs, setLogs] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    severity: 'All',
    role: 'All'
  });

  const [sort, setSort] = useState({
    field: 'timestamp',
    order: 'desc'
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: {
          page: currentPage,
          limit: 15,
          search: filters.search,
          severity: filters.severity,
          role: filters.role,
          sortBy: sort.field,
          sortOrder: sort.order
        }
      });
      setLogs(response.data.logs);
      setTotalRecords(response.data.totalRecords);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, filters, sort]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on new filter
  };

  const handleSortChange = (field) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className="dashboard-container">
      <Toaster position="top-right" />
      <header className="dashboard-header">
        <div className="header-title">
          <Activity className="header-icon" />
          <h1>Security Audit Dashboard</h1>
        </div>
        <UploadWidget onUploadSuccess={() => fetchLogs()} />
      </header>

      <main className="dashboard-content">
        <div className="controls-section">
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />
          <div className="records-count">
            Total Records: <span>{totalRecords}</span>
          </div>
        </div>

        <div className="table-container">
          <DataTable 
            logs={logs} 
            sort={sort} 
            onSortChange={handleSortChange} 
            loading={loading}
          />
        </div>

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </main>
    </div>
  );
}

export default App;
