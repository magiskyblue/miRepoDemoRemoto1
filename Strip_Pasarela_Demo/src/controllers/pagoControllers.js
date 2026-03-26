import Stripe from "stripe";
import { STRIPE_KEY } from "../config.js";

const stripe = new Stripe(STRIPE_KEY);

export const procesarPago = async (req, res) => {
    try {
        const sesion = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        product_data: { 
                            name: 'Laptop',
                            description: 'Gamer Laptop',
                        },
                        currency: 'mxn',
                        unit_amount: 1000,
                    },
                    quantity: 2,
                },
                {
                    price_data: {
                        product_data: {
                            name: 'Lavadora',
                            description: 'Lavadora whirlpool',
                        },
                        currency: 'mxn', 
                        unit_amount: 2000,
                    },
                    quantity: 2,
                },
            ],
            mode: "payment",
            success_url: 'http://localhost:5000/exito',
            cancel_url: 'http://localhost:5000/cancelado'
        });

        res.json({ url: sesion.url }); // ✅ CLAVE

    } catch (error) {
        console.error("Stripe error:", error.message);
        res.status(500).json({ error: error.message });
    }
};