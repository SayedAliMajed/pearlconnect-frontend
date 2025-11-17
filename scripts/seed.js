// Comprehensive Seeding Script for PearlConnect Development
// Run with: node scripts/seed.js
// This will populate the platform with realistic services, bookings, and reviews

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Category = require('../models/Category');
const Review = require('../models/Review');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/pearlconnect';
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('🌱 Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected! Starting data seeding...');

    // Get existing IDs
    const admin = await User.findOne({ role: 'admin' });
    const providers = await User.find({ role: 'provider' });
    const customers = await User.find({ role: 'customer' });
    const categories = await Category.find();

    console.log(`Found: ${providers.length} providers, ${customers.length} customers, ${categories.length} categories`);

    // Create additional services for providers
    console.log('\n🏗️ Creating additional services...');
    const additionalServices = [
      // Sarah (Cleaning) - already has 2 services in your data
      {
        title: 'Residential Deep Cleaning',
        description: 'Complete deep cleaning service for homes including walls, baseboards, and light fixtures.',
        provider: providers.find(p => p.username.includes('arah'))?._id, // Sarah
        category: categories.find(c => c.name === 'Cleaning')?._id,
        price: 150,
        currency: 'BD',
        duration: '4-5 hours',
        active: true,
        images: [{ url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop' }]
      },
      {
        title: 'Office Cleaning',
        description: 'Professional office cleaning service including desks, floors, and common areas.',
        provider: providers.find(p => p.username.includes('arah'))?._id,
        category: categories.find(c => c.name === 'Cleaning')?._id,
        price: 200,
        currency: 'BD',
        duration: '2-3 hours',
        active: true,
        images: [{ url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=300&fit=crop' }]
      },

      // Mark (Tutoring) - create 4 tutoring services
      {
        title: 'Mathematics Tutoring',
        description: 'Private mathematics tutoring from basic algebra to advanced calculus.',
        provider: providers.find(p => p.username.includes('ark'))?._id, // Mark
        category: categories.find(c => c.name === 'Tutoring')?._id,
        price: 25,
        currency: 'BD',
        duration: '1 hour',
        active: true,
        images: [{ url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop' }]
      },
      {
        title: 'English Language Tutoring',
        description: 'Comprehensive English tutoring including reading, writing, and speaking skills.',
        provider: providers.find(p => p.username.includes('ark'))?._id,
        category: categories.find(c => c.name === 'Tutoring')?._id,
        price: 20,
        currency: 'BD',
        duration: '45 minutes',
        active: true,
        images: [{ url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop' }]
      },
      {
        title: 'Science Tutoring (Physics/Chemistry)',
        description: 'Help with physics and chemistry concepts, homework assistance, and exam preparation.',
        provider: providers.find(p => p.username.includes('ark'))?._id,
        category: categories.find(c => c.name === 'Tutoring')?._id,
        price: 30,
        currency: 'BD',
        duration: '1 hour',
        active: true,
        images: [{ url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop' }]
      },
      {
        title: 'Computer Science Tutoring',
        description: 'Programming help, algorithms, data structures, and coding projects.',
        provider: providers.find(p => p.username.includes('ark'))?._id,
        category: categories.find(c => c.name === 'Tutoring')?._id,
        price: 35,
        currency: 'BD',
        duration: '1 hour',
        active: true,
        images: [{ url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop' }]
      },

      // James (Plumbing) - create 3 plumbing services
      {
        title: 'Emergency Plumbing Repair',
        description: '24/7 emergency plumbing repairs for leaks, blockages, and broken pipes.',
        provider: providers.find(p => p.username.includes('ames'))?._id, // James
        category: categories.find(c => c.name === 'Plumbing')?._id,
        price: 120,
        currency: 'BD',
        duration: '1-2 hours',
        active: true,
        images: [{ url: 'https://images.unsplash.com/photo-1558618660-fcd25b47cd21?w=400&h=300&fit=crop' }]
      },
      {
        title: 'Water Heater Installation',
        description: 'Professional water heater installation and maintenance services.',
        provider: providers.find(p => p.username.includes('ames'))?._id,
        category: categories.find(c => c.name === 'Plumbing')?._id,
        price: 250,
        currency: 'BD',
        duration: '2-3 hours',
        active: true,
        images: [{ url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop' }]
      },
      {
        title: 'Drain Cleaning Service',
        description: 'Professional drain cleaning and unclogging service using modern equipment.',
        provider: providers.find(p => p.username.includes('ames'))?._id,
        category: categories.find(c => c.name === 'Plumbing')?._id,
        price: 80,
        currency: 'BD',
        duration: '1 hour',
        active: true,
        images: [{ url: 'https://images.unsplash.com/photo-1621905252470-9436b11d53fc?w=400&h=300&fit=crop' }]
      },

      // Add some services to remaining categories
      {
        title: 'House Painting Service',
        description: 'Interior and exterior painting services for homes and offices.',
        provider: providers[0]?._id, // First provider
        category: categories.find(c => c.name === 'Painting')?._id,
        price: 300,
        currency: 'BD',
        duration: '1-2 days',
        active: true,
        images: [{ url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop' }]
      },
      {
        title: 'Electrical Wiring Installation',
        description: 'Professional electrical wiring and installation services.',
        provider: providers[0]?._id,
        category: categories.find(c => c.name === 'Electrician')?._id,
        price: 180,
        currency: 'BD',
        duration: '2-4 hours',
        active: true,
        images: [{ url: 'https://images.unsplash.com/photo-1621905251189-00549cc1dc0d?w=400&h=300&fit=crop' }]
      },
      {
        title: 'Garden Landscaping',
        description: 'Complete gardening and landscaping services for residential properties.',
        provider: providers[0]?._id,
        category: categories.find(c => c.name === 'Landscaping')?._id,
        price: 400,
        currency: 'BD',
        duration: '4-6 hours',
        active: true,
        images: [{ url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop' }]
      }
    ];

    // Filter out services with missing required fields
    const validServices = additionalServices.filter(service =>
      service.provider && service.category && service.title
    );

    console.log(`📋 Creating ${validServices.length} additional services...`);
    await Service.insertMany(validServices);
    console.log('✅ Additional services created!');

    // Create bookings
    console.log('\n📅 Creating customer bookings...');
    const allServices = await Service.find();

    const bookings = [
      // Maria's bookings
      {
        serviceId: allServices[0]?._id,
        providerId: allServices[0]?.provider,
        customerId: customers[0]?._id,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
        time: '10:00',
        status: 'confirmed'
      },
      {
        serviceId: allServices[5]?._id,
        providerId: allServices[5]?.provider,
        customerId: customers[0]?._id,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
        time: '14:00',
        status: 'pending'
      },

      // Ahmed's bookings
      {
        serviceId: allServices[8]?._id,
        providerId: allServices[8]?.provider,
        customerId: customers[1]?._id,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '09:00',
        status: 'confirmed'
      },
      {
        serviceId: allServices[3]?._id,
        providerId: allServices[3]?.provider,
        customerId: customers[1]?._id,
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '16:00',
        status: 'completed',
        notes: 'Great tutoring session!'
      },

      // Fatema's bookings
      {
        serviceId: allServices[7]?._id,
        providerId: allServices[7]?.provider,
        customerId: customers[2]?._id,
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '11:00',
        status: 'pending'
      },

      // Omar's bookings
      {
        serviceId: allServices[2]?._id,
        providerId: allServices[2]?.provider,
        customerId: customers[3]?._id,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
        time: '13:00',
        status: 'completed'
      },
      {
        serviceId: allServices[9]?._id,
        providerId: allServices[9]?.provider,
        customerId: customers[3]?._id,
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '15:00',
        status: 'confirmed'
      }
    ];

    const validBookings = bookings.filter(booking =>
      booking.serviceId && booking.providerId && booking.customerId
    );

    console.log(`📝 Creating ${validBookings.length} customer bookings...`);
    await Booking.insertMany(validBookings);
    console.log('✅ Customer bookings created!');

    // Create reviews for completed bookings
    console.log('\n⭐ Creating reviews for completed services...');
    const completedBookings = await Booking.find({ status: 'completed' });

    const reviews = [
      {
        serviceId: completedBookings[0]?.serviceId,
        reviewerId: completedBookings[0]?.customerId,
        providerId: completedBookings[0]?.providerId,
        rating: 5,
        comment: 'Excellent tutoring session! Very knowledgeable and patient with explanations.'
      },
      {
        serviceId: completedBookings[1]?.serviceId,
        reviewerId: completedBookings[1]?.customerId,
        providerId: completedBookings[1]?.providerId,
        rating: 4,
        comment: 'Great plumbing service, arrived on time and fixed the issue quickly. Highly recommend!'
      }
    ];

    const validReviews = reviews.filter(review =>
      review.serviceId && review.reviewerId && review.providerId
    );

    console.log(`📝 Creating ${validReviews.length} reviews...`);
    await Review.insertMany(validReviews);
    console.log('✅ Reviews created!');

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n--- SUMMARY ---');
    console.log('✅ Services: Added realistic services across all categories');
    console.log('✅ Bookings: Created customer bookings with mixed statuses');
    console.log('✅ Reviews: Added reviews for completed services');
    console.log('\nYour platform now has a complete, realistic dataset for testing! 🚀');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Run the seeding script
console.log('🌱 Starting PearlConnect Data Seeding...');
seed().catch(console.error);
