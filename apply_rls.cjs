const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:Adc7aQINEW1oG389@db.rgfiszmnxktetnahufpm.supabase.co:5432/postgres'
});
async function run() {
  await client.connect();
  const query = `
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admin can select orders" ON public.orders;
CREATE POLICY "Only admin can select orders" 
ON public.orders FOR SELECT 
USING (auth.jwt() ->> 'email' IN ('info@black4me.com', 'black4mestore@gmail.com'));

DROP POLICY IF EXISTS "Allow public insert consultations" ON public.consultations;
CREATE POLICY "Allow public insert consultations" 
ON public.consultations FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Only admin can select consultations" ON public.consultations;
CREATE POLICY "Only admin can select consultations" 
ON public.consultations FOR SELECT 
USING (auth.jwt() ->> 'email' IN ('info@black4me.com', 'black4mestore@gmail.com'));

DROP POLICY IF EXISTS "Allow public insert testimonials" ON public.testimonials;
CREATE POLICY "Allow public insert testimonials" 
ON public.testimonials FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read testimonials" ON public.testimonials;
CREATE POLICY "Allow public read testimonials" 
ON public.testimonials FOR SELECT 
USING (true);
  `;
  try {
    await client.query(query);
    console.log('RLS Policies applied successfully!');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
run();
