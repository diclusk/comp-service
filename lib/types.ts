// Shared TypeScript types for the FIXKOM_ application.



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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  customers?: { name: string; phone: string } | null;
  created_at?: string;
};

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

