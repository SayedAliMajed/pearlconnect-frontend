import { Link } from 'react-router';

const LandingPage = () => {
  return (
    <div className="font-display bg-white dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header/Navigation */}
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200/80 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-gray-700/80 dark:bg-background-dark/80 sm:px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white">
            <img
              alt="PearlConnect Logo"
              className="h-8"
              src="/img/logo.png"
            />
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PearlConnect</h2>
          </Link>
          <div className="flex flex-1 items-center justify-end gap-4 sm:gap-6">
            <div className="hidden items-center gap-6 sm:flex">
              <Link className="text-sm font-medium leading-normal text-gray-800 hover:text-primary dark:text-gray-200 dark:hover:text-primary" to="/services">
                Find Services
              </Link>
              <Link className="text-sm font-medium leading-normal text-gray-800 hover:text-primary dark:text-gray-200 dark:hover:text-primary" to="/sign-up">
                Become a Pro
              </Link>
            </div>
            <Link to="/sign-in">
              <button className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-100 px-4 text-sm font-bold leading-normal tracking-[0.015em] text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                <span className="truncate">Log In</span>
              </button>
            </Link>
          </div>
        </header>

        <main className="flex flex-col">
          {/* Hero Section */}
          <div className="w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8 mx-auto">
            <div className="@container">
              <div className="py-5 @[480px]:py-8">
                <div className="flex min-h-[480px] flex-col items-center justify-center gap-6 bg-cover bg-center bg-no-repeat p-4 text-center @[480px]:gap-8 @[480px]:rounded-xl"
                     style={{
                       backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAmIy3mzad21AEh3dWnJ-L1_Ef8hW27qppsK2UYuCmaXBkZOxSMCyxvQwq8arwUn9ky4EHi85GjCqWd02WSQuMQYxRDCUkn49lCzheUL5AUKcwIay8rbjMDuTOwOKWxdbcmlAvsBqjmnLHIRyUN2Qn0cDtNI5lHAs-yVgG91EmtgytOilkrS_g41AsgXEz283SYCNgB02JO2J1LZAaapoHX_p1RKwk_x6qyBPOEdoe7tUXre5DbYV7KKB8TbrccjbDHilUBgDvlXyFj");`
                     }}>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-white @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                      Where Local Experts and Neighbors Meet
                    </h1>
                    <h2 className="max-w-xl text-sm font-normal leading-normal text-white @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      The trusted platform connecting you with skilled professionals for any service you need, right here in Bahrain.
                    </h2>
                  </div>
                  <Link to="/sign-up">
                    <button className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-white hover:bg-primary/90 @[480px]:h-12 @[480px]:px-5 @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                      <span className="truncate">Join Bahrain's Service Network</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Section */}
          <div className="flex flex-col gap-10 px-4 py-10 @container max-w-5xl mx-auto">
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="max-w-[720px] text-[32px] font-bold leading-tight tracking-light text-gray-900 dark:text-white @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                A Platform Built on Trust
              </h1>
              <p className="max-w-[720px] text-base font-normal leading-normal text-gray-600 dark:text-gray-300">
                We prioritize your safety and satisfaction with every connection made on PearlConnect.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-1 flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-background-dark/50">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>verified_user</span>
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-bold leading-tight text-gray-900 dark:text-white">Verified Bahraini Professionals</h2>
                  <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">Every service provider is vetted and verified to ensure quality and reliability.</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-background-dark/50">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>credit_card</span>
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-bold leading-tight text-gray-900 dark:text-white">Secure & Easy Payments</h2>
                  <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">Pay for services securely through our platform with complete peace of mind.</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-background-dark/50">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>support_agent</span>
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-bold leading-tight text-gray-900 dark:text-white">Dedicated 24/7 Bahrain Support</h2>
                  <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">Our local support team is always available to assist you with any questions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="my-10 rounded-xl bg-background-light py-10 dark:bg-black/20 max-w-5xl mx-auto">
            <h2 className="px-4 pb-5 pt-5 text-center text-[22px] font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">
              Explore Services in Your Community
            </h2>
            <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3">
              <Link to="/services?category=Plumbing" className="flex flex-1 flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-background-dark/50 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>home_repair_service</span>
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-bold leading-tight text-gray-900 dark:text-white">Home Maintenance</h2>
                  <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">Plumbing, electrical, and repairs.</p>
                </div>
              </Link>
              <Link to="/services?category=Tutoring" className="flex flex-1 flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-background-dark/50 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>school</span>
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-bold leading-tight text-gray-900 dark:text-white">Tutoring & Education</h2>
                  <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">Find expert tutors for all subjects.</p>
                </div>
              </Link>
              <Link to="/services?category=Cleaning" className="flex flex-1 flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-background-dark/50 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>cleaning_services</span>
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-bold leading-tight text-gray-900 dark:text-white">Cleaning Services</h2>
                  <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">Residential and commercial cleaning.</p>
                </div>
              </Link>
              {/* Note: These service cards link to categories but the actual service filtering is handled by the services page */}
            </div>
          </div>

          {/* Stats Section */}
          <div className="px-4 py-16 max-w-5xl mx-auto">
            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="text-3xl font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">
                Trusted by Your Neighbors
              </h2>
              <p className="max-w-2xl text-gray-600 dark:text-gray-300">
                Join a growing community of satisfied customers and professional service providers across Bahrain.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
              <div className="flex flex-col items-center">
                <p className="text-4xl font-extrabold text-primary">5,000+</p>
                <p className="mt-1 text-base text-gray-600 dark:text-gray-300">Services Completed</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-4xl font-extrabold text-primary">1,200+</p>
                <p className="mt-1 text-base text-gray-600 dark:text-gray-300">Verified Pros</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-4xl font-extrabold text-primary">4.9/5</p>
                <p className="mt-1 text-base text-gray-600 dark:text-gray-300">Average Rating</p>
              </div>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="my-10 flex flex-col items-center gap-6 rounded-lg bg-primary/20 p-8 text-center dark:bg-primary/30 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Ready to Connect? Get Started Today.</h2>
            <p className="max-w-xl text-gray-700 dark:text-gray-200">
              Whether you need a service or want to offer your skills, PearlConnect is the place for you.
            </p>
            <Link to="/sign-up">
              <button className="flex h-12 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold leading-normal tracking-[0.015em] text-white hover:bg-primary/90">
                <span className="truncate">Join Bahrain's Service Network</span>
              </button>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-background-light text-gray-600 dark:bg-black/20 dark:text-gray-400">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="size-6 text-primary">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">PearlConnect</h2>
                </div>
                <p className="text-sm">Connecting communities in Bahrain, one service at a time.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Company</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><Link className="hover:text-primary" to="/about">About Us</Link></li>
                  <li><Link className="hover:text-primary" to="/careers">Careers</Link></li>
                  <li><Link className="hover:text-primary" to="/press">Press</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">For You</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><Link className="hover:text-primary" to="/services">Find a Pro</Link></li>
                  <li><Link className="hover:text-primary" to="/how-it-works">How it Works</Link></li>
                  <li><Link className="hover:text-primary" to="/trust-safety">Trust & Safety</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">For Pros</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><Link className="hover:text-primary" to="/sign-up">Become a Pro</Link></li>
                  <li><Link className="hover:text-primary" to="/pro-center">Pro Center</Link></li>
                  <li><Link className="hover:text-primary" to="/community">Community</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-300 pt-8 dark:border-gray-700 sm:flex-row">
              <p className="text-sm">© 2024 PearlConnect Bahrain. All rights reserved.</p>
              <div className="flex space-x-4">
                <Link className="hover:text-primary" to="/terms">Terms of Service</Link>
                <Link className="hover:text-primary" to="/privacy">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
