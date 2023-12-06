const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://wwoucxtafkpgzvjrwjye.supabase.co'
const supabaseKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3b3VjeHRhZmtwZ3p2anJ3anllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODk5OTk3MiwiZXhwIjoyMDE0NTc1OTcyfQ.Dvje_hBW4LkZlAKch6KjGpViW4e3aU2tSClpNsAFZpI"

const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase