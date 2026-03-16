import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://usrjlwwdirybxquzozzn.supabase.co"
const supabaseKey = "sb_publishable_KXjXS038wyTOAi1y5qxkqg_mlFULOFC"

export const supabase = createClient(supabaseUrl, supabaseKey)