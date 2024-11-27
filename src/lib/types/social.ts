export interface Post {
  id: string;
  author_id: string;
  content: string;
  media_url: string[];
  category: string;
  visibility: 'public' | 'community';
  hashtags: string[];
  mentions: string[];
  created_at: string;
  updated_at: string;
  author?: Profile;
  reactions_count?: {
    like: number;
    wisdom: number;
    helpful: number;
    inspiring: number;
  };
  comments_count?: number;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_comment_id: string | null;
  thread_level: number;
  created_at: string;
  updated_at: string;
  author?: Profile;
  replies?: Comment[];
}

export interface Reaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: 'like' | 'wisdom' | 'helpful' | 'inspiring';
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  post_id?: string;
  comment_id?: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
  updated_at: string;
}

export interface UserTyping {
  id: string;
  user_id: string;
  post_id: string;
  last_typed: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar_url?: string;
  role: string;
}