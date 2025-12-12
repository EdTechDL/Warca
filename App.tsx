import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ResearchCard from './components/ResearchCard';
import AIAssistant from './components/AIAssistant';
import { Page, ResearchPaper, Event } from './types';
import { fetchResearchPapers } from './services/geminiService';
import { getPapers, uploadPaperToLibrary, deletePaper, signIn, signOut, getCurrentUser } from './services/supabaseService';
import { Search, ChevronRight, ChevronLeft, Calendar, Users, BookOpen, BarChart3, MapPin, Loader2, Check, UserPlus, Building2, User, X, Plus, Minus, AlertCircle, Globe, FileText, Lock, Play, Pause, Mail, Shield, ExternalLink, Bot, Download, ArrowLeft, Youtube, Trash2, Upload, DollarSign, Image as ImageIcon } from 'lucide-react';

const EVENTS: Event[] = [
  {
    id: '1',
    title: "Annual OERC Research Symposium",
    date: "2024-06-15",
    location: "St. Catharines Conference Centre",
    description: "Join over 500 educators and researchers for our flagship event showcasing the latest findings in educational science."
  },
  {
    id: '2',
    title: "Workshop: Data Visualization for Educators",
    date: "2024-07-10",
    location: "Virtual (Zoom)",
    description: "A hands-on workshop learning how to interpret and present classroom data effectively using modern tools."
  }
];

const GLOBAL_CONFERENCES = [
  {
    id: 'g1',
    title: "ISTE Live 24",
    date: "2024-06-23",
    location: "Denver, USA and Virtual",
    description: "One of the world's most comprehensive edtech events, focusing on innovation in learning and teaching.",
    link: "https://www.iste.org/"
  },
  {
    id: 'g2',
    title: "ICERI 2024",
    date: "2024-11-11",
    location: "Seville, Spain",
    description: "17th annual International Conference of Education, Research and Innovation.",
    link: "https://iated.org/iceri/"
  },
  {
    id: 'g3',
    title: "Bett UK 2025",
    date: "2025-01-22",
    location: "London, UK",
    description: "The global community for education technology, connecting educators with solutions.",
    link: "https://www.bettshow.com/"
  },
  {
    id: 'g4',
    title: "WERA Focal Meeting",
    date: "2024-09-08",
    location: "Manchester, UK",
    description: "World Education Research Association meeting addressing global challenges in education.",
    link: "https://weraonline.org/"
  }
];

// --- Shared Components ---

const PrivacyPolicyContent: React.FC = () => (
  <div className="prose prose-slate max-w-none text-slate-600">
    <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
      <Shield className="h-5 w-5 mr-2 text-brand-600" />
      1. Introduction
    </h3>
    <p className="mb-6">
      The Ontario Educational Research Consortium ("OERC", "we", "us", or "our") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website, apply for membership, or register for events.
    </p>

    <h3 className="text-xl font-bold text-slate-900 mb-4">2. The Data We Collect About You</h3>
    <p className="mb-4">
      We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:
    </p>
    <ul className="list-disc pl-6 mb-6 space-y-2">
      <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier, and title.</li>
      <li><strong>Contact Data:</strong> includes billing address, email address, and telephone numbers.</li>
      <li><strong>Professional Data:</strong> includes institution name, job title, and affiliation.</li>
      <li><strong>Transaction Data:</strong> includes details about payments to and from you (note: we do not store credit card details directly; these are processed by our secure payment providers).</li>
    </ul>

    <h3 className="text-xl font-bold text-slate-900 mb-4">3. How We Use Your Personal Data</h3>
    <p className="mb-4">
      We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
    </p>
    <ul className="list-disc pl-6 mb-6 space-y-2">
      <li>To register you as a new member.</li>
      <li>To process and deliver your event registrations.</li>
      <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
      <li>To use data analytics to improve our website, services, and member experiences (data is anonymized where possible).</li>
    </ul>

    <h3 className="text-xl font-bold text-slate-900 mb-4">4. Third-Party Links</h3>
    <p className="mb-6">
      This website may include links to third-party websites (such as university partners or research journals), plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
    </p>

    <h3 className="text-xl font-bold text-slate-900 mb-4">5. Contact Details</h3>
    <p className="mb-2">
      If you have any questions about this privacy policy or our privacy practices, please contact us at:
    </p>
    <address className="not-italic bg-slate-50 p-4 rounded-lg border border-slate-200">
      <strong>Ontario Educational Research Consortium</strong><br />
      Email: contact@oerc.org
    </address>
  </div>
);

