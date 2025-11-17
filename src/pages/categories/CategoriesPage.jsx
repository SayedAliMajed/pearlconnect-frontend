import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useCategories } from '../../hooks/useCategories';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import { fetchServices } from '../../services/bookings';
import { formatPrice } from '../../utils/dateUtils';
import './CategoriesPage.css';

const CategoriesPage = () => {
	const navigate = useNavigate();
	const { categories: allCategories } = useCategories();
	const [selectedCategory, setSelectedCategory] = useState('');
	const [services, setServices] = useState([]);
	const [filteredServices, setFilteredServices] = useState([]);
	const [sortType, setSortType] = useState('price-asc'); // price-asc, price-desc, rating-asc, rating-desc
	const [servicesLoading, setServicesLoading] = useState(true);
	const [servicesError, setServicesError] = useState('');
	const [searchParams] = useSearchParams();

	// Handle URL parameters for category filter
	useEffect(() => {
		const categoryParam = searchParams.get('category');
		if (categoryParam) {
			setSelectedCategory(categoryParam);
		}
	}, [searchParams]);

	// Get unique category names for dropdown
	const categoryNames = [...new Set(allCategories.map(cat => cat.name))];

	// Load services on mount
	useEffect(() => {
		const loadServices = async () => {
			try {
				setServicesLoading(true);
				const apiResponse = await fetchServices();
				const apiServices = apiResponse?.services || (Array.isArray(apiResponse) ? apiResponse : []);
				setServices(apiServices);
			} catch (error) {
				console.error('Error loading services:', error);
				setServicesError(error.message || 'Failed to load services');
			} finally {
				setServicesLoading(false);
			}
		};

		loadServices();
	}, []);

	// Filter and sort services whenever dependencies change
	useEffect(() => {
		let filtered = services;

		// Filter by category
		if (selectedCategory) {
			filtered = filtered.filter(service =>
				service.category?.toLowerCase() === selectedCategory.toLowerCase()
			);
		}

		// Sort services
		if (sortType === 'price-asc') {
			filtered = [...filtered].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
		} else if (sortType === 'price-desc') {
			filtered = [...filtered].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
		} else if (sortType === 'rating-asc') {
			filtered = [...filtered].sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
		} else if (sortType === 'rating-desc') {
			filtered = [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
		}

		setFilteredServices(filtered);
	}, [services, selectedCategory, sortType]);

	const handleServiceClick = (service) => {
		const serviceId = service._id || service.id;
		if (serviceId) {
			navigate(`/services/${serviceId}`);
		}
	};

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
							<option value="price-asc">Price (Low to High)</option>
							<option value="price-desc">Price (High to Low)</option>
							<option value="rating-asc">Rating (Low to High)</option>
							<option value="rating-desc">Rating (High to Low)</option>
						</select>
					</div>
				</div>

				{/* Services Display Section */}
				<section className="categories-services-section">
					{servicesLoading ? (
						<div className="loading-state">
							<p>Loading services...</p>
						</div>
					) : servicesError ? (
						<div className="error-state">
							<p>Error: {servicesError}</p>
						</div>
					) : (
						<>
							{filteredServices.length > 0 ? (
								<>
									<div className="services-count">
										<p>{filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found {selectedCategory && `in ${selectedCategory}`}</p>
									</div>
									<div className="services-grid">
										{filteredServices.map(service => (
											<Card
												key={service._id || service.id}
												variant="service"
												layout="wireframe"
												className="service-card"
												onClick={() => handleServiceClick(service)}
											>
												<img
													src={
														// For API services (have _id): check service.images array
														service._id
															? (service.images?.[0]?.url || service.images?.[0] || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=297&h=167&fit=crop')
															// For test services (have id): use service.image
															: (service.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=297&h=167&fit=crop')
													}
													alt={service.title}
													className="ui-card__image"
												/>
												<div className="ui-card__content">
													<h3 className="ui-card__title">{service.title}</h3>
													<p className="ui-card__subtitle">{service.subtitle}</p>
													<div className="service-meta">
														<span className="service-category">{service.category}</span>
														<div className="service-rating">
															⭐ {service.rating || 'N/A'} ({service.reviews || 0} reviews)
														</div>
													</div>
													<div className="ui-card__price">
														{formatPrice(service.price, service.currency)}
													</div>
													<button className="ui-card__button">View Details</button>
												</div>
											</Card>
										))}
									</div>
								</>
							) : (
								<div className="no-services">
									<h3>{selectedCategory ? `No services found in ${selectedCategory}` : 'No services found'}</h3>
									<p>Try selecting a different category or adjusting your filters.</p>
								</div>
							)}
						</>
					)}
				</section>
			</div>
		</Container>
	);
};

export default CategoriesPage;
