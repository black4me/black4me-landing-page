import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function createReceiptsBucket() {
  const { data, error } = await supabaseAdmin.storage.createBucket('receipts', {
    public: false,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
  });

  if (error && error.message !== 'The resource already exists') {
    console.error('Error creating bucket:', error);
  } else {
    console.log('Bucket created or already exists.');
  }
}

createReceiptsBucket();
