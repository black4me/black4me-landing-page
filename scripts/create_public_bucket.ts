
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets?.find(b => b.name === 'public')) {
    await supabaseAdmin.storage.createBucket('public', { public: true });
    console.log('Public bucket created');
  } else {
    console.log('Public bucket already exists');
  }
}
main();

