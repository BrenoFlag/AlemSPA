/**
 * Netlify Function: create-gift-checkout
 * Creates a Stripe Checkout Session for gift card purchases
 * LIVE MODE — updated April 29, 2026
 */

const Stripe = require('stripe');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    let payload;
    try {
        payload = JSON.parse(event.body);
    } catch (err) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
    }

    const required = ['service_key', 'price_id', 'buyer_name', 'buyer_email', 'recipient_name', 'recipient_email'];
    for (const field of required) {
        if (!payload[field] || !payload[field].toString().trim()) {
            return { statusCode: 400, body: JSON.stringify({ error: `Missing required field: ${field}` }) };
        }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.buyer_email)) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid buyer email address' }) };
    }
    if (!emailRegex.test(payload.recipient_email)) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid recipient email address' }) };
    }

    // LIVE price IDs
    const allowedPriceIds = [
        'price_1TRbkPALHDTqOlAGljs9T0Yu', // Golden Package
        'price_1TRbk4ALHDTqOlAGeCcmuhJW', // Facial
        'price_1TRbjBALHDTqOlAGJY7dUK4z', // Hair Butter
        'price_1TRbinALHDTqOlAGH023BiVL', // Moroccan Bath
        'price_1TRbiGALHDTqOlAGUohaBa7O', // Smoke Bath Herbal Detox
        'price_1TRbhRALHDTqOlAGTRVF4Gab', // Smoke Bath Steam Only
    ];

    if (!allowedPriceIds.includes(payload.price_id)) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid product selection' }) };
    }

    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const siteUrl = process.env.SITE_URL || 'https://alemspa.com';

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [{ price: payload.price_id, quantity: 1 }],
            customer_email: payload.buyer_email,
            metadata: {
                service_key:     payload.service_key.trim(),
                buyer_name:      payload.buyer_name.trim(),
                buyer_email:     payload.buyer_email.trim(),
                recipient_name:  payload.recipient_name.trim(),
                recipient_email: payload.recipient_email.trim(),
                gift_message:    (payload.gift_message || '').trim().substring(0, 500),
                delivery_date:   (payload.delivery_date || '').trim()
            },
            success_url: `${siteUrl}/giftcard/success/?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:  `${siteUrl}/giftcard/cancelled/`,
            payment_intent_data: {
                metadata: {
                    service_key:     payload.service_key.trim(),
                    buyer_name:      payload.buyer_name.trim(),
                    buyer_email:     payload.buyer_email.trim(),
                    recipient_name:  payload.recipient_name.trim(),
                    recipient_email: payload.recipient_email.trim(),
                    gift_message:    (payload.gift_message || '').trim().substring(0, 500),
                    delivery_date:   (payload.delivery_date || '').trim()
                }
            }
        });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: session.url })
        };

    } catch (err) {
        console.error('Stripe session creation error:', err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Payment session could not be created. Please try again.' })
        };
    }
};