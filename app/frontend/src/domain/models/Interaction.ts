export interface Interaction {
  _id?: string;
  location_id: string;
  user_email: string;
  type: 'comment' | 'like' | 'visit';
  content?: string;
  created_at?: string;
}

