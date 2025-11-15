import React, { useState } from 'react';

// Simple search bar component for searching services by title.
// Props:
// onResults(resultsArray) - called with array of services returned from API
// onLoading(isLoading) - optional callback to indicate loading state
// initialQuery - optional initial value
const SearchBar = ({ onResults, onLoading, initialQuery = '' }) => {
	const [query, setQuery] = useState(initialQuery);
	const [error, setError] = useState(null);

	function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		if (onLoading) onLoading(true);

		// basic fetch to backend services endpoint with search param
		const url = query.trim() ? `/api/services?search=${encodeURIComponent(query.trim())}` : '/api/services';
		fetch(url)
			.then(res => res.json())
			.then(data => {
				// backend returns { services, pagination } per controller code
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