const PrivacyPolicyPage: React.FC = () => (
  <div className="py-20 bg-slate-50 min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">Privacy Policy</h1>
        <PrivacyPolicyContent />
      </div>
    </div>
  </div>
);

// --- Page Components ---

const Home: React.FC<{ setCurrentPage: (page: Page) => void, papers: ResearchPaper[] }> = ({ setCurrentPage, papers }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const featured = papers.slice(0, 4);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!isPaused && featured.length > 0) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % featured.length);
      }, 5000); // Pan every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isPaused, featured.length]);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % featured.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + featured.length) % featured.length);

  if (featured.length === 0) return (
    <div className="py-20 text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-600" />
      <p className="text-slate-500 mt-2">Loading research...</p>
    </div>
  );

  const currentPaper = featured[activeIndex];

  return (
    <>
      {/* Hero Section */}
      <header className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
            <img src="https://picsum.photos/seed/oerc_hero/1920/1080?grayscale&blur=2" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="lg:w-2/3">
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Advancing Education Through <span className="text-brand-400">Evidence and Innovation</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
              The Ontario Educational Research Consortium bridges the gap between academic research and classroom practice, empowering educators with data-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setCurrentPage(Page.RESEARCH)} className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-brand-500/30 transition-all duration-300 flex items-center justify-center">
                Explore Research <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <button onClick={() => setCurrentPage(Page.ABOUT)} className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold rounded-lg transition-all duration-300">
                Learn About Us
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Research Carousel Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Latest Research Highlights</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Explore the most recent summaries from our research community.</p>
          </div>
          
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 max-w-6xl mx-auto group">
            {/* Pause/Play Control - Visible on Hover or Interaction */}
            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setIsPaused(!isPaused)} 
                className="flex items-center gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              >
                {isPaused ? <Play className="h-3 w-3 fill-current" /> : <Pause className="h-3 w-3 fill-current" />}
                {isPaused ? "Resume" : "Pause Pan"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[450px]">
              {/* Image Side */}
              <div className="relative h-64 md:h-auto overflow-hidden">
                <img 
                  src={currentPaper.imageUrl || "https://picsum.photos/seed/default/800/400"} 
                  alt={currentPaper.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-none"></div>
                <div className="absolute bottom-4 left-4 md:hidden text-white">
                    <span className="text-xs font-bold uppercase tracking-wider bg-brand-600 px-2 py-1 rounded mb-2 inline-block">
                        {currentPaper.tags?.[0] || 'Research'}
                    </span>
                </div>
              </div>

              {/* Content Side */}
              <div className="p-8 md:p-12 flex flex-col justify-center relative">
                <div className="mb-6 hidden md:flex gap-2">
                   {currentPaper.tags?.map((tag) => (
                      <span key={tag} className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-1 rounded">
                        {tag}
                      </span>
                   ))}
                </div>
                
                <h3 key={currentPaper.id} className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {currentPaper.title}
                </h3>
                
                <div key={`meta-${currentPaper.id}`} className="flex items-center text-slate-500 text-sm mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <User className="h-4 w-4 mr-2" />
                    <span className="mr-4">{currentPaper.author}</span>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(currentPaper.date).toLocaleDateString()}</span>
                </div>

                <p key={`abs-${currentPaper.id}`} className="text-slate-600 text-lg leading-relaxed mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   {currentPaper.abstract}
                </p>

                {/* Controls */}
                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button onClick={() => setCurrentPage(Page.RESEARCH)} className="text-brand-700 font-semibold hover:text-brand-800 transition-colors flex items-center">
                        Read Full Paper <ChevronRight className="ml-1 h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-4">
                        <button onClick={() => { setIsPaused(true); prevSlide(); }} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-brand-600 transition-colors">
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        
                        <div className="flex gap-2">
                            {featured.map((_, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => { setIsPaused(true); setActiveIndex(idx); }}
                                    className={`h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-brand-600' : 'w-2 bg-slate-300 hover:bg-brand-400'}`}
                                />
                            ))}
                        </div>

                        <button onClick={() => { setIsPaused(true); nextSlide(); }} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-brand-600 transition-colors">
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-12 text-center">Our Focus Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all duration-300 text-center">
                    <div className="w-16 h-16 mx-auto bg-brand-100 rounded-full flex items-center justify-center mb-6 text-brand-600">
                        <BookOpen className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Curriculum Development</h3>
                    <p className="text-slate-600">Researching effective pedagogical strategies to enhance provincial curriculum standards.</p>
                </div>
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all duration-300 text-center">
                    <div className="w-16 h-16 mx-auto bg-brand-100 rounded-full flex items-center justify-center mb-6 text-brand-600">
                        <Users className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Equity and Inclusion</h3>
                    <p className="text-slate-600">Identifying barriers to education and creating frameworks for inclusive learning environments.</p>
                </div>
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all duration-300 text-center">
                    <div className="w-16 h-16 mx-auto bg-brand-100 rounded-full flex items-center justify-center mb-6 text-brand-600">
                        <BarChart3 className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Assessment and Analytics</h3>
                    <p className="text-slate-600">Leveraging data analytics to improve student assessment models and feedback mechanisms.</p>
                </div>
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all duration-300 text-center">
                    <div className="w-16 h-16 mx-auto bg-brand-100 rounded-full flex items-center justify-center mb-6 text-brand-600">
                        <Bot className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">AI in Education</h3>
                    <p className="text-slate-600">Exploring ethical AI integration to personalize learning paths and support educator capabilities.</p>
                </div>
            </div>
        </div>
      </section>
    </>
  );
};

