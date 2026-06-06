export interface SocialLink {
  type: 'github' | 'email' | 'twitter' | 'linkedin' | 'website';
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  stars?: number;
  imageGradient: string;
}

export interface Experience {
  id: string;
  type: 'work' | 'education';
  title: string;
  organization: string;
  period: string;
  description: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  likes: number;
  views: number;
  readingTime: number;
}

export interface ProfileData {
  id: string;
  name: string;
  headline: string;
  bio: string;
  avatar: string;
  banner?: string;
  location: string;
  role: string;
  yearsOfExp: number;
  followers: number;
  following: number;
  skills: string[];
  socialLinks: SocialLink[];
  experience: Experience[];
  projects: Project[];
  posts: Post[];
}

export interface Job {
  id: string;
  company: string;
  logo: string;
  title: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary: string;
  tags: string[];
  description: string;
  posted: string;
  featured?: boolean;
}

export interface ExploreProfile {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  location: string;
  skills: string[];
  followers: number;
}

export const sampleJobs: Job[] = [];

export const exploreProfiles: ExploreProfile[] = [];

/* ─────────────────────────────────────────────
   Follow connections
   ───────────────────────────────────────────── */
export interface FollowUser {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  isFollowing: boolean;
}

export const sampleFollowers: FollowUser[] = [];
export const sampleFollowing: FollowUser[] = [];

/* ─────────────────────────────────────────────
   Company pages
   ───────────────────────────────────────────── */
export interface CompanyOpening {
  id: string;
  title: string;
  location: string;
  type: string;
  tags: string[];
}

export interface CompanyMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Company {
  id: string;
  name: string;
  tagline: string;
  logoGradient: string;
  coverGradient: string;
  logoImage?: string;
  coverImage?: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  about: string;
  founded: string;
  followers: number;
  isManaged: boolean;
  openings: CompanyOpening[];
  members: CompanyMember[];
}

const NAVY_COVER = 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1a56db 100%)';

export const sampleCompanies: Company[] = [];

/* ─────────────────────────────────────────────
   Empty profile factory
   ───────────────────────────────────────────── */
export function createEmptyProfile(): ProfileData {
  return {
    id: 'me',
    name: '',
    headline: '',
    bio: '',
    avatar: '',
    location: '',
    role: '',
    yearsOfExp: 0,
    followers: 0,
    following: 0,
    skills: [],
    socialLinks: [],
    experience: [],
    projects: [],
    posts: [],
  };
}

export function createEmptyCompany(): Company {
  return {
    id: 'comp-' + Date.now(),
    name: '',
    tagline: '',
    logoGradient: 'linear-gradient(135deg, #1a56db 0%, #6366f1 100%)',
    coverGradient: NAVY_COVER,
    industry: '',
    size: '1-10명',
    location: '',
    website: '',
    about: '',
    founded: String(new Date().getFullYear()),
    followers: 0,
    isManaged: true,
    openings: [],
    members: [],
  };
}
