import {createClient} from '@supabase/supabase-js'
// Not used by the demo yet. Wire the store actions to these tables (see supabase/schema.sql).
export const supabase=import.meta.env.VITE_SUPABASE_URL?createClient(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_ANON_KEY):null
