import React from 'react';

const SearchBar = ({ value, onChange, onClear, placeholder = 'Search...' }) => (
  <>
    <div className="search-bar" style={{ maxWidth: '100%', marginBottom: '20px' }}>
      <span className="search-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>

    {value && (
      <div className="search-feedback">
        <span>Showing results for: &quot;{value}&quot;</span>
        <button className="clear-search" onClick={onClear}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Clear
        </button>
      </div>
    )}
  </>
);

export default SearchBar;