import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function createProductsBucket() {
  const { data, error } = await supabaseAdmin.storage.createBucket('products', {
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'application/zip', 'application/x-zip-compressed']
  });

  if (error && error.message !== 'The resource already exists') {
    console.error('Error creating bucket:', error);
  } else {
    console.log('Products bucket created or already exists.');
  }
}

createProductsBucket();
