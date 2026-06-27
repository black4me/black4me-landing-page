/**
 * Activepieces Integration
 * This file handles sending events to Activepieces Webhooks.
 * The Webhook URLs should be defined in your .env.local file.
 */

export const sendToActivepieces = async (webhookUrl: string | undefined, payload: any) => {
  if (!webhookUrl) {
    console.warn('Activepieces Webhook URL is not defined. Skipping automation.');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Activepieces Webhook Error: ${response.status} ${response.statusText}`);
    } else {
      console.log('Successfully sent event to Activepieces.');
    }
  } catch (error) {
    console.error('Failed to send event to Activepieces:', error);
  }
};
