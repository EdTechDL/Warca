import { supabase } from '../supabaseClient';
import { ResearchPaper } from '../types';

// Mock papers for demo when Supabase isn't configured
const DEMO_PAPERS: ResearchPaper[] = [
  {
    id: 'demo-1',
    title: 'The Impact of Digital Learning Tools on Student Engagement in Ontario Classrooms',
    author: 'Dr. Sarah Chen',
    date: '2024-03-15',
    abstract: 'This study examines how digital learning tools affect student engagement across 50 Ontario elementary schools. Our findings indicate a 23% increase in active participation when interactive technologies are integrated thoughtfully into lesson plans.',
    tags: ['Technology', 'Engagement', 'Elementary Education'],
    imageUrl: 'https://picsum.photos/seed/edu1/800/400',
  },
  {
    id: 'demo-2',
    title: 'Addressing Learning Gaps: Evidence-Based Interventions for Post-Pandemic Recovery',
    author: 'Prof. Michael Torres',
    date: '2024-02-28',
    abstract: 'Following the COVID-19 pandemic, many students experienced significant learning gaps. This paper reviews 15 evidence-based intervention strategies and their effectiveness in Ontario secondary schools.',
    tags: ['Learning Recovery', 'Interventions', 'Secondary Education'],
    imageUrl: 'https://picsum.photos/seed/edu2/800/400',
  },
  {
    id: 'demo-3',
    title: 'Culturally Responsive Teaching Practices in Diverse Urban Classrooms',
    author: 'Dr. Amira Hassan',
    date: '2024-01-20',
    abstract: 'This qualitative study explores how educators in diverse urban settings implement culturally responsive teaching practices. Findings highlight key strategies for improving educational equity and student belonging.',
    tags: ['Equity', 'Diversity', 'Urban Education'],
    imageUrl: 'https://picsum.photos/seed/edu3/800/400',
  },
  {
    id: 'demo-4',
    title: 'AI-Assisted Assessment: Opportunities and Ethical Considerations',
    author: 'Dr. James Liu',
    date: '2024-04-10',
    abstract: 'As artificial intelligence becomes more prevalent in educational settings, this paper examines both the potential benefits of AI-assisted assessment and the ethical considerations educators must address.',
    tags: ['AI in Education', 'Assessment', 'Ethics'],
    imageUrl: 'https://picsum.photos/seed/edu4/800/400',
  },
  {
    id: 'demo-5',
    title: 'Early Literacy Interventions: A Meta-Analysis of Phonics-Based Programs',
    author: 'Dr. Emily Watson',
    date: '2024-03-01',
    abstract: 'This meta-analysis reviews 42 studies on phonics-based literacy interventions for early readers. Results support structured literacy approaches with significant effect sizes for struggling readers.',
    tags: ['Literacy', 'Early Childhood', 'Phonics'],
    imageUrl: 'https://picsum.photos/seed/edu5/800/400',
  },
  {
    id: 'demo-6',
    title: 'Teacher Well-being and Retention: Building Sustainable Education Systems',
    author: 'Prof. David Kim',
    date: '2024-02-15',
    abstract: 'Examining factors contributing to teacher burnout and retention, this study provides actionable recommendations for school administrators to support educator well-being and reduce turnover.',
    tags: ['Teacher Wellness', 'Retention', 'Policy'],
    imageUrl: 'https://picsum.photos/seed/edu6/800/400',
  },
];

/**
 * Fetch all papers from Supabase
 * Falls back to demo data if Supabase isn't configured
 */
export async function getPapers(): Promise<ResearchPaper[]> {
  try {
    const { data, error } = await supabase
      .from('papers')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.warn('Supabase error, using demo data:', error.message);
      return DEMO_PAPERS;
    }

    if (!data || data.length === 0) {
      return DEMO_PAPERS;
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      author: item.author,
      date: item.date,
      abstract: item.abstract,
      tags: item.tags || [],
      imageUrl: item.image_url,
      pdfUrl: item.pdf_url,
    }));
  } catch (err) {
    console.warn('Failed to fetch from Supabase, using demo data');
    return DEMO_PAPERS;
  }
}

/**
 * Upload a paper to the library
 */
export async function uploadPaperToLibrary(
  title: string,
  author: string,
  abstract: string,
  pdfFile: File,
  imageFile: File | null,
  tags: string[]
): Promise<ResearchPaper | null> {
  try {
    // Upload PDF
    const pdfPath = `papers/${Date.now()}_${pdfFile.name}`;
    const { error: pdfError } = await supabase.storage
      .from('research-papers')
      .upload(pdfPath, pdfFile);

    if (pdfError) {
      console.error('PDF upload error:', pdfError);
      return null;
    }

    const { data: pdfUrlData } = supabase.storage
      .from('research-papers')
      .getPublicUrl(pdfPath);

    let imageUrl = null;
    if (imageFile) {
      const imagePath = `images/${Date.now()}_${imageFile.name}`;
      const { error: imageError } = await supabase.storage
        .from('research-papers')
        .upload(imagePath, imageFile);

      if (!imageError) {
        const { data: imageUrlData } = supabase.storage
          .from('research-papers')
          .getPublicUrl(imagePath);
        imageUrl = imageUrlData.publicUrl;
      }
    }

    // Insert paper record
    const { data, error } = await supabase
      .from('papers')
      .insert({
        title,
        author,
        abstract,
        tags,
        date: new Date().toISOString().split('T')[0],
        pdf_url: pdfUrlData.publicUrl,
        image_url: imageUrl || `https://picsum.photos/seed/${Date.now()}/800/400`,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      author: data.author,
      date: data.date,
      abstract: data.abstract,
      tags: data.tags || [],
      imageUrl: data.image_url,
      pdfUrl: data.pdf_url,
    };
  } catch (err) {
    console.error('Upload failed:', err);
    return null;
  }
}

/**
 * Delete a paper from the library
 */
export async function deletePaper(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('papers').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Delete failed:', err);
    return false;
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign out the current user
 */
export async function signOut() {
  return await supabase.auth.signOut();
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
