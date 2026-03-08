package com.bookingplatform.payment.service;

import com.bookingplatform.payment.model.Transaction;
import com.bookingplatform.payment.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final TransactionRepository transactionRepository;

    public Transaction processPayment(Transaction transaction) {
        // Mock payment logic: 90% success rate
        boolean success = Math.random() > 0.1;
        transaction.setStatus(success ? "SUCCESS" : "FAILED");
        transaction.setTimestamp(LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getHistory(String userId) {
        return transactionRepository.findByUserId(userId);
    }
}
