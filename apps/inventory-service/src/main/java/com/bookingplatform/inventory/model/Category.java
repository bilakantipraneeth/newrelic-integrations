package com.bookingplatform.inventory.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    private String id; // MOVIE, RESTAURANT, WORKSPACE — managed by ingestion-service

    private String name;
    private String icon;
    private String description;
}
