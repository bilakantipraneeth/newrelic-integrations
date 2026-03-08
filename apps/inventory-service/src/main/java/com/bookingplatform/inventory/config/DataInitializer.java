package com.bookingplatform.inventory.config;

import com.bookingplatform.inventory.model.Resource;
import com.bookingplatform.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final InventoryService inventoryService;

    @Override
    public void run(String... args) throws Exception {
        // Only seed if empty (idempotent)
        if (inventoryService.getResourcesByCategory("MOVIE").isEmpty()) {
            // Movie resources
            inventoryService.saveResource(new Resource(null, "Inception",      "Classic Sci-Fi",        "MOVIE"));
            inventoryService.saveResource(new Resource(null, "The Matrix",     "Action/Sci-Fi",         "MOVIE"));
            inventoryService.saveResource(new Resource(null, "Interstellar",   "Space Adventure",       "MOVIE"));

            // Restaurant resources
            inventoryService.saveResource(new Resource(null, "Pasta Palace",   "Italian Cuisine",       "RESTAURANT"));
            inventoryService.saveResource(new Resource(null, "Sushi Zen",      "Japanese Dining",       "RESTAURANT"));
            inventoryService.saveResource(new Resource(null, "Burger Barn",    "American Fast Food",    "RESTAURANT"));

            // Workspace resources
            inventoryService.saveResource(new Resource(null, "Conference Room A", "Large meeting space",  "WORKSPACE"));
            inventoryService.saveResource(new Resource(null, "Meeting Pod 1",     "Private 2-person pod", "WORKSPACE"));
            inventoryService.saveResource(new Resource(null, "Open Desk 12",      "Shared quiet workspace","WORKSPACE"));

            System.out.println("[InventoryService] Default resources seeded.");
        } else {
            System.out.println("[InventoryService] Resources already exist, skipping seed.");
        }
    }
}
