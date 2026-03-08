package com.bookingplatform.payment.controller;

import com.bookingplatform.payment.model.Transaction;
import com.bookingplatform.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<Transaction> process(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(paymentService.processPayment(transaction));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Transaction>> getHistory(@PathVariable String userId) {
        return ResponseEntity.ok(paymentService.getHistory(userId));
    }

    @GetMapping("/health")
    public ResponseEntity<java.util.Map<String, String>> health() {
        return ResponseEntity.ok(java.util.Map.of("status", "UP", "service", "Payment Service"));
    }
}
