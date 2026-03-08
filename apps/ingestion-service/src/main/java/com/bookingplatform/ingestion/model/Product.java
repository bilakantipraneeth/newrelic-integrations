package com.bookingplatform.ingestion.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.Map;

@Document(collection = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    private String id;

    @Indexed
    private String categoryId;   // "MOVIE", "RESTAURANT", "WORKSPACE"

    private String name;         // Movie title / Restaurant name / Workspace name
    private String description;
    private String imageUrl;
    private Double price;        // Ticket price / Cover charge / Hourly rate

    /**
     * Flexible map for category-specific attributes:
     *  - MOVIE:      genre, director, cast, language, duration, rating, showtimes
     *  - RESTAURANT: cuisineType, address, phone, openingHours, menuItems
     *  - WORKSPACE:  type, capacity, amenities, available
     */
    private Map<String, Object> metadata;
}
