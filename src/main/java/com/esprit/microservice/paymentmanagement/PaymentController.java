package com.esprit.microservice.paymentmanagement;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<?> createPayment(@Valid @RequestBody Payment payment) {
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) (payment.getAmount() * 100))
                    .setCurrency("usd")
                    .setReceiptEmail(payment.getPayer())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            payment.setTimestamp(LocalDateTime.now());

            payment.setStatus(PaymentStatus.PENDING);


            Payment savedPayment = paymentService.save(payment);


            Map<String, Object> response = new HashMap<>();
            response.put("payment", savedPayment);
            response.put("clientSecret", intent.getClientSecret());

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }



    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAll();
    }

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable Long id) {
        return paymentService.getById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deletePayment(@PathVariable Long id) {
        paymentService.delete(id);
    }
}

