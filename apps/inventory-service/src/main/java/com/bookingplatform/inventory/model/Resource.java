package com.bookingplatform.inventory.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {
    @Id
    private String id;

    private String name;
    private String description;

    // Plain String reference to category — category is now owned by ingestion-service
    private String categoryId;
}
