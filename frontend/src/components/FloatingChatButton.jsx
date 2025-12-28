/**
 * Floating Chatbot Button
 * A floating action button to access the chatbot from any page
 */
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, X } from 'lucide-react';

const FloatingChatButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Don't show on chatbot page itself
  if (location.pathname === '/chatbot') {
    return null;
  }

  const handleClick = () => {
    navigate('/chatbot');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group animate-bounce-slow"
        aria-label="Open Medical AI Assistant"
      >
        <MessageSquare className="w-7 h-7" />
        
        {/* Notification Dot (optional - can be used for unread messages) */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
      </button>

      {/* Tooltip */}
      {isHovered && (
        <div className="fixed bottom-20 right-6 z-50 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl text-sm whitespace-nowrap animate-fade-in">
          Ask Medical AI Assistant
          <div className="absolute -bottom-1 right-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </>
  );
};

export default FloatingChatButton;
