package com.bookingplatform.ingestion.controller;

import com.bookingplatform.ingestion.model.Product;
import com.bookingplatform.ingestion.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Generic product controller — one set of endpoints for ALL categories.
 *
 * Usage:
 *   GET  /api/v1/products/MOVIE          → all movies
 *   GET  /api/v1/products/RESTAURANT     → all restaurants
 *   GET  /api/v1/products/WORKSPACE      → all workspaces
 *   GET  /api/v1/products/MOVIE/{id}     → single movie
 *   POST /api/v1/products/MOVIE          → add a movie
 *   DELETE /api/v1/products/MOVIE/{id}   → delete a movie
 */
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAll());
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable String categoryId) {
        return ResponseEntity.ok(productService.getByCategory(categoryId));
    }

    @GetMapping("/{categoryId}/{id}")
    public ResponseEntity<Product> getById(
            @PathVariable String categoryId,
            @PathVariable String id) {
        return productService.getById(categoryId, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{categoryId}")
    public ResponseEntity<Product> createProduct(
            @PathVariable String categoryId,
            @RequestBody Product product) {
        return ResponseEntity.ok(productService.save(categoryId, product));
    }

    @DeleteMapping("/{categoryId}/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable String categoryId,
            @PathVariable String id) {
        productService.delete(categoryId, id);
        return ResponseEntity.noContent().build();
    }
}
