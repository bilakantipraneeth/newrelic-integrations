package com.bookingplatform.inventory.controller;

import com.bookingplatform.inventory.model.Resource;
import com.bookingplatform.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@CrossOrigin("*")
public class InventoryController {

    private final InventoryService inventoryService;

    /**
     * Get all resources belonging to a given category.
     * Category data is served by ingestion-service at /api/v1/categories.
     */
    @GetMapping("/categories/{categoryId}/resources")
    public ResponseEntity<List<Resource>> getResources(@PathVariable String categoryId) {
        return ResponseEntity.ok(inventoryService.getResourcesByCategory(categoryId));
    }

    @PostMapping("/resources")
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        return ResponseEntity.ok(inventoryService.saveResource(resource));
    }

    @GetMapping("/resources/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        return inventoryService.getResourceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        inventoryService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}

