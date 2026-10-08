// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for verifiable claims: client testimonials and headline numbers.
// ─────────────────────────────────────────────────────────────────────────────

export interface Testimonial {
  name: string;
  company: string;
  text: string;
  rating?: number;
  avatar: string;
  verified?: boolean;
}

export interface Stat {
  value: string;
  label: string;
  verified?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Daniel Reyes',
    company: 'Everline Trading Co.',
    text: 'With AsreSEO, our Google rankings improved dramatically. Our online sales grew significantly.',
    rating: 5,
    avatar: '👨‍💼',
    verified: false,
  },
  {
    name: 'Sofia Bennett',
    company: 'Velvet & Rose Boutique',
    text: 'Our new website turned out great. Site speed improved and the user experience is better. Customers are happier.',
    rating: 5,
    avatar: '👩‍💼',
    verified: false,
  },
  {
    name: 'Marcus Webb',
    company: 'Cornerstone Builders',
    text: 'Their Google Ads campaign was excellent. We received many quality leads and won many new projects.',
    rating: 5,
    avatar: '👨‍🏗️',
    verified: false,
  },
  {
    name: 'Emily Hart',
    company: 'Lumen Aesthetics Clinic',
    text: 'The chatbot they designed for us helped a lot. We now respond to customers around the clock.',
    rating: 5,
    avatar: '👩‍⚕️',
    verified: false,
  },
  {
    name: 'David Cole',
    company: 'Harvest Table Restaurants',
    text: 'They completely transformed our social media management. Our followers and customers grew substantially.',
    rating: 5,
    avatar: '👨‍🍳',
    verified: false,
  },
  {
    name: 'Anna Kowalski',
    company: 'Bright Path Academy',
    text: 'The AI-generated content was high quality. It saved us a lot of time.',
    rating: 5,
    avatar: '👩‍🏫',
    verified: false,
  },
];

export const TESTIMONIALS_EN: Testimonial[] = TESTIMONIALS;

export const HEADLINE_STATS: Stat[] = [
  { value: '500+', label: 'Happy clients', verified: false },
  { value: '98%', label: 'Satisfaction rate', verified: false },
  { value: '500%', label: 'Average sales growth', verified: false },
  { value: '24/7', label: 'Support', verified: true },
];

export const HEADLINE_STATS_EN: Stat[] = HEADLINE_STATS;

export const PROSE_STATS = {
  yearsExperience: '5',
  projectsCompleted: '500',
  averageGrowth: '300',
  verified: false,
} as const;
