package com.productmanagement.service;

import com.productmanagement.dto.DashboardStatsDto;
import com.productmanagement.dto.PagedResponse;
import com.productmanagement.dto.ProductDto;
import com.productmanagement.entity.Product;
import com.productmanagement.exception.ResourceNotFoundException;
import com.productmanagement.mapper.ProductMapper;
import com.productmanagement.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class ProductService {
    
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);
    
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    
    @Autowired
    public ProductService(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }
    
    /**
     * Get all products with pagination and optional search
     */
    @Transactional(readOnly = true)
    public PagedResponse<ProductDto> getAllProducts(int page, int size, String sortBy, String sortDir, String search) {
        logger.debug("Getting products - page: {}, size: {}, sortBy: {}, sortDir: {}, search: {}", 
                    page, size, sortBy, sortDir, search);
        
        // Create sort object
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        // Create pageable object
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Product> productPage;
        
        // Apply search filter if provided
        if (StringUtils.hasText(search)) {
            productPage = productRepository.findByNameOrCategoryContainingIgnoreCase(search, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }
        
        // Convert to DTOs
        List<ProductDto> productDtos = productMapper.toDtoList(productPage.getContent());
        
        return new PagedResponse<>(
            productDtos,
            productPage.getNumber(),
            productPage.getSize(),
            productPage.getTotalElements(),
            productPage.getTotalPages(),
            productPage.isFirst(),
            productPage.isLast(),
            productPage.isEmpty()
        );
    }
    
    /**
     * Get product by ID
     */
    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        logger.debug("Getting product by id: {}", id);
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        return productMapper.toDto(product);
    }
    
    /**
     * Create new product
     */
    public ProductDto createProduct(ProductDto productDto) {
        logger.debug("Creating new product: {}", productDto.getName());
        
        Product product = productMapper.toEntity(productDto);
        Product savedProduct = productRepository.save(product);
        
        logger.info("Product created successfully with id: {}", savedProduct.getId());
        return productMapper.toDto(savedProduct);
    }
    
    /**
     * Update existing product
     */
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        logger.debug("Updating product with id: {}", id);
        
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        // Update fields using MapStruct
        productMapper.updateProductFromDto(productDto, existingProduct);
        
        Product updatedProduct = productRepository.save(existingProduct);
        
        logger.info("Product updated successfully with id: {}", updatedProduct.getId());
        return productMapper.toDto(updatedProduct);
    }
    
    /**
     * Delete product by ID
     */
    public void deleteProduct(Long id) {
        logger.debug("Deleting product with id: {}", id);
        
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        
        productRepository.deleteById(id);
        logger.info("Product deleted successfully with id: {}", id);
    }
    
    /**
     * Get products by category
     */
    @Transactional(readOnly = true)
    public PagedResponse<ProductDto> getProductsByCategory(String category, int page, int size, String sortBy, String sortDir) {
        logger.debug("Getting products by category: {}", category);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> productPage = productRepository.findByCategoryIgnoreCase(category, pageable);
        
        List<ProductDto> productDtos = productMapper.toDtoList(productPage.getContent());
        
        return new PagedResponse<>(
            productDtos,
            productPage.getNumber(),
            productPage.getSize(),
            productPage.getTotalElements(),
            productPage.getTotalPages(),
            productPage.isFirst(),
            productPage.isLast(),
            productPage.isEmpty()
        );
    }
    
    /**
     * Get products by price range
     */
    @Transactional(readOnly = true)
    public PagedResponse<ProductDto> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, 
                                                           int page, int size, String sortBy, String sortDir) {
        logger.debug("Getting products by price range: {} - {}", minPrice, maxPrice);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> productPage = productRepository.findByPriceBetween(minPrice, maxPrice, pageable);
        
        List<ProductDto> productDtos = productMapper.toDtoList(productPage.getContent());
        
        return new PagedResponse<>(
            productDtos,
            productPage.getNumber(),
            productPage.getSize(),
            productPage.getTotalElements(),
            productPage.getTotalPages(),
            productPage.isFirst(),
            productPage.isLast(),
            productPage.isEmpty()
        );
    }
    
    /**
     * Get all distinct categories
     */
    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        logger.debug("Getting all distinct categories");
        return productRepository.findDistinctCategories();
    }
    
    /**
     * Get products with low stock
     */
    @Transactional(readOnly = true)
    public List<ProductDto> getLowStockProducts(Integer threshold) {
        logger.debug("Getting products with stock less than: {}", threshold);
        
        List<Product> lowStockProducts = productRepository.findByQuantityLessThan(threshold);
        return productMapper.toDtoList(lowStockProducts);
    }
    
    /**
     * Get dashboard statistics
     */
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        logger.debug("Getting dashboard statistics");
        
        Long totalProducts = productRepository.countTotalProducts();
        Long totalCategories = productRepository.countDistinctCategories();
        Long totalQuantity = productRepository.sumTotalQuantity();
        BigDecimal inventoryValue = productRepository.calculateTotalInventoryValue();
        
        // Handle null values
        totalProducts = totalProducts != null ? totalProducts : 0L;
        totalCategories = totalCategories != null ? totalCategories : 0L;
        totalQuantity = totalQuantity != null ? totalQuantity : 0L;
        inventoryValue = inventoryValue != null ? inventoryValue : BigDecimal.ZERO;
        
        return new DashboardStatsDto(totalProducts, totalCategories, totalQuantity, inventoryValue);
    }
    
    /**
     * Get all products for CSV export
     */
    @Transactional(readOnly = true)
    public List<ProductDto> getAllProductsForExport() {
        logger.debug("Getting all products for CSV export");
        
        List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
        return productMapper.toDtoList(products);
    }
}