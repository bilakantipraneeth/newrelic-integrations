package com.bookingplatform.booking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String resourceId;
    private String category; // MOVIE, RESTAURANT, WORKSPACE, etc.
    private String title;    // e.g., "Inception", "Pasta Palace"
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;   // PENDING, CONFIRMED, CANCELLED
    
    @Column(length = 2000)
    private String metadata; // JSON string for category-specific details
}
