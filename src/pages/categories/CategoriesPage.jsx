import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoriesPage = () => {
	const [allowedNames, setAllowedNames] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');
	const [categories, setCategories] = useState([]);

	// Fetch allowed category names for dropdown
	useEffect(() => {
		axios.get('/api/categories/names')
			.then(res => setAllowedNames(res.data))
			.catch(() => setAllowedNames([]));
	}, []);

	// Fetch all categories
	useEffect(() => {
		axios.get('/api/categories')
			.then(res => setCategories(res.data))
			.catch(() => setCategories([]));
	}, []);

	// Filter categories by selected name
	const filteredCategories = selectedCategory
		? categories.filter(cat => cat.name === selectedCategory)
		: categories;

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
			<ul className="category-list">
				{filteredCategories.map(cat => (
					<li key={cat._id || cat.name}>{cat.name}</li>
				))}
			</ul>
		</div>
	);
};

export default CategoriesPage;
