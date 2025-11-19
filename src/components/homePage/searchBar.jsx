import React, { useState } from 'react';
import * as servicesApi from '../services/services';

const SearchBar = ({ onResults, onLoading, initialQuery = '' }) => {
	const [query, setQuery] = useState(initialQuery);
	const [error, setError] = useState(null);

	function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		if (onLoading) onLoading(true);

		// Use proper services API with auth header
		servicesApi.searchServices(query.trim())
			.then(data => {
				// backend returns { services, pagination }
				const results = Array.isArray(data?.services) ? data.services : [];
				if (onResults) onResults(results);
			})
			.catch(() => setError('Failed to search'))
			.finally(() => { if (onLoading) onLoading(false); });
	}

	return (
		<form onSubmit={handleSubmit} className="search-bar" role="search">
			<input
				type="text"
				placeholder="Search services by title..."
				value={query}
				onChange={e => setQuery(e.target.value)}
				aria-label="Search services"
			/>
			<button type="submit">Search</button>
			{error && <span className="search-error">{error}</span>}
		</form>
	);
};

export default SearchBar;
