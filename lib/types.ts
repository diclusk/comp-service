export type Service = {
  slug: string;
  name: string;
  tagline: string;
  price: string;
  duration: string;
  icon: string;
  accent: 'volt' | 'punch' | 'cyber';
  points: string[];
};

export type DeviceInfo = {
  brand?: string;
  model?: string;
  os?: string;
  version?: string;
  [key: string]: string | undefined;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  device_info?: DeviceInfo | null;
  budget?: number | null;
  qualified: boolean;
  status?: 'pending' | 'qualified' | 'booked' | 'completed';
  notes?: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type Booking = {
  id: string;
  name?: string;
  phone?: string;
  email?: string | null;
  device_type?: string | null;
  service_type: string;
  description?: string | null;
  scheduled_date: string;
  status: 'pending' | 'confirmed' | 'in progress' | 'completed' | 'cancelled';
  customer_id?: string;
  guest_session_id?: string | null;
  customers?: { name: string; phone: string } | null;
  created_at?: string;
};

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ChatSession = {
  id: string;
  guest_session_id?: string | null;
  customer_id?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  status: 'bot' | 'handed_off' | 'closed';
  last_message_at: string;
  created_at: string;
};

export type ChatSessionMessage = {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'admin';
  content: string;
  created_at: string;
};