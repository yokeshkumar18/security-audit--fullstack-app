import { Search } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange }) => {
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="filter-bar">
      <div className="search-input-wrapper">
        <Search className="search-icon" />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search actor or resource..." 
          name="search"
          value={filters.search}
          onChange={handleInputChange}
        />
      </div>

      <select 
        className="filter-select"
        name="severity"
        value={filters.severity}
        onChange={handleInputChange}
      >
        <option value="All">All Severities</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>

      <select 
        className="filter-select"
        name="role"
        value={filters.role}
        onChange={handleInputChange}
      >
        <option value="All">All Roles</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="system">System</option>
      </select>
    </div>
  );
};

export default FilterBar;
