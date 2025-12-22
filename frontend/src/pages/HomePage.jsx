/**
 * Home Page
 * Professional landing page with modern design
 */
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  Activity,
  Calendar,
  FileText,
  Heart,
  Shield,
  Users,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Check,
  Star,
  Clock,
  Award,
} from 'lucide-react';

const HomePage = () => {
  const services = [
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Find Verified Doctors',
      description: 'Access our comprehensive database of verified healthcare professionals across various specializations with real patient reviews and ratings.',
    },
    {
      icon: <Calendar className="w-12 h-12" />,
      title: 'Easy Appointment Booking',
      description: 'Schedule appointments with your preferred doctors at your convenience with real-time availability and automated reminders.',
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: 'Digital Health Records',
      description: 'Keep all your medical records, prescriptions, and test results secure and accessible anytime, anywhere.',
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: 'Health Monitoring',
      description: 'Track your vital health parameters, medications, and treatment progress with personalized health dashboards.',
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Secure & Private',
      description: 'Bank-level encryption protects your personal and medical information with full HIPAA compliance.',
    },
    {
      icon: <Activity className="w-12 h-12" />,
      title: 'Family Health Management',
      description: 'Manage health records for your entire family from a single account with coordinated care.',
    },
  ];

  const features = [
    '24/7 Online Support',
    'Verified Healthcare Professionals',
    'Secure Data Storage',
    'Easy Appointment Scheduling',
    'Digital Prescriptions',
    'Health Insights & Analytics',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="pt-16">
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/30">
                <Award className="w-4 h-4 mr-2" />
                Trusted by 10,000+ patients
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                Your Health,
                <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                  Synchronized & Simplified
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
                Connect with verified doctors, manage appointments, and keep your health records
                secure—all in one intelligent platform
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/doctors"
                  className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105 flex items-center space-x-2"
                >
                  <span>Find Doctors Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 backdrop-blur-sm transition-all"
                >
                  Create Free Account
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: '500+', label: 'Verified Doctors' },
                  { value: '10k+', label: 'Happy Patients' },
                  { value: '50+', label: 'Specializations' },
                  { value: '24/7', label: 'Support Available' },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <div className="text-4xl font-extrabold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-blue-100 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-6 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center justify-center space-x-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              COMPREHENSIVE SOLUTIONS
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Everything You Need for Better Health
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools you need to manage your healthcare journey
              effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who trust us with their healthcare needs
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl hover:scale-105"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-white text-2xl font-bold mb-4">Smart Health Sync</h3>
              <p className="text-gray-400 leading-relaxed">
                Your trusted healthcare management platform for a healthier tomorrow.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/doctors" className="hover:text-white transition-colors">
                    Find Doctors
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span>support@smarthealth.com</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span>123 Health St, Medical City</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Smart Health Synchronizer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
