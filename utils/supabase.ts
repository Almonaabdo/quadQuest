import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://elheamdqqxqixdzzhtpy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsaGVhbWRxcXhxaXhkenpodHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTc2NzgsImV4cCI6MjA3OTMzMzY3OH0.IT3eHuuYW8QJ2Qt-briv2FcT2OVBudyK-myqP_iHo24';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});