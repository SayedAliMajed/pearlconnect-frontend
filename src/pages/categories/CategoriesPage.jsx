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
		<div className="categories-page">
			{/* Hero Section */}
			<section className="categories-hero">
				<Container size="xlarge" padding={false}>
					<div className="hero-content">
						<h1 className="hero-title">Browse Categories</h1>
						<p className="hero-subtitle">
							Find professionals for all your service needs across different categories
						</p>
					</div>
				</Container>
			</section>

			{/* Filters Section */}
			<section className="categories-filters">
				<Container size="xlarge">
					<div className="filters-container">
						{/* Search Filter */}
						<div className="filter-group">
							<label htmlFor="search-input">Search Categories:</label>
							<input
								id="search-input"
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search categories..."
								className="filter-input"
							/>
						</div>

						{/* Category Filter */}
						<div className="filter-group">
							<label htmlFor="category-select">Specific Category:</label>
							<select
								id="category-select"
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className="filter-select"
							>
								<option value="">All Categories</option>
								{categoryNames.map(name => (
									<option key={name} value={name}>{name}</option>
								))}
							</select>
						</div>

						{/* Sort Options */}
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
				</Container>
			</section>

			{/* Categories Grid */}
			<section className="categories-grid-section">
				<Container size="xlarge">
					{filteredCategories.length > 0 ? (
						<>
							<div className="categories-count">
								<p>{filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'} found</p>
							</div>
							<div className="categories-grid">
								{filteredCategories.map(category => (
									<Card
										key={category._id || category.name}
										variant="category"
										className="category-card"
										onClick={() => handleCategoryClick(category.name)}
									>
										<div className="category-icon">
											{categoryIcons[category.name] || categoryIcons.default}
										</div>
										<div className="category-content">
											<h3 className="category-name">{category.name}</h3>
											<p className="category-description">
												{category.description || 'Professional services available'}
											</p>
											<div className="category-meta">
												<span className="service-count">
													{category.serviceCount || 0} service{category.serviceCount !== 1 ? 's' : ''}
												</span>
											</div>
										</div>
									</Card>
								))}
							</div>
						</>
					) : (
						<div className="no-categories">
							<h3>No categories found</h3>
							<p>Try adjusting your search terms or filters.</p>
						</div>
					)}
				</Container>
			</section>
		</div>
	);
};

export default CategoriesPage;
