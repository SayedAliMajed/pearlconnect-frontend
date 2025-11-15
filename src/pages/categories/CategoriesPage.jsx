import React, { useEffect, useState } from 'react';


const CategoriesPage = () => {
	const [allowedNames, setAllowedNames] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');
	const [categories, setCategories] = useState([]);
	const [sortType, setSortType] = useState(''); // '', 'price-asc', 'price-desc', 'rating-asc', 'rating-desc'

	// Fetch allowed category names for dropdown
	useEffect(() => {
		fetch('/api/categories/names')
			.then(res => res.json())
			.then(data => setAllowedNames(data))
			.catch(() => setAllowedNames([]));
	}, []);

	// Fetch all categories
	useEffect(() => {
		fetch('/api/categories')
			.then(res => res.json())
			.then(data => setCategories(data))
			.catch(() => setCategories([]));
	}, []);

	// Filter categories by selected name
	let filteredCategories = selectedCategory
		? categories.filter(cat => cat.name === selectedCategory)
		: categories;

	// Sort filtered categories
	if (sortType === 'price-asc') {
		filteredCategories = [...filteredCategories].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
	} else if (sortType === 'price-desc') {
		filteredCategories = [...filteredCategories].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
	} else if (sortType === 'rating-asc') {
		filteredCategories = [...filteredCategories].sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
	} else if (sortType === 'rating-desc') {
		filteredCategories = [...filteredCategories].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
	}

	return (
		<div className="categories-page">
			<h2>Categories</h2>
			<div className="category-filter">
				<label htmlFor="category-select">Filter by category:</label>
				<select
					id="category-select"
					value={selectedCategory}
					onChange={e => setSelectedCategory(e.target.value)}
				>
					<option value="">All</option>
					{allowedNames.map(name => (
						<option key={name} value={name}>{name}</option>
					))}
				</select>
			</div>
			<div className="category-sort">
				<label htmlFor="sort-select">Sort by:</label>
				<select
					id="sort-select"
					value={sortType}
					onChange={e => setSortType(e.target.value)}
				>
					<option value="">None</option>
					<option value="price-asc">Price (Low to High)</option>
					<option value="price-desc">Price (High to Low)</option>
					<option value="rating-asc">Rating (Low to High)</option>
					<option value="rating-desc">Rating (High to Low)</option>
				</select>
			</div>
			<ul className="category-list">
				{filteredCategories.map(cat => (
					<li key={cat._id || cat.name}>
						{cat.name}
						{cat.price !== undefined && (
							<span> | Price: {cat.price}</span>
						)}
						{cat.rating !== undefined && (
							<span> | Rating: {cat.rating}</span>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

export default CategoriesPage;
