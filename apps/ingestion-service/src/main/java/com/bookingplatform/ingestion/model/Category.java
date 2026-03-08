package com.bookingplatform.ingestion.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    private String id; // e.g. MOVIE, RESTAURANT, WORKSPACE

    private String name;
    private String icon;
    private String description;

    /**
     * The metadata key used for subcategory filtering on this category.
     * e.g. "genre" for MOVIE, "cuisineType" for RESTAURANT, "type" for WORKSPACE
     */
    private String filterKey;

    /**
     * Display label for the filter panel.
     * e.g. "Genre", "Cuisine", "Space Type"
     */
    private String filterLabel;

    /**
     * Optional background gradient for the category card (CSS value).
     */
    private String gradient;

    /**
     * Optional display order (lower = shown first).
     */
    private int displayOrder;
}
