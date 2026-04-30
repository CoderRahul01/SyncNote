export type ContentSource = 'youtube' | 'instagram' | 'linkedin' | 'unknown';

export interface InsightNote {
  id: string;
  title: string;
  url: string;
  source: ContentSource;
  timestamp: number;
  takeaways: { text: string; timestamp?: string }[];
  actionItems: { text: string; completed: boolean }[];
  technicalContext: string;
  fullSummary: string;
  folderId?: string;
  executionTrace: { step: string; status: 'completed' | 'processing' | 'verified'; timestamp: string }[];
  verificationStatus: 'verified' | 'unverified' | 'caution';
}

export interface Folder {
  id: string;
  name: string;
  icon?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
