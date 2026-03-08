package com.bookingplatform.inventory.repository;

import com.bookingplatform.inventory.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByCategoryId(String categoryId);
}
