import React, { useState } from 'react';
import { Page } from '../types';
import { Menu, X, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { page: Page.HOME, label: 'Home' },
    { page: Page.ABOUT, label: 'About' },
    { page: Page.RESEARCH, label: 'Research' },
    { page: Page.EVENTS, label: 'Events' },
    { page: Page.FAQ, label: 'FAQ' },
    { page: Page.CONTACT, label: 'Contact' },
  ];

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavigate(Page.HOME)}
            className="flex items-center space-x-2 text-brand-700 hover:text-brand-600 transition-colors"
          >
            <BookOpen className="h-8 w-8" />
            <span className="font-serif font-bold text-xl">OERC</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavigate(item.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.page
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-brand-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavigate(Page.MEMBERSHIP)}
              className="ml-4 px-5 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
            >
              Join Us
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4">
          <div className="px-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavigate(item.page)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.page
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-brand-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavigate(Page.MEMBERSHIP)}
              className="block w-full mt-4 px-4 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors text-center"
            >
              Join Us
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
