package com.esprit.microservice.paymentmanagement;


import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
public class StripeController {

    @Value("sk_test_51Or4goJoMdaEMvUrl1JQE4CRzfOP6KP3y7meZZiMue6ASSZ9whnLZdNYwLJ01UvRmPjg56iA6o2RsDJvPgjbvojq00LO1jKTuq")
    private String stripeSecretKey;

    private static final String ENDPOINT_SECRET = "whsec_49aca7b6e3a7a8036c74c0b7aca5542bfd0f3b3736821d63cd9955c23ee98c54"; // Replace with your webhook secret

    @PostMapping("/create-payment-intent")
    public Map<String, String> createPaymentIntent(@RequestBody Map<String, Object> data) {

        com.stripe.Stripe.apiKey = stripeSecretKey;

        Map<String, String> response = new HashMap<>();
        try {
            PaymentIntent intent = PaymentIntent.create(
                    PaymentIntentCreateParams.builder()
                            .setAmount((long) (Double.parseDouble(data.get("amount").toString()) * 100)) // e.g., $10 = 1000 cents
                            .setCurrency("usd")
                            .build()
            );
            response.put("clientSecret", intent.getClientSecret());
        } catch (Exception e) {
            response.put("error", e.getMessage());
        }
        return response;
    }
    @PostMapping("/webhook")
    public String handleStripeEvent(HttpServletRequest request) {
        String payload;
        String sigHeader = request.getHeader("Stripe-Signature");

        try {
            payload = request.getReader().lines().reduce("", (accumulator, actual) -> accumulator + actual);
            Event event = Webhook.constructEvent(payload, sigHeader, ENDPOINT_SECRET);

            switch (event.getType()) {
                case "payment_intent.succeeded":
                    handlePaymentSuccess(event);
                    break;
                case "payment_intent.payment_failed":
                    handlePaymentFailure(event);
                    break;
                default:
                    System.out.println("Unhandled event type: " + event.getType());
            }
            return "Event processed";
        } catch (Exception e) {
            return "Webhook error: " + e.getMessage();
        }
    }

    private void handlePaymentSuccess(Event event) {

        PaymentIntent paymentIntent = (PaymentIntent) event.getData().getObject();


        String paymentIntentId = paymentIntent.getId();


        System.out.println("Payment successful: " + paymentIntentId);
    }

    private void handlePaymentFailure(Event event) {

        String paymentIntentId = ((PaymentIntent) event.getData().getObject()).getId();
        System.out.println("Payment failed: " + paymentIntentId);
    }
}