package com.bookingplatform.inventory.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "categories")
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
