import { ResearchPaper } from '../types';

// Mock research papers for demo purposes
// In production, this would call the Google Gemini API to generate/fetch papers
const MOCK_PAPERS: ResearchPaper[] = [
  {
    id: 'paper-1',
    title: 'The Impact of Digital Learning Tools on Student Engagement in Ontario Classrooms',
    author: 'Dr. Sarah Chen',
    date: '2024-03-15',
    abstract: 'This study examines how digital learning tools affect student engagement across 50 Ontario elementary schools. Our findings indicate a 23% increase in active participation when interactive technologies are integrated thoughtfully into lesson plans.',
    tags: ['Technology', 'Engagement', 'Elementary Education'],
    imageUrl: 'https://picsum.photos/seed/edu1/800/400',
  },
  {
    id: 'paper-2',
    title: 'Addressing Learning Gaps: Evidence-Based Interventions for Post-Pandemic Recovery',
    author: 'Prof. Michael Torres',
    date: '2024-02-28',
    abstract: 'Following the COVID-19 pandemic, many students experienced significant learning gaps. This paper reviews 15 evidence-based intervention strategies and their effectiveness in Ontario secondary schools.',
    tags: ['Learning Recovery', 'Interventions', 'Secondary Education'],
    imageUrl: 'https://picsum.photos/seed/edu2/800/400',
  },
  {
    id: 'paper-3',
    title: 'Culturally Responsive Teaching Practices in Diverse Urban Classrooms',
    author: 'Dr. Amira Hassan',
    date: '2024-01-20',
    abstract: 'This qualitative study explores how educators in diverse urban settings implement culturally responsive teaching practices. Findings highlight key strategies for improving educational equity and student belonging.',
    tags: ['Equity', 'Diversity', 'Urban Education'],
    imageUrl: 'https://picsum.photos/seed/edu3/800/400',
  },
  {
    id: 'paper-4',
    title: 'AI-Assisted Assessment: Opportunities and Ethical Considerations',
    author: 'Dr. James Liu',
    date: '2024-04-10',
    abstract: 'As artificial intelligence becomes more prevalent in educational settings, this paper examines both the potential benefits of AI-assisted assessment and the ethical considerations educators must address.',
    tags: ['AI in Education', 'Assessment', 'Ethics'],
    imageUrl: 'https://picsum.photos/seed/edu4/800/400',
  },
  {
    id: 'paper-5',
    title: 'Early Literacy Interventions: A Meta-Analysis of Phonics-Based Programs',
    author: 'Dr. Emily Watson',
    date: '2024-03-01',
    abstract: 'This meta-analysis reviews 42 studies on phonics-based literacy interventions for early readers. Results support structured literacy approaches with significant effect sizes for struggling readers.',
    tags: ['Literacy', 'Early Childhood', 'Phonics'],
    imageUrl: 'https://picsum.photos/seed/edu5/800/400',
  },
  {
    id: 'paper-6',
    title: 'Teacher Well-being and Retention: Building Sustainable Education Systems',
    author: 'Prof. David Kim',
    date: '2024-02-15',
    abstract: 'Examining factors contributing to teacher burnout and retention, this study provides actionable recommendations for school administrators to support educator well-being and reduce turnover.',
    tags: ['Teacher Wellness', 'Retention', 'Policy'],
    imageUrl: 'https://picsum.photos/seed/edu6/800/400',
  },
];

/**
 * Fetch research papers based on a search query
 * In production, this would integrate with the Google Gemini API
 * For demo purposes, it returns filtered mock data
 */
export async function fetchResearchPapers(query: string): Promise<ResearchPaper[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerQuery = query.toLowerCase();

  // Filter mock papers based on query
  const filteredPapers = MOCK_PAPERS.filter(
    (paper) =>
      paper.title.toLowerCase().includes(lowerQuery) ||
      paper.abstract.toLowerCase().includes(lowerQuery) ||
      paper.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      paper.author.toLowerCase().includes(lowerQuery)
  );

  // If no matches, return some relevant papers anyway
  if (filteredPapers.length === 0) {
    return MOCK_PAPERS.slice(0, 3);
  }

  return filteredPapers;
}

/**
 * Generate AI summary for a research paper
 * In production, this would call the Gemini API
 */
export async function generatePaperSummary(paper: ResearchPaper): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return `This research by ${paper.author} explores ${paper.tags.join(', ').toLowerCase()}. The study presents valuable insights for Ontario educators seeking evidence-based approaches to improving student outcomes.`;
}
