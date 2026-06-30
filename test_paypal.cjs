const fetch = require('node-fetch');

const clientId = 'BAAYJdsPeJ_kuRdCyLx1TEOVm9MLxk7e_IIbcJ9vBDSEBLMw4tIYo-fLJp5xhk9mqgU-IGTn5yGzomWk3I';
const secret = 'ELJKoHOz1Wf2uEGWu6xyoJMf_aUtZP6JxFPKmWrKME_iUbsQN8D40fdKiV1Rj7DfozgfB4IOLzxW6YpN';

async function test() {
  const auth = Buffer.from(clientId + ':' + secret).toString('base64');
  
  // Test Sandbox
  try {
    const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: { Authorization: 'Basic ' + auth },
    });
    const data = await response.json();
    console.log('Sandbox:', data.error || 'Success', data);
  } catch (e) {
    console.log('Sandbox Error:', e.message);
  }
  
  // Test Live
  try {
    const liveResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: { Authorization: 'Basic ' + auth },
    });
    const liveData = await liveResponse.json();
    console.log('Live:', liveData.error || 'Success', liveData);
  } catch (e) {
    console.log('Live Error:', e.message);
  }
}
test();
