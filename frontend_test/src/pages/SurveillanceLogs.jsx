import React, { useState } from 'react';
import SidebarLayout from '../SidebarLayout';
import SearchBar from './components/shared/SearchBar';
import { RecognizedTable, UnrecognizedTable } from './components/SurveillanceLogs/SurveillanceLogsTables';
import useSurveillanceLogs from './hooks/useSurveillanceLogs';
import '../Home.css';
import '../Home.css';  // keep this as-is since Home.css is in a different folder

const TABS = [
  { id: 'recognized', label: 'Recognized Faces' },
  { id: 'unrecognized', label: 'Unrecognized Faces' },
];

function SurveillanceLogs() {
  const [activeTab, setActiveTab] = useState('recognized');
  const { filteredLogs, searchTerm, setSearchTerm } = useSurveillanceLogs();

  return (
    <SidebarLayout title="Surveillance Logs">
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClear={() => setSearchTerm('')}
        placeholder="Search logs by name, date..."
      />

      <div className="tab-navigation">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`tab-button ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="logs-container">
        {activeTab === 'recognized' && (
          <>
            <h2>Recognized Faces Log</h2>
            <RecognizedTable logs={filteredLogs.recognized} />
          </>
        )}
        {activeTab === 'unrecognized' && (
          <>
            <h2>Unrecognized Faces Log</h2>
            <UnrecognizedTable logs={filteredLogs.unrecognized} />
          </>
        )}
      </div>
    </SidebarLayout>
  );
}

export default SurveillanceLogs;