const About: React.FC = () => (
  <div className="py-20 bg-slate-50 min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-serif font-bold text-slate-900 mb-8 text-center">About OERC</h1>
      <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-12">
        <p className="text-lg text-slate-700 leading-relaxed mb-6">
          The Ontario Educational Research Consortium (OERC) is dedicated to enhancing the quality of education by aggregating and synthesizing diverse research from a wide array of sources. We serve as a collaborative hub that brings together rigorous evidence from universities, policy institutes, and school boards to ensure that educational standards in Ontario are grounded in the best available global and local insights.
        </p>
        <p className="text-lg text-slate-700 leading-relaxed">
          Our mission is to translate this wealth of information into actionable improvements for the classroom. By integrating varied research perspectives, we empower educators and stakeholders with the comprehensive knowledge necessary to foster excellence, equity, and innovation in student learning.
        </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8">Governance and Structure</h2>
        
        <p className="text-slate-700 leading-relaxed mb-8">
          The Ontario Educational Research Consortium (OERC) operates through a collaborative and transparent governance model that reflects our commitment to accountability, integrity, and educational excellence. Our structure ensures that decisions are made responsibly and in alignment with the needs of educators, learners, and research partners.
        </p>

        <div className="mb-10">
          <h3 className="text-xl font-bold text-slate-900 mb-4 text-brand-700">Board of Directors</h3>
          <p className="text-slate-600 mb-4">
            The Board of Directors provides strategic direction, oversees organizational operations, and ensures alignment with OERC’s mission and long-term goals.
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-bold text-slate-900 mb-4 text-brand-700">Advisory Committees</h3>
          <p className="text-slate-600 mb-4">
            OERC may establish advisory committees to support specific areas such as research, membership, professional development, and partnerships.
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-bold text-slate-900 mb-4 text-brand-700">Membership Structure</h3>
          <p className="text-slate-600 mb-4">
            OERC maintains a collaborative membership model that includes educators, institutions, and partners who support our mission. Members contribute to and benefit from shared research, professional networks, and consortium activities.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4 text-brand-700">Operational Structure</h3>
          <p className="text-slate-600 mb-4">
            OERC’s day-to-day operations are supported by designated roles and functions within the organization, ensuring efficient implementation of programs, management of member services, and coordination of research activities.
          </p>
          <p className="text-slate-600 font-semibold mb-2">These functions may include:</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>Administration</li>
            <li>Research coordination</li>
            <li>Membership support</li>
            <li>Communications</li>
            <li>Program development</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ResearchPage: React.FC<{ initialPapers: ResearchPaper[], setPapers: (papers: ResearchPaper[]) => void }> = ({ initialPapers, setPapers }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);

  // Extract unique tags from current papers
  const availableTags = Array.from(new Set(initialPapers.flatMap(p => p.tags || []))).sort();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchTerm;
    if (!query.trim()) return;

    setLoading(true);
    setSelectedTags([]); 
    setSelectedPaper(null); 

    // Combine current papers with new AI fetched ones for the session
    const results = await fetchResearchPapers(query);
    if (results && results.length > 0) {
      setPapers([...results, ...initialPapers]); // Prepend new results
    }
    setLoading(false);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const displayedPapers = selectedTags.length > 0
    ? initialPapers.filter(p => selectedTags.every(tag => p.tags?.includes(tag)))
    : initialPapers;

  if (selectedPaper) {
    return (
      <div className="py-12 bg-slate-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => setSelectedPaper(null)}
            className="flex items-center text-brand-600 font-medium hover:underline mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Research Library
          </button>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="h-64 md:h-80 overflow-hidden relative">
              <img 
                src={selectedPaper.imageUrl || "https://picsum.photos/seed/default/1200/400"} 
                alt={selectedPaper.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-6 left-6 md:left-10 text-white">
                 <div className="flex gap-2 mb-3">
                   {selectedPaper.tags?.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-brand-600/90 backdrop-blur-sm text-xs font-bold rounded uppercase tracking-wide">
                        {tag}
                      </span>
                   ))}
                 </div>
                 <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight">{selectedPaper.title}</h1>
              </div>
            </div>

            <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="lg:col-span-2 space-y-8">
                  <div className="flex items-center text-slate-500 text-sm border-b border-slate-100 pb-6">
                      <User className="h-4 w-4 mr-2" />
                      <span className="mr-6 font-medium text-slate-900">{selectedPaper.author}</span>
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(selectedPaper.date).toLocaleDateString()}</span>
                  </div>

                  <div>
                     <h3 className="text-xl font-bold text-slate-900 mb-4">Abstract</h3>
                     <p className="text-slate-600 leading-relaxed text-lg">
                       {selectedPaper.abstract}
                     </p>
                     <p className="text-slate-600 leading-relaxed mt-4">
                       {/* Placeholder for full content */}
                       This paper explores the theoretical underpinnings and practical applications of the subject matter. It draws upon a wide range of case studies and empirical data to formulate its conclusions. The findings suggest significant implications for educators and policymakers alike, offering a roadmap for future development in this critical area of study.
                     </p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                     <h3 className="font-bold text-slate-900 mb-4">Actions</h3>
                     <a 
                       href={selectedPaper.pdfUrl || "#"} 
                       target="_blank"
                       rel="noopener noreferrer"
                       className="w-full flex items-center justify-center bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-sm mb-3"
                     >
                       <Download className="h-5 w-5 mr-2" />
                       View Paper (PDF)
                     </a>
                     <p className="text-xs text-slate-500 text-center">
                        Available for educational use under CC-BY license.
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Research Library</h1>
            <p className="text-slate-600 mb-8">Search our AI-powered database or browse by topic.</p>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full lg:w-64 shrink-0 space-y-8">
                    {/* Search Widget */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4">Search</h3>
                        <form onSubmit={(e) => handleSearch(e)} className="relative">
                          <input 
                              type="text" 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Keywords..." 
                              className="w-full pl-3 pr-10 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                          <button type="submit" className="absolute right-2 top-2 text-slate-400 hover:text-brand-600">
                              <Search className="h-4 w-4" />
                          </button>
                        </form>
                    </div>

                    {/* Filter by Tag (Current Results) */}
                    {availableTags.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-900">Filter Results</h3>
                                {selectedTags.length > 0 && (
                                    <button onClick={() => setSelectedTags([])} className="text-xs text-brand-600 hover:underline">Clear</button>
                                )}
                            </div>
                            <div className="space-y-3">
                                {availableTags.map(tag => (
                                    <label key={tag} className="flex items-start space-x-3 cursor-pointer group">
                                        <div className="relative flex items-center h-5">
                                            <input 
                                                type="checkbox"
                                                checked={selectedTags.includes(tag)}
                                                onChange={() => handleTagToggle(tag)}
                                                className="peer h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 focus:ring-2 focus:ring-offset-0 transition-all cursor-pointer"
                                            />
                                        </div>
                                        <span className={`text-sm leading-tight group-hover:text-brand-700 transition-colors ${selectedTags.includes(tag) ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                            {tag}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <Loader2 className="h-12 w-12 text-brand-600 animate-spin mb-4" />
                            <p className="text-slate-600">Curating research papers...</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-slate-500">
                                Showing {displayedPapers.length} results
                                {selectedTags.length > 0 && <span> matching <strong>all {selectedTags.length}</strong> selected topic(s)</span>}
                            </div>
                            
                            {displayedPapers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {displayedPapers.map((paper, idx) => (
                                        <ResearchCard 
                                          key={paper.id || idx} 
                                          paper={paper} 
                                          onClick={(p) => setSelectedPaper(p)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
                                    <p className="text-slate-500">No papers found matching all selected criteria.</p>
                                    <button onClick={() => setSelectedTags([])} className="mt-4 text-brand-600 font-medium hover:underline">
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

// --- Admin Component (New) ---

const AdminDashboard: React.FC<{ 
  papers: ResearchPaper[], 
  setPapers: React.Dispatch<React.SetStateAction<ResearchPaper[]>> 
}> = ({ papers, setPapers }) => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'upload' | 'list'>('list');
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newAbstract, setNewAbstract] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Check for existing session
    getCurrentUser().then(u => setUser(u));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { data, error } = await signIn(email, password);
    if (error) {
      setAuthError(error.message);
    } else {
      setUser(data.user);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthor || !newFile) return;

    setUploading(true);
    
    // Parse tags from comma separated string
    const tagsArray = newTags.split(',').map(t => t.trim()).filter(t => t.length > 0);

    // Call Supabase Service
    const uploadedPaper = await uploadPaperToLibrary(newTitle, newAuthor, newAbstract, newFile, newImage, tagsArray);

    if (uploadedPaper) {
      setPapers(prev => [uploadedPaper, ...prev]);
      alert("Paper uploaded successfully!");
      setNewTitle('');
      setNewAuthor('');
      setNewAbstract('');
      setNewTags('');
      setNewFile(null);
      setNewImage(null);
      setActiveTab('list');
    } else {
      alert("Failed to upload paper. Ensure you are logged in and file is valid.");
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this paper?")) {
      const success = await deletePaper(id);
      if (success) {
        setPapers(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Failed to delete paper.");
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-brand-100 p-3 rounded-full">
               <Lock className="h-6 w-6 text-brand-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Admin Login</h2>
          {authError && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">
              {authError}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <button type="submit" className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-slate-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
             <span className="text-sm text-slate-500 hidden md:inline">{user.email}</span>
             <button onClick={handleLogout} className="text-slate-500 hover:text-red-600">Logout</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
             <button 
               onClick={() => setActiveTab('list')}
               className={`px-6 py-4 font-medium text-sm ${activeTab === 'list' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
             >
               Manage Papers
             </button>
             <button 
               onClick={() => setActiveTab('upload')}
               className={`px-6 py-4 font-medium text-sm ${activeTab === 'upload' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
             >
               Upload New Paper
             </button>
          </div>

          <div className="p-8">
            {activeTab === 'list' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-500 text-sm border-b border-slate-100">
                      <th className="py-3 font-medium">Title</th>
                      <th className="py-3 font-medium">Author</th>
                      <th className="py-3 font-medium">Date</th>
                      <th className="py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {papers.map(paper => (
                      <tr key={paper.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-4 pr-4 font-medium text-slate-900">{paper.title}</td>
                        <td className="py-4 text-slate-600">{paper.author}</td>
                        <td className="py-4 text-slate-500 text-sm">{new Date(paper.date).toLocaleDateString()}</td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => handleDelete(paper.id)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <form onSubmit={handleUpload} className="max-w-2xl mx-auto space-y-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Paper Title</label>
                   <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Author Name</label>
                   <input required value={newAuthor} onChange={e => setNewAuthor(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Abstract</label>
                   <textarea required rows={4} value={newAbstract} onChange={e => setNewAbstract(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Paper PDF</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors h-32 flex flex-col items-center justify-center">
                            <input 
                                type="file" 
                                accept="application/pdf"
                                onChange={e => setNewFile(e.target.files ? e.target.files[0] : null)}
                                className="hidden" 
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                                <Upload className="h-6 w-6 text-brand-400 mb-2" />
                                <span className="text-brand-600 font-medium hover:underline text-sm">Upload PDF</span>
                                {newFile && <span className="text-xs text-green-600 mt-1 font-medium truncate max-w-[200px]">{newFile.name}</span>}
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image (Optional)</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors h-32 flex flex-col items-center justify-center">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={e => setNewImage(e.target.files ? e.target.files[0] : null)}
                                className="hidden" 
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                                <ImageIcon className="h-6 w-6 text-brand-400 mb-2" />
                                <span className="text-brand-600 font-medium hover:underline text-sm">Upload Image</span>
                                {newImage && <span className="text-xs text-green-600 mt-1 font-medium truncate max-w-[200px]">{newImage.name}</span>}
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Tags (Comma Separated)</label>
                   <input value={newTags} onChange={e => setNewTags(e.target.value)} placeholder="e.g. Literacy, STEM, Policy" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                </div>

                <button 
                  type="submit" 
                  disabled={uploading}
                  className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {uploading ? <Loader2 className="animate-spin h-5 w-5" /> : "Upload to Library"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Updated Membership Page with Mock Stripe ---

const MembershipPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate Redirect to Stripe
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      window.scrollTo(0, 0);
    }, 2000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-slate-50 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Welcome to OERC!</h2>
        <p className="text-slate-600 max-w-md mb-8">
          Your payment was successful and your <strong>Standard Membership</strong> is now active. 
          We've sent a welcome packet to your email.
        </p>
        <button 
          onClick={() => setSubmitted(false)} 
          className="text-brand-600 font-semibold hover:underline"
        >
          Register another member
        </button>
      </div>
    );
  }

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Get Involved</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Become part of a community working to improve education in Ontario. Simple, standard membership for all educators and researchers.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Application Form */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-8">
              <div className="bg-brand-600 p-6 text-white text-center">
                <h2 className="text-xl font-bold flex items-center justify-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Membership Registration
                </h2>
              </div>
              
              <form onSubmit={handlePayment} className="p-8 md:p-12 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      First Name
                    </label>
                    <input required type="text" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input required type="text" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input required type="email" placeholder="you@example.com" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Institution / Organization (Optional)</label>
                    <input type="text" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" placeholder="e.g. Toronto District School Board" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Job Title / Role (Optional)</label>
                    <input type="text" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" placeholder="e.g. Principal, PhD Student" />
                  </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Website URL (Optional)</label>
                    <input type="url" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all" placeholder="https://" />
                </div>

                <div className="pt-4 space-y-4">
                  <label className="flex items-start cursor-pointer">
                    <input type="checkbox" required className="mt-1 h-4 w-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500" />
                    <span className="ml-3 text-sm text-slate-600">
                      I have read and agree to the{' '}
                      <button 
                        type="button" 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          setShowPrivacyModal(true); 
                        }} 
                        className="text-brand-600 hover:underline font-medium focus:outline-none"
                      >
                        Privacy Policy
                      </button>.
                    </span>
                  </label>

                  <label className="flex items-start cursor-pointer">
                    <input type="checkbox" className="mt-1 h-4 w-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500" />
                    <span className="ml-3 text-sm text-slate-600">
                      I subscribe to the OERC newsletter and updates.
                    </span>
                  </label>
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-brand-700 text-white font-bold text-lg rounded-xl hover:bg-brand-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Processing via Stripe...
                    </>
                  ) : (
                    <>
                      Pay Membership Fee - $50 CAD
                    </>
                  )}
                </button>
                <div className="mt-4 text-xs text-slate-500 text-center space-y-1">
                  <p>Secure payment via Stripe. Membership renews automatically every year.</p>
                  <p>To cancel, please contact administration. Payments are non-refundable once processed.</p>
                </div>
              </form>
            </div>
            
          </div>

          {/* Benefits Section (Right Sidebar) */}
          <div className="lg:w-80 xl:w-96 shrink-0">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
                <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">Membership Benefits</h2>
                <div className="space-y-6">
                   <div className="flex items-start">
                      <div className="bg-brand-100 p-3 rounded-full text-brand-600 mr-4 shrink-0">
                         <Users className="h-5 w-5" />
                      </div>
                      <div>
                         <h3 className="font-bold text-base mb-1">Network</h3>
                         <p className="text-slate-600 text-sm">Connect with peers and leaders in the field.</p>
                      </div>
                   </div>
                   <div className="flex items-start">
                      <div className="bg-brand-100 p-3 rounded-full text-brand-600 mr-4 shrink-0">
                         <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                         <h3 className="font-bold text-base mb-1">Resources</h3>
                         <p className="text-slate-600 text-sm">Access exclusive research papers and data sets.</p>
                      </div>
                   </div>
                   <div className="flex items-start">
                      <div className="bg-brand-100 p-3 rounded-full text-brand-600 mr-4 shrink-0">
                         <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                         <h3 className="font-bold text-base mb-1">Events</h3>
                         <p className="text-slate-600 text-sm">Priority registration for conferences and workshops.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Mailing List Subscription */}
        <div className="max-w-4xl mx-auto bg-brand-900 rounded-2xl p-8 md:p-12 text-center text-white mb-20 mt-8">
            <div className="flex justify-center mb-6">
                <div className="bg-brand-800 p-4 rounded-full">
                    <Mail className="h-8 w-8 text-brand-300" />
                </div>
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">Subscribe to our Mailing List</h2>
            <p className="text-brand-100 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter to receive latest updates.
            </p>
            {newsletterSuccess ? (
                <div className="bg-green-500/20 border border-green-500/50 text-green-100 px-6 py-4 rounded-lg inline-flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    <span>Subscribed successfully! Check your inbox.</span>
                </div>
            ) : (
                <div className="max-w-md mx-auto">
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 mb-4">
                        <input 
                            type="email" 
                            required
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            placeholder="Enter your email address" 
                            className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-400" 
                        />
                        <button type="submit" className="bg-brand-500 hover:bg-brand-400 text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-lg">
                            Subscribe
                        </button>
                    </form>
                    <p className="text-xs text-brand-300">
                        To cancel subscription please contact us at contact@oerc.org
                    </p>
                </div>
            )}
        </div>
        
      </div>
      
      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowPrivacyModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
             {/* Header */}
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <h2 className="text-2xl font-serif font-bold text-slate-900">Privacy Policy</h2>
                <button onClick={() => setShowPrivacyModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                   <X className="h-5 w-5 text-slate-500" />
                </button>
             </div>
             
             {/* Content */}
             <div className="p-6 md:p-10 overflow-y-auto">
                <PrivacyPolicyContent />
             </div>

             {/* Footer */}
             <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end">
                <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors"
                >
                  Close & Continue Registration
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Contact: React.FC = () => (
  <div className="py-20 bg-slate-50 min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-serif font-bold text-slate-900 mb-12 text-center">Contact Us</h1>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
         {/* Image Section */}
         <div className="md:w-1/2 h-64 md:h-auto">
            <img 
              src="https://picsum.photos/seed/oerc_office/800/800" 
              alt="OERC Office" 
              className="w-full h-full object-cover"
            />
         </div>

         {/* Info Section */}
         <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="space-y-8">
               <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Get in Touch</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    We are always looking to collaborate with educators and researchers. Reach out to us for general inquiries or partnership opportunities.
                  </p>
                  
                  <div className="flex items-center text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                     <Mail className="h-5 w-5 mr-3 text-brand-600" />
                     <span className="font-medium">contact@oerc.org</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  </div>
);

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is the primary mission of the OERC?",
      a: "The Ontario Educational Research Consortium (OERC) is dedicated to bridging the gap between academic educational research and classroom practice. We aggregate, synthesize, and disseminate high-quality research to empower educators and improve student outcomes across Ontario."
    },
    {
      q: "How can I become a member of the OERC?",
      a: "Membership is open to all educators, researchers, and educational institutions. You can apply through our 'Get Involved' page. We offer standard individual memberships as well as institutional packages."
    },
    {
      q: "Is the research library accessible to everyone?",
      a: "Yes, our core mission is open access. The majority of our research summaries and reports are available to the public for free. However, full access to certain datasets, detailed analytics, and some peer-reviewed journals is reserved for registered members."
    },
    {
      q: "How does OERC select research papers for its library?",
      a: "Our research committee reviews papers based on relevance to the Ontario curriculum, methodological rigor, and potential for practical application. We source from peer-reviewed journals, university repositories, and government reports."
    },
    {
      q: "Can I submit my own research to the OERC?",
      a: "Absolutely. We encourage submissions from local educators and researchers. Please contact our research coordination team at contact@oerc.org for submission guidelines and the peer review process."
    },
    {
      q: "Do you offer professional development opportunities?",
      a: "Yes, we host regular webinars, workshops, and an annual research symposium. These events are designed to help educators understand and apply research findings in their practice."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h1>
        <p className="text-slate-600 text-center mb-12 max-w-xl mx-auto">
          Common questions about our consortium, research access, and membership benefits.
        </p>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <button 
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-slate-50 transition-colors"
              >
                <span className={`font-bold text-lg ${openIndex === index ? 'text-brand-700' : 'text-slate-900'}`}>
                  {faq.q}
                </span>
                {openIndex === index ? (
                  <Minus className="h-5 w-5 text-brand-600 shrink-0 ml-4" />
                ) : (
                  <Plus className="h-5 w-5 text-slate-400 shrink-0 ml-4" />
                )}
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-2">Still need help?</h3>
          <p className="text-slate-600 mb-4">Contact us at contact@oerc.ca</p>
        </div>
      </div>
    </div>
  );
};

const EventsPage: React.FC = () => {
  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-12 text-center">Upcoming Events</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* OERC Events */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-200 pb-2">
              <Calendar className="h-6 w-6 mr-2 text-brand-600" />
              OERC Events
            </h2>
            <div className="space-y-6">
              {EVENTS.map((event) => (
                <div key={event.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
                    <div className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-slate-600 mb-4 leading-relaxed">{event.description}</p>
                  <div className="flex items-center text-sm text-slate-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                </div>
              ))}
              {EVENTS.length === 0 && <p className="text-slate-500 italic">No upcoming OERC events scheduled.</p>}
            </div>
          </div>

          {/* Global Conferences */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-200 pb-2">
              <Globe className="h-6 w-6 mr-2 text-brand-600" />
              Global Conferences
            </h2>
            <div className="space-y-6">
              {GLOBAL_CONFERENCES.map((conf) => (
                <div key={conf.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-200 group-hover:bg-brand-500 transition-colors"></div>
                  <div className="pl-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{conf.title}</h3>
                      <a href={conf.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-600 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    <div className="flex items-center text-xs text-brand-600 font-semibold mb-3 uppercase tracking-wide">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="mr-3">{new Date(conf.date).toLocaleDateString()}</span>
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{conf.location}</span>
                    </div>
                    <p className="text-slate-600 text-sm">{conf.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 bg-brand-900 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl font-serif font-bold mb-4">Host an Event?</h2>
          <p className="text-brand-100 mb-8 max-w-2xl mx-auto">
            OERC members can propose workshops or submit events to our calendar. Reach out to our coordination team.
          </p>
          <button className="bg-white text-brand-900 font-bold px-8 py-3 rounded-lg hover:bg-brand-50 transition-colors">
            Submit Event Proposal
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  // Lift paper state to App level so Admin changes reflect across the app
  const [papers, setPapers] = useState<ResearchPaper[]>([]);

  useEffect(() => {
    // Load initial papers from Supabase
    getPapers().then(data => {
      setPapers(data);
    });
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME: return <Home setCurrentPage={setCurrentPage} papers={papers} />;
      case Page.ABOUT: return <About />;
      case Page.RESEARCH: return <ResearchPage initialPapers={papers} setPapers={setPapers} />;
      case Page.EVENTS: return <EventsPage />;
      case Page.MEMBERSHIP: return <MembershipPage onNavigate={setCurrentPage} />;
      case Page.FAQ: return <FAQPage />;
      case Page.CONTACT: return <Contact />;
      case Page.PRIVACY: return <PrivacyPolicyPage />;
      case Page.ADMIN: return <AdminDashboard papers={papers} setPapers={setPapers} />;
      default: return <Home setCurrentPage={setCurrentPage} papers={papers} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
      <AIAssistant />
    </div>
  );
};

export default App;