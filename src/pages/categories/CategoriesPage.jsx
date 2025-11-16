import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useCategories } from '../../hooks/useCategories';
import Container from '../../components/ui/Container';

const CategoriesPage = () => {
	const { categories: allCategories, loading, error } = useCategories();
	const [selectedCategory, setSelectedCategory] = useState('');
	const [sortType, setSortType] = useState(''); // '', 'price-asc', 'price-desc', 'rating-asc', 'rating-desc'
	const [searchParams, setSearchParams] = useSearchParams();

	// Handle URL parameters for category filter
	useEffect(() => {
		const categoryParam = searchParams.get('category');
		if (categoryParam) {
			setSelectedCategory(categoryParam);
		}
	}, [searchParams]);

	// Get unique category names for dropdown
	const categoryNames = [...new Set(allCategories.map(cat => cat.name))];

	// Filter categories by selected name
	let filteredCategories = selectedCategory
		? allCategories.filter(cat => cat.name === selectedCategory)
		: allCategories;

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
				{categoryNames.map(name => (
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
