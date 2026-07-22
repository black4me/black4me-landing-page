import { NextResponse } from 'next/server';
import { trackEvent } from '../../../server/actions/tracking';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventType, event_name, metadata, lead_id, session_id, parameters, userEmail } = body;

    const finalEventType = eventType || event_name;
    const finalParams = parameters || metadata || {};
    
    if (session_id) finalParams.session_id = session_id;
    if (lead_id) finalParams.lead_id = lead_id;

    if (!finalEventType) {
      return NextResponse.json({ error: 'Missing eventType' }, { status: 400 });
    }

    const result = await trackEvent({
      eventType: finalEventType,
      parameters: finalParams,
      userEmail: userEmail,
      utmSource: finalParams.utm_source,
      utmMedium: finalParams.utm_medium,
      utmCampaign: finalParams.utm_campaign,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('CRM Tracking API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
