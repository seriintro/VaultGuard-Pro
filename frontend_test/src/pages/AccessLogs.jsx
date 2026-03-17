import React from 'react';
import SidebarLayout from '../SidebarLayout';
import SearchBar from './components/shared/SearchBar';
import LogsTable from './components/AccessLogs/LogsTable';
import useAccessLogs from './hooks/useAccessLogs';

const AccessLogs = () => {
  const { logs, filteredLogs, searchTerm, setSearchTerm } = useAccessLogs();

  return (
    <SidebarLayout title="Access Logs">
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClear={() => setSearchTerm('')}
        placeholder="Search logs..."
      />

      <div className="logs-container">
        <h2>System Access Logs</h2>
        <LogsTable logs={logs} filteredLogs={filteredLogs} />
      </div>
    </SidebarLayout>
  );
};

export default AccessLogs;