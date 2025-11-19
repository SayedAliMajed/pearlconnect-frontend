import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useServices } from '../../hooks/useServices';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';

const CategoriesPage = () => {
	const navigate = useNavigate();
	const { categories: allCategories, loading: categoriesLoading, error: categoriesError } = useCategories();
	const { services } = useServices();
	const [searchParams, setSearchParams] = useSearchParams();

	// Handle URL parameters for category filter (redirect to services if category specified)
	useEffect(() => {
		const categoryParam = searchParams.get('category');
		if (categoryParam) {
			// Redirect to services page filtered by this category
			navigate(`/services?category=${encodeURIComponent(categoryParam)}`);
		}
	}, [searchParams, navigate]);

	// Calculate service counts per category
	const categoryStats = allCategories.map(category => {
		const servicesInCategory = services.filter(service => service.category?.name === category.name);
		return {
			...category,
			serviceCount: servicesInCategory.length,
			avgPrice: servicesInCategory.length > 0 ?
				servicesInCategory.reduce((sum, service) => sum + service.price, 0) / servicesInCategory.length :
				0
		};
	});

	const handleCategoryClick = (categoryName) => {
		// Navigate to services page filtered by category
		navigate(`/services?category=${encodeURIComponent(categoryName)}`);
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<Container>
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">Browse by Category</h1>
					<p className="text-xl text-gray-600">Find services from all providers in your preferred category</p>
				</div>

				{categoriesLoading ? (
					<div className="flex justify-center items-center h-64">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
							<p className="text-gray-600">Loading categories...</p>
						</div>
					</div>
				) : categoriesError ? (
					<div className="text-center py-12">
						<p className="text-red-600 text-lg">Error loading categories: {categoriesError}</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{categoryStats.map(category => (
							<Card
								key={category._id}
								className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
								onClick={() => handleCategoryClick(category.name)}
							>
								<div className="p-6">
									<div className="flex items-center justify-between mb-4">
										<h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
										<span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
											{category.serviceCount} services
										</span>
									</div>

									<p className="text-gray-600 text-sm mb-4">
										Browse {category.serviceCount} available {category.name.toLowerCase()} services from different providers
									</p>

									{category.avgPrice > 0 && (
										<div className="text-sm text-gray-500">
											Average price: <span className="font-medium text-gray-900">BD {category.avgPrice.toFixed(2)}</span>
										</div>
									)}
								</div>
							</Card>
						))}
					</div>
				)}

				{!categoriesLoading && categoryStats.length === 0 && (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">No categories available</p>
					</div>
				)}
			</Container>
		</div>
	);
};

export default CategoriesPage;
