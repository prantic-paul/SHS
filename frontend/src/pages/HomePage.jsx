/**
 * Home Page
 * Landing page with detailed services
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiActivity, FiHeart, FiShield, FiCalendar, FiFileText, FiUsers, FiPhone, FiMail, FiLinkedin, FiFacebook, FiLogIn, FiUser } from 'react-icons/fi';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const services = [
    {
      icon: <FiActivity className="w-12 h-12" />,
      title: 'Find Verified Doctors',
      description: 'Access our comprehensive database of verified healthcare professionals across various specializations. Browse doctor profiles, check their qualifications, experience, and patient reviews. Our platform ensures you connect with certified medical practitioners who meet the highest standards of healthcare excellence. Search by specialty, location, or availability to find the perfect doctor for your healthcare needs.'
    },
    {
      icon: <FiCalendar className="w-12 h-12" />,
      title: 'Easy Appointment Booking',
      description: 'Schedule appointments with your preferred doctors at your convenience. Our intelligent booking system shows real-time availability, allows you to choose suitable time slots, and sends automated reminders. No more waiting in long queues or making endless phone calls. Book, reschedule, or cancel appointments with just a few clicks, making healthcare access truly seamless.'
    },
    {
      icon: <FiFileText className="w-12 h-12" />,
      title: 'Digital Health Records',
      description: 'Keep all your medical records, prescriptions, lab reports, and test results in one secure digital location. Access your complete health history anytime, anywhere. Share specific records with healthcare providers instantly and securely. Our encrypted storage ensures your sensitive medical information remains private and protected while being readily available when you need it most.'
    },
    {
      icon: <FiHeart className="w-12 h-12" />,
      title: 'Health Monitoring & Tracking',
      description: 'Track your vital health parameters, medications, and treatment progress over time. Set reminders for medications and follow-up appointments. Monitor chronic conditions with personalized health dashboards. Get insights into your health trends and receive alerts for important health milestones. Empower yourself with data-driven health management tools.'
    },
    {
      icon: <FiShield className="w-12 h-12" />,
      title: 'Secure & Private',
      description: 'Your privacy and security are our top priorities. We employ bank-level encryption to protect your personal and medical information. All data transmissions are secured with SSL/TLS protocols. Our platform is fully compliant with healthcare privacy regulations. Access controls ensure that only authorized individuals can view your sensitive health information.'
    },
    {
      icon: <FiUsers className="w-12 h-12" />,
      title: 'Family Health Management',
      description: 'Manage health records for your entire family from a single account. Add family members, track their appointments, medications, and health progress. Particularly useful for parents managing childrens health, or adults caring for elderly family members. Coordinate family healthcare efficiently with centralized access to everyones medical information.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-white font-bold text-xl">
                Smart Health Synchronizer
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/doctors" className="text-white hover:text-primary-100 text-sm font-medium transition-colors">
                Doctors
              </Link>
              <a href="#awareness" className="text-white hover:text-primary-100 text-sm font-medium transition-colors">
                Public Awareness
              </a>
              <a href="#contact" className="text-white hover:text-primary-100 text-sm font-medium transition-colors">
                Contact
              </a>
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="inline-flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <FiUser className="mr-2" />
                  Profile
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <FiLogIn className="mr-2" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 py-16 sm:py-24 lg:py-32">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Your Health,</span>
                  <span className="block text-primary-100">Our Priority</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-primary-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Connect with verified healthcare professionals, manage your health records, and take control of your wellness journey with Smart Health Synchronizer.
                </p>
                {!isAuthenticated && (
                  <div className="mt-10">
                    <Link 
                      to="/register" 
                      className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-base font-bold rounded-xl text-primary-600 bg-white hover:bg-primary-50 md:text-lg shadow-2xl transition-all transform hover:scale-105"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Comprehensive healthcare solutions designed for your well-being
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div 
                key={index}
                className="relative group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl text-white mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctors Section */}
      <div id="doctors" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
              Find Verified Doctors
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Browse our network of qualified healthcare professionals
            </p>
            <Link
              to="/doctors"
              className="inline-flex items-center bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg hover:shadow-xl"
            >
              <FiUsers className="mr-2" />
              Browse All Doctors
            </Link>
          </div>
        </div>
      </div>

      {/* Public Awareness Section */}
      <div id="awareness" className="py-16 sm:py-24 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
              Public Health Awareness
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed about important health topics, preventive care, and wellness tips. 
              Our health blog will feature expert articles, medical updates, and community health initiatives.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-16 sm:py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-300">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <a 
              href="tel:+8801712345678" 
              className="flex flex-col items-center p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors group"
            >
              <FiPhone className="w-10 h-10 text-primary-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">Phone</h3>
              <p className="text-gray-300 text-sm text-center">+880 1712-345678</p>
            </a>

            <a 
              href="mailto:contact@smarthealth.com" 
              className="flex flex-col items-center p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors group"
            >
              <FiMail className="w-10 h-10 text-primary-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">Email</h3>
              <p className="text-gray-300 text-sm text-center">contact@smarthealth.com</p>
            </a>

            <a 
              href="https://linkedin.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors group"
            >
              <FiLinkedin className="w-10 h-10 text-primary-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">LinkedIn</h3>
              <p className="text-gray-300 text-sm text-center">Connect with us</p>
            </a>

            <a 
              href="https://facebook.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors group"
            >
              <FiFacebook className="w-10 h-10 text-primary-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">Facebook</h3>
              <p className="text-gray-300 text-sm text-center">Follow our page</p>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            © 2025 Smart Health Synchronizer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
