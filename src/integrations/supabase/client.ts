// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://htzlsnzfgkuofzfyhadb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0emxzbnpmZ2t1b2Z6ZnloYWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NzA1MDMsImV4cCI6MjA1MTU0NjUwM30.eDv_SNMiLe1F612rOxgyiazn-DK8abfh3fFnIRXfIS0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);