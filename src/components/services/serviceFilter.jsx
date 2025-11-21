import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const ServiceFilter = ({
  categories = [],
  filters = {},
  onFiltersChange = () => {},
  onClearFilters = () => {},
  showAdvancedFilters = false,
  maxPrice = 1000,
  className = ''
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(showAdvancedFilters);
  const [localFilters, setLocalFilters] = useState({
    category: filters.category || 'all',
    priceMin: filters.priceMin || '',
    priceMax: filters.priceMax || '',
    rating: filters.rating || 'all',
    sortBy: filters.sortBy || 'relevance',
    ...filters
  });

  useEffect(() => {
    setLocalFilters({
      category: filters.category || 'all',
      priceMin: filters.priceMin || '',
      priceMax: filters.priceMax || '',
      rating: filters.rating || 'all',
      sortBy: filters.sortBy || 'relevance',
      ...filters
    });
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      category: 'all',
      priceMin: '',
      priceMax: '',
      rating: 'all',
      sortBy: 'relevance'
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.category && localFilters.category !== 'all') count++;
    if (localFilters.priceMin || localFilters.priceMax) count++;
    if (localFilters.rating && localFilters.rating !== 'all') count++;
    return count;
  };

  const activeFiltersCount = getActiveFilterCount();

  return (
    <div className={`service-filter ${className}`}>
      {/* Basic Filters Row */}
      <div
        className="filter-row basic-filters"
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}
      >
        {/* Category Filter */}
        <div className="filter-group" style={{ minWidth: '200px' }}>
          <label
            htmlFor="category-filter"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.25rem'
            }}
          >
            Category
          </label>
          <select
            id="category-filter"
            value={localFilters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              fontSize: '0.875rem',
              color: '#374151'
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category._id || category.id} value={category.name || category}>
                {category.name || category}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div className="filter-group" style={{ minWidth: '180px' }}>
          <label
            htmlFor="rating-filter"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.25rem'
            }}
          >
            Minimum Rating
          </label>
          <select
            id="rating-filter"
            value={localFilters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              fontSize: '0.875rem',
              color: '#374151'
            }}
          >
            <option value="all">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="filter-group" style={{ minWidth: '160px' }}>
          <label
            htmlFor="sort-filter"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.25rem'
            }}
          >
            Sort By
          </label>
          <select
            id="sort-filter"
            value={localFilters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              fontSize: '0.875rem',
              color: '#374151'
            }}
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Most Recent</option>
          </select>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="filter-group">
          <Button
            variant="secondary"
            size="small"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            style={{
              marginTop: '1.75rem',
              whiteSpace: 'nowrap'
            }}
          >
            {isAdvancedOpen ? 'Less Filters' : 'More Filters'}
          </Button>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <div className="filter-group">
            <Button
              variant="outline"
              size="small"
              onClick={handleClearAll}
              style={{
                marginTop: '1.75rem',
                whiteSpace: 'nowrap',
                position: 'relative'
              }}
            >
              Clear ({activeFiltersCount})
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div
          className="advanced-filters"
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1.25rem',
            marginBottom: '1rem',
            backgroundColor: '#f9fafb'
          }}
        >
          <h4
            style={{
              margin: '0 0 1rem 0',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827'
            }}
          >
            Advanced Filters
          </h4>

          <div
            className="filter-row advanced-filters-row"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}
          >
            {/* Price Range */}
            <div className="filter-group price-range">
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Price Range (BD)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={localFilters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    min="0"
                    max={maxPrice}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    placeholder="Max"
                    value={localFilters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    min="0"
                    max={maxPrice}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>
              {localFilters.priceMin && localFilters.priceMax && parseFloat(localFilters.priceMin) >= parseFloat(localFilters.priceMax) && (
                <div style={{
                  color: '#dc2626',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem'
                }}>
                  Minimum price must be less than maximum price
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div
          className="active-filters-summary"
          style={{
            padding: '0.75rem',
            backgroundColor: '#eff6ff',
            border: '1px solid #dbeafe',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: '#1e40af'
          }}
        >
          <strong>Active Filters:</strong>{' '}
          {localFilters.category !== 'all' && `Category: ${localFilters.category}`}
          {(localFilters.priceMin || localFilters.priceMax) && (
            ` Price: ${localFilters.priceMin || 0} - ${localFilters.priceMax || '∞'} BD`
          )}
          {localFilters.rating !== 'all' && ` Rating: ${localFilters.rating}+ stars`}
        </div>
      )}
    </div>
  );
};

export default ServiceFilter;
