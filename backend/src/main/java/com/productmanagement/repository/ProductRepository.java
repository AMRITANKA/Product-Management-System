package com.productmanagement.repository;

import com.productmanagement.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Search products by name or category (case-insensitive)
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Product> findByNameOrCategoryContainingIgnoreCase(
            @Param("searchTerm") String searchTerm, 
            Pageable pageable);
    
    // Find products by category
    Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);
    
    // Find products by price range
    Page<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    // Find products with low stock (quantity less than threshold)
    List<Product> findByQuantityLessThan(Integer threshold);
    
    // Get distinct categories
    @Query("SELECT DISTINCT p.category FROM Product p ORDER BY p.category")
    List<String> findDistinctCategories();
    
    // Dashboard statistics queries
    @Query("SELECT COUNT(p) FROM Product p")
    Long countTotalProducts();
    
    @Query("SELECT COUNT(DISTINCT p.category) FROM Product p")
    Long countDistinctCategories();
    
    @Query("SELECT COALESCE(SUM(p.quantity), 0) FROM Product p")
    Long sumTotalQuantity();
    
    @Query("SELECT COALESCE(SUM(p.price * p.quantity), 0) FROM Product p")
    BigDecimal calculateTotalInventoryValue();
}