package com.bookingplatform.inventory.service;

import com.bookingplatform.inventory.model.Resource;
import com.bookingplatform.inventory.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final ResourceRepository resourceRepository;

    public List<Resource> getResourcesByCategory(String categoryId) {
        return resourceRepository.findByCategoryId(categoryId);
    }

    public Resource saveResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Optional<Resource> getResourceById(String id) {
        return resourceRepository.findById(id);
    }

    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }
}
