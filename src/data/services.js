// Service data for popular services with BD currency pricing
export const popularServices = [
  {
    id: 1,
    title: "Professional Cleaning",
    subtitle: "Deep house cleaning with eco-friendly products",
    price: 28.500, // BD 28.500
    priceUnit: "per session",
    currency: "BD",
    category: "Cleaning",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=297&h=167&fit=crop",
    featured: true,
    duration: "3-4 hours",
    description: "Complete home cleaning service including kitchen, bathrooms, and all living areas."
  },
  {
    id: 2,
    title: "Handyman Services",
    subtitle: "General repairs and maintenance",
    price: 15.000, // BD 15.000 per hour
    priceUnit: "per hour",
    currency: "BD",
    category: "Home Repair",
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=297&h=167&fit=crop",
    featured: true,
    duration: "Variable",
    description: "Expert handyman for all your home repair and maintenance needs."
  },
  {
    id: 3,
    title: "Professional Photography",
    subtitle: "Event and portrait photography",
    price: 56.500, // BD 56.500 per event
    priceUnit: "per event",
    currency: "BD",
    category: "Event Services",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=297&h=167&fit=crop",
    featured: true,
    duration: "4-6 hours",
    description: "Professional photography services for events, portraits, and special occasions."
  },
  {
    id: 4,
    title: "Personal Fitness Trainer",
    subtitle: "One-on-one fitness coaching",
    price: 11.500, // BD 11.500 per session
    priceUnit: "per session",
    currency: "BD",
    category: "Health & Wellness",
    rating: 4.9,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=297&h=167&fit=crop",
    featured: true,
    duration: "1 hour",
    description: "Certified personal trainer for personalized fitness programs and coaching."
  },
  {
    id: 5,
    title: "Mobile Car Wash",
    subtitle: "Convenient car cleaning service",
    price: 7.500, // BD 7.500
    priceUnit: "per wash",
    currency: "BD",
    category: "Automotive",
    rating: 4.6,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=297&h=167&fit=crop",
    featured: false,
    duration: "1-2 hours",
    description: "Professional car wash service at your location. Interior and exterior cleaning."
  },
  {
    id: 6,
    title: "IT Support & Consulting",
    subtitle: "Technical support and computer services",
    price: 18.000, // BD 18.000 per hour
    priceUnit: "per hour",
    currency: "BD",
    category: "Digital Services",
    rating: 4.8,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=297&h=167&fit=crop",
    featured: true,
    duration: "Variable",
    description: "Expert IT support for businesses and individuals. Computer repair and consulting."
  },
  {
    id: 7,
    title: "Pet Grooming",
    subtitle: "Professional pet care and grooming",
    price: 12.000, // BD 12.000
    priceUnit: "per session",
    currency: "BD",
    category: "Pet Care",
    rating: 4.7,
    reviews: 92,
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=297&h=167&fit=crop",
    featured: false,
    duration: "2-3 hours",
    description: "Complete pet grooming services including bath, haircut, and nail trimming."
  },
  {
    id: 8,
    title: "Home Tutoring",
    subtitle: "Academic support and coaching",
    price: 20.000, // BD 20.000 per hour
    priceUnit: "per hour",
    currency: "BD",
    category: "Tutoring",
    rating: 4.9,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=297&h=167&fit=crop",
    featured: true,
    duration: "1-2 hours",
    description: "Professional tutoring services for all subjects and grade levels."
  }
];

// Featured categories data
export const featuredCategories = [
  {
    id: 1,
    name: "Home Repair",
    icon: "🔨",
    description: "General repairs and maintenance",
    serviceCount: 45,
    color: "#FF6B6B"
  },
  {
    id: 2,
    name: "Automotive",
    icon: "🚗",
    description: "Car services and maintenance",
    serviceCount: 32,
    color: "#4ECDC4"
  },
  {
    id: 3,
    name: "Health & Wellness",
    icon: "💪",
    description: "Fitness and health services",
    serviceCount: 28,
    color: "#45B7D1"
  },
  {
    id: 4,
    name: "Event Services",
    icon: "🎉",
    description: "Event planning and photography",
    serviceCount: 56,
    color: "#F7DC6F"
  },
  {
    id: 5,
    name: "Tutoring",
    icon: "📚",
    description: "Educational support and coaching",
    serviceCount: 39,
    color: "#BB8FCE"
  },
  {
    id: 6,
    name: "Cleaning",
    icon: "🧽",
    description: "Professional cleaning services",
    serviceCount: 67,
    color: "#58D68D"
  },
  {
    id: 7,
    name: "Pet Care",
    icon: "🐕",
    description: "Pet grooming and care services",
    serviceCount: 23,
    color: "#F1948A"
  },
  {
    id: 8,
    name: "Digital Services",
    icon: "💻",
    description: "IT support and digital solutions",
    serviceCount: 41,
    color: "#85C1E9"
  }
];

// Helper function to format price with BD currency
export const formatPrice = (price, currency = "BD") => {
  return `${currency} ${price.toFixed(3)}`;
};

// Helper function to get featured services
export const getFeaturedServices = () => {
  return popularServices.filter(service => service.featured);
};

// Helper function to get services by category
export const getServicesByCategory = (categoryName) => {
  return popularServices.filter(service => 
    service.category.toLowerCase() === categoryName.toLowerCase()
  );
};

// Helper function to get category by name
export const getCategoryByName = (categoryName) => {
  return featuredCategories.find(category => 
    category.name.toLowerCase() === categoryName.toLowerCase()
  );
};
