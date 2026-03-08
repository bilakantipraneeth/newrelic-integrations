package com.bookingplatform.booking.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    private String id;

    private String userId;
    private String resourceId;
    private String category; // MOVIE, RESTAURANT, WORKSPACE, etc.
    private String title;    // e.g., "Inception", "Pasta Palace"
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;   // PENDING, CONFIRMED, CANCELLED
    private String metadata; // JSON string for category-specific details
}
