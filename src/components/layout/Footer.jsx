import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        <div className="mt-6 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} FestClicks. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 