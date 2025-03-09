import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mt-2 pt-2 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} FestClicks. All rights reserved | Tweet us: @YourTwitterHandle
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 