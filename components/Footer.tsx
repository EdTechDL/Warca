import React from 'react';
import { Page } from '../types';
import { BookOpen, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 text-white mb-4">
              <BookOpen className="h-8 w-8" />
              <span className="font-serif font-bold text-xl">OERC</span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              The Ontario Educational Research Consortium bridges the gap between academic research and classroom practice.
            </p>
            <div className="flex items-center text-slate-400">
              <Mail className="h-4 w-4 mr-2" />
              <span>contact@oerc.org</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate(Page.ABOUT)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate(Page.RESEARCH)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Research Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate(Page.EVENTS)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate(Page.MEMBERSHIP)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Membership
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate(Page.PRIVACY)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate(Page.FAQ)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate(Page.CONTACT)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate(Page.ADMIN)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Admin
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Ontario Educational Research Consortium. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
