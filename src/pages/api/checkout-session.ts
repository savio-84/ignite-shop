import { stripe } from "@/lib/stripe";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const priceId = request.body.priceId;
  if (request.method != 'POST') {
    return response.status(405).json({
      error: 'Method not allowed!'
    });
  }
  if (!priceId) {
    return response.status(400).json({
      error: 'Price not found!'
    });
  }
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_URL}`,
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ]
  })

  return response.status(201).json({
    checkoutUrl: checkoutSession.url,
  });
}