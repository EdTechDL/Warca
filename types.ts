
export interface ResearchPaper {
  id: string;
  title: string;
  author: string;
  date: string;
  abstract: string;
  tags: string[];
  imageUrl?: string;
  pdfUrl?: string;
  videoUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum Page {
  HOME = 'home',
  ABOUT = 'about',
  RESEARCH = 'research',
  EVENTS = 'events',
  MEMBERSHIP = 'membership',
  FAQ = 'faq',
  CONTACT = 'contact',
  PRIVACY = 'privacy',
  ADMIN = 'admin',
}