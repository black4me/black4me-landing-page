export type BlueprintType = 'conversion' | 'retention' | 'anniversary';

export function generateBlueprintHTML(title: string, bodyText: string, type: BlueprintType): string {
  const baseColor = '#111111';
  const accentColor = '#F5C542'; // Gold/Orange
  const textColor = '#dddddd';
  
  let blueprintStructure = '';

  if (type === 'conversion') {
    blueprintStructure = `
      <!-- Conversion Blueprint Structure -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
        <tr>
          <td align="center">
            <h3 style="color: #ffffff; font-size: 22px; letter-spacing: 1px; margin-bottom: 20px;">GIFT-TO-SELF CONVERSION BLUEPRINT</h3>
            <p style="color: #888; font-size: 14px; margin-bottom: 40px; text-transform: uppercase;">Turn Recipients into Lifetime Subscribers</p>
          </td>
        </tr>
        <tr>
          <td align="center">
            <!-- Box 1 -->
            <div style="background-color: #1A1A1A; border: 1px solid rgba(245, 197, 66, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px; width: 80%; max-width: 400px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
              <h4 style="color: ${accentColor}; margin: 0 0 10px 0; font-size: 16px;">1. GIFT IS PURCHASED</h4>
              <p style="color: #aaa; font-size: 14px; margin: 0;">Customer purchases a subscription gift.</p>
            </div>
            
            <div style="color: ${accentColor}; font-size: 24px; margin-bottom: 20px;">↓</div>

            <!-- Box 2 -->
            <div style="background-color: #1A1A1A; border: 1px solid rgba(245, 197, 66, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px; width: 80%; max-width: 400px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
              <h4 style="color: ${accentColor}; margin: 0 0 10px 0; font-size: 16px;">2. GIFT EMAIL DELIVERED</h4>
              <p style="color: #aaa; font-size: 14px; margin: 0;">Recipient receives a beautiful gift notification email.</p>
            </div>

            <div style="color: ${accentColor}; font-size: 24px; margin-bottom: 20px;">↓</div>

            <!-- Box 3 -->
            <div style="background-color: #1A1A1A; border: 1px solid rgba(245, 197, 66, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px; width: 80%; max-width: 400px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
              <h4 style="color: ${accentColor}; margin: 0 0 10px 0; font-size: 16px;">3. CLAIM GIFT</h4>
              <p style="color: #aaa; font-size: 14px; margin: 0;">Recipient lands on a beautiful unboxing & claim page.</p>
              <br/>
              <div style="background-color: ${accentColor}; color: #000; padding: 10px; border-radius: 6px; font-weight: bold; display: inline-block;">CLAIM MY GIFT</div>
            </div>
          </td>
        </tr>
      </table>
    `;
  } else if (type === 'retention') {
    blueprintStructure = `
      <!-- Retention Infrastructure Structure -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
        <tr>
          <td align="center">
            <h3 style="color: #ffffff; font-size: 26px; letter-spacing: 1px; margin-bottom: 10px;">RETENTION INFRASTRUCTURE</h3>
            <p style="color: #888; font-size: 14px; margin-bottom: 40px;">Subscription commerce. Engineered for retention.</p>
          </td>
        </tr>
        <tr>
          <td align="center">
            <!-- Box 1 -->
            <div style="background-color: #1A1A1A; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 25px; margin-bottom: 20px; width: 80%; max-width: 350px; text-align: center; position: relative;">
              <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 18px;">STOREFRONT FRONT-END</h4>
              <p style="color: #666; font-size: 12px; margin: 0;">User interface and shopping experience.</p>
            </div>
            
            <div style="color: ${accentColor}; font-size: 24px; margin-bottom: 20px;">|</div>

            <!-- Box 2 -->
            <div style="background-color: #111; border: 1px solid rgba(245, 197, 66, 0.4); border-radius: 12px; padding: 25px; margin-bottom: 20px; width: 80%; max-width: 350px; text-align: center; box-shadow: 0 0 20px rgba(245,197,66,0.1);">
              <div style="color: ${accentColor}; font-size: 32px; margin-bottom: 10px;">⚙️</div>
              <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 18px;">BILLING ENGINE</h4>
            </div>

            <div style="color: ${accentColor}; font-size: 24px; margin-bottom: 20px;">|</div>

            <!-- Box 3 -->
            <div style="background-color: #111; border: 1px solid rgba(245, 197, 66, 0.4); border-radius: 12px; padding: 25px; margin-bottom: 20px; width: 80%; max-width: 350px; text-align: center; box-shadow: 0 0 20px rgba(245,197,66,0.1);">
              <div style="color: ${accentColor}; font-size: 32px; margin-bottom: 10px;">📦</div>
              <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 18px;">INVENTORY LEVELS</h4>
            </div>
          </td>
        </tr>
      </table>
    `;
  } else if (type === 'anniversary') {
    blueprintStructure = `
      <!-- Anniversary Logic Structure -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
        <tr>
          <td align="center">
            <h3 style="color: #ffffff; font-size: 24px; letter-spacing: 1px; margin-bottom: 10px; text-transform: uppercase;">THE ANNIVERSARY LOGIC</h3>
            <p style="color: #888; font-size: 14px; margin-bottom: 40px;">Reward loyalty. Reinforce value. Celebrate every milestone.</p>
          </td>
        </tr>
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="33%" align="center" style="padding: 10px;">
                  <h5 style="color: ${accentColor}; margin: 0 0 10px 0; font-size: 14px;">MONTH 3</h5>
                  <div style="background-color: #1A1A1A; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; text-align: center;">
                    <div style="font-size: 30px; margin-bottom: 10px;">🎁</div>
                    <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 16px;">FREE GIFT</h4>
                    <p style="color: #888; font-size: 12px; margin: 0;">Special thank-you gift.</p>
                  </div>
                </td>
                <td width="33%" align="center" style="padding: 10px;">
                  <h5 style="color: ${accentColor}; margin: 0 0 10px 0; font-size: 14px;">MONTH 6</h5>
                  <div style="background-color: #1A1A1A; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; text-align: center;">
                    <div style="font-size: 30px; margin-bottom: 10px; color: ${accentColor}; font-weight: bold;">10%</div>
                    <h4 style="color: #fff; margin: 0 0 5px 0; font-size: 16px;">DISCOUNT</h4>
                    <p style="color: #888; font-size: 12px; margin: 0;">Enjoy 10% off your order.</p>
                  </div>
                </td>
                <td width="33%" align="center" style="padding: 10px;">
                  <h5 style="color: ${accentColor}; margin: 0 0 10px 0; font-size: 14px;">MONTH 12</h5>
                  <div style="background-color: #1A1A1A; border: 1px solid rgba(245,197,66,0.3); border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 0 15px rgba(245,197,66,0.15);">
                    <div style="font-size: 30px; margin-bottom: 10px;">👑</div>
                    <h4 style="color: ${accentColor}; margin: 0 0 5px 0; font-size: 16px;">VIP STATUS</h4>
                    <p style="color: #888; font-size: 12px; margin: 0;">Unlocked VIP status.</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #000000; color: #ffffff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 30px 15px;">
        <tr>
          <td align="center">
            <!-- Main Container -->
            <table width="100%" max-width="650" cellpadding="0" cellspacing="0" style="max-width: 650px; background-color: #0A0A0A; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
              
              <!-- Subject Header -->
              <tr>
                <td style="padding: 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px;">${title}</h1>
                </td>
              </tr>

              <!-- User Body Text -->
              <tr>
                <td style="padding: 30px 40px; color: ${textColor}; font-size: 16px; line-height: 1.8;">
                  ${bodyText.replace(/\\n/g, '<br/>')}
                </td>
              </tr>

              <!-- Blueprint Visuals -->
              <tr>
                <td style="padding: 0 20px 40px 20px;">
                  <div style="background-color: #000; border-radius: 16px; padding: 30px 20px; border: 1px solid rgba(245, 197, 66, 0.1);">
                    ${blueprintStructure}
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 25px; background-color: #050505; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                  <h3 style="margin: 0 0 10px 0; color: #6C3BFF; font-size: 18px;">BLACK4ME</h3>
                  <p style="margin: 0; color: #666; font-size: 12px;">نشرة بريدية متقدمة • تعلم وتطبيق</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
