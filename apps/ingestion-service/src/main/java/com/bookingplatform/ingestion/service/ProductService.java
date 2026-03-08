package com.bookingplatform.ingestion.service;

import com.bookingplatform.ingestion.model.Product;
import com.bookingplatform.ingestion.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getByCategory(String categoryId) {
        return productRepository.findByCategoryId(categoryId.toUpperCase());
    }

    public Optional<Product> getById(String categoryId, String id) {
        return productRepository.findById(id)
                .filter(p -> p.getCategoryId().equalsIgnoreCase(categoryId));
    }

    public Product save(String categoryId, Product product) {
        product.setCategoryId(categoryId.toUpperCase());
        return productRepository.save(product);
    }

    public void delete(String categoryId, String id) {
        productRepository.deleteByCategoryIdAndId(categoryId.toUpperCase(), id);
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }
}
