package com.esprit.microservice.paymentmanagement;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final MailService mailService;

    public PaymentService(PaymentRepository paymentRepository, MailService mailService) {
        this.paymentRepository = paymentRepository;
        this.mailService = mailService;
    }

    public Payment save(Payment payment) {
        payment.setTimestamp(java.time.LocalDateTime.now());
        Payment saved = paymentRepository.save(payment);

        mailService.sendPaymentConfirmation(payment.getPayer(), payment.getPayer(), payment.getAmount());

        return saved;
    }

    public List<Payment> getAll() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getById(Long id) {
        return paymentRepository.findById(id);
    }

    public void delete(Long id) {
        paymentRepository.deleteById(id);
    }
}
