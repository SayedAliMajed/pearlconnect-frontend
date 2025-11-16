import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useCategories } from '../../hooks/useCategories';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';

// Category icons mapping
const categoryIcons = {
	'Home Repair': '🔧',
	'Plumbing': '🚰',
	'Electrician': '⚡',
	'Cleaning': '🧹',
	'Tutoring': '📚',
	'Landscaping': '🌳',
	'Painting': '🎨',
	'Catering': '🍽️',
	'Automotive': '🚗',
	'Beauty': '✨',
	'Pet Care': '🐾',
	'Legal': '⚖️',
	'Photography': '📷',
	'Tech Support': '💻',
	'Fitness': '💪',
	'default': '📋'
};

const CategoriesPage = () => {
	const navigate = useNavigate();
	const { categories: allCategories, loading, error } = useCategories();
	const [selectedCategory, setSelectedCategory] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [sortType, setSortType] = useState('name'); // name, services-asc, services-desc
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

	// Filter and search categories
	let filteredCategories = allCategories;

	// Filter by search query
	if (searchQuery.trim()) {
		filteredCategories = filteredCategories.filter(cat =>
			cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}

	// Filter by selected category name (for URL compatibility)
	if (selectedCategory) {
		filteredCategories = filteredCategories.filter(cat =>
			cat.name === selectedCategory
		);
	}

	// Sort categories
	if (sortType === 'name') {
		filteredCategories = [...filteredCategories].sort((a, b) =>
			a.name.localeCompare(b.name)
		);
	} else if (sortType === 'services-asc') {
		filteredCategories = [...filteredCategories].sort((a, b) =>
			(a.serviceCount || 0) - (b.serviceCount || 0)
		);
	} else if (sortType === 'services-desc') {
		filteredCategories = [...filteredCategories].sort((a, b) =>
			(b.serviceCount || 0) - (a.serviceCount || 0)
		);
	}

	const handleCategoryClick = (categoryName) => {
		// Navigate to services page filtered by category
		const encodedCategory = encodeURIComponent(categoryName);
		navigate(`/services?category=${encodedCategory}`);
	};

	if (loading) {
		return (
			<Container size="xlarge">
				<div className="loading-state">
					<p>Loading categories...</p>
				</div>
			</Container>
		);
	}

	if (error) {
		return (
			<Container size="xlarge">
				<div className="error-state">
					<p>Error loading categories: {error}</p>
				</div>
			</Container>
		);
	}

	return (
		<Container size="xlarge">
			<div className="categories-page">
				<div className="page-header">
					<h1 className="categories-page-title">Categories</h1>
					<p className="categories-page-subtitle">Select a category to explore available services</p>
				</div>

				<div className="categories-filters">
					{/* Category Selection */}
					<div className="filter-group">
						<label htmlFor="category-select">Select Category:</label>
						<select
							id="category-select"
							value={selectedCategory}
							onChange={(e) => {
								const category = e.target.value;
								setSelectedCategory(category);
								if (category) {
									handleCategoryClick(category);
								}
							}}
							className="filter-select"
						>
							<option value="">Choose a category...</option>
							{categoryNames.map(name => (
								<option key={name} value={name}>{name}</option>
							))}
						</select>
					</div>

					{/* Sort Options - Just for display, no navigation on change */}
					<div className="filter-group">
						<label htmlFor="sort-select">Sort By:</label>
						<select
							id="sort-select"
							value={sortType}
							onChange={(e) => setSortType(e.target.value)}
							className="filter-select"
						>
							<option value="name">Name (A-Z)</option>
							<option value="services-desc">Most Services</option>
							<option value="services-asc">Fewest Services</option>
						</select>
					</div>
				</div>

				<div className="categories-info">
					<p>You will be redirected to the services page with your selected category.</p>
				</div>
			</div>
		</Container>
	);
};

export default CategoriesPage;
