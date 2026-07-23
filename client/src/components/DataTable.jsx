import { ChevronUp, ChevronDown } from 'lucide-react';

const DataTable = ({ logs, sort, onSortChange, loading }) => {
  if (loading) {
    return <div className="loading-spinner">Loading logs...</div>;
  }

  if (logs.length === 0) {
    return <div className="loading-spinner">No logs found. Adjust filters or upload data.</div>;
  }

  const renderSortIcon = (field) => {
    if (sort.field !== field) return null;
    return sort.order === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <table className="logs-table">
      <thead>
        <tr>
          <th onClick={() => onSortChange('actor')}>
            <div>Actor {renderSortIcon('actor')}</div>
          </th>
          <th onClick={() => onSortChange('action')}>
            <div>Action {renderSortIcon('action')}</div>
          </th>
          <th onClick={() => onSortChange('resource')}>
            <div>Resource {renderSortIcon('resource')}</div>
          </th>
          <th onClick={() => onSortChange('role')}>
            <div>Role {renderSortIcon('role')}</div>
          </th>
          <th onClick={() => onSortChange('severity')}>
            <div>Severity {renderSortIcon('severity')}</div>
          </th>
          <th onClick={() => onSortChange('timestamp')}>
            <div>Timestamp {renderSortIcon('timestamp')}</div>
          </th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log._id}>
            <td>{log.actor}</td>
            <td>{log.action}</td>
            <td>{log.resource}</td>
            <td>{log.role}</td>
            <td>
              <span className={`badge severity-${log.severity?.toLowerCase()}`}>
                {log.severity}
              </span>
            </td>
            <td>{new Date(log.timestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
