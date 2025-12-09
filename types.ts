
export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  mimeType: string;
  data: string; // base64
  name: string;
  loading?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

// Types for other pages
export interface LibraryItem {
  id: string;
  title: string;
  type: 'article' | 'document' | 'summary';
  date: string;
  tags: string[];
  isPinned?: boolean;
  url?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'archived';
  tasks: number;
  files: number;
  lastActive: string;
}

export interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'reward' | 'subscription' | 'training';
  title: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface Referral {
  id: string;
  name: string;
  date: string;
  plan: 'Free' | 'Pro' | 'Max';
  reward: number;
  status: 'pending' | 'qualified' | 'paid';
}
