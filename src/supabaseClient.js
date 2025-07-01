// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://toqmufekohkjheslzdrd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvcW11ZmVrb2hramhlc2x6ZHJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjM2NzksImV4cCI6MjA2MDg5OTY3OX0.MphEJjOa17zP9FdqUUfjursbnM_8EaKTrQHh0HaLarc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);