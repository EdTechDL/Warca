import React from 'react';
import { ResearchPaper } from '../types';
import { User, Calendar, ChevronRight } from 'lucide-react';

interface ResearchCardProps {
  paper: ResearchPaper;
  onClick: (paper: ResearchPaper) => void;
}

const ResearchCard: React.FC<ResearchCardProps> = ({ paper, onClick }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(paper)}
    >
      {/* Image */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={paper.imageUrl || `https://picsum.photos/seed/${paper.id}/600/400`}
          alt={paper.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-3 left-3 flex gap-2">
          {paper.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-brand-600/90 backdrop-blur-sm text-white text-xs font-bold rounded uppercase tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-brand-700 transition-colors">
          {paper.title}
        </h3>

        <div className="flex items-center text-slate-500 text-sm mb-3 space-x-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span className="truncate max-w-[120px]">{paper.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{new Date(paper.date).toLocaleDateString()}</span>
          </div>
        </div>

        <p className="text-slate-600 text-sm line-clamp-3 mb-4">
          {paper.abstract}
        </p>

        <div className="flex items-center text-brand-600 font-medium text-sm group-hover:text-brand-700">
          Read More <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default ResearchCard;
