import { createClient } from '@supabase/supabase-js';
import ConsultationsClient from './ConsultationsClient';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export default async function ConsultationsPage() {
  const { data: consultations } = await supabase
    .from('consultations')
    .select('*')
    .order('start_time', { ascending: false });

  const stats = {
    total:       consultations?.length ?? 0,
    confirmed:   consultations?.filter(c => c.status === 'confirmed').length ?? 0,
    cancelled:   consultations?.filter(c => c.status === 'cancelled').length ?? 0,
    rescheduled: consultations?.filter(c => c.status === 'rescheduled').length ?? 0,
  };

  return <ConsultationsClient consultations={consultations ?? []} stats={stats} />;
}
