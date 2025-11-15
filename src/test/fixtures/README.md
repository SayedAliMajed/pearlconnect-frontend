# Test Fixtures

This directory contains test data and fixtures used for development and UI testing.

## Contents

### `test-services.js`
- **Purpose**: Test data for services, categories, and utility functions
- **Usage**: Used when backend API is unavailable for development/testing
- **Location**: `src/test/fixtures/test-services.js`
- **Status**: DO NOT edit in production - this is only for development

## Important Notes

❌ **DO NOT USE IN PRODUCTION** - This data should never appear in production builds
❌ **NOT FOR USER CONTENT** - Users cannot modify this data; it's for developers only
✅ **SAFE FOR DEVELOPMENT** - Load this data when backend is down for UI testing

## Projects that import this data:
- `src/pages/services/ServicesPage.jsx` - Fallback for services listing
- `src/components/homePage/homePage.jsx` - Fallback for homepage services
- `src/components/navbar/navbar.jsx` - Category filtering
- `src/components/providers/ServiceForm.jsx` - Category selection
