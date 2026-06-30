async function testStripeCheckout() {
  try {
    const res = await fetch('https://www.black4me.com/api/checkout/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: 'f7219ceb-77f0-4fa8-9f2d-8b010c7104b2', 
        customerEmail: 'test@example.com'
      })
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
testStripeCheckout();
