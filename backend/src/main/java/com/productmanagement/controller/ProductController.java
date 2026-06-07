package com.productmanagement.controller;

import com.productmanagement.dto.DashboardStatsDto;
import com.productmanagement.dto.PagedResponse;
import com.productmanagement.dto.ProductDto;
import com.productmanagement.service.CsvExportService;
import com.productmanagement.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Product Management", description = "APIs for managing products")
public class ProductController {
    
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    
    private final ProductService productService;
    private final CsvExportService csvExportService;
    
    @Autowired
    public ProductController(ProductService productService, CsvExportService csvExportService) {
        this.productService = productService;
        this.csvExportService = csvExportService;
    }
    
    @Operation(summary = "Get all products with pagination and search")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Products retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request parameters")
    })
    @GetMapping
    public ResponseEntity<PagedResponse<ProductDto>> getAllProducts(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "id") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "asc") String sortDir,
            @Parameter(description = "Search term") @RequestParam(required = false) String search) {
        
        logger.info("GET /api/v1/products - page: {}, size: {}, sortBy: {}, sortDir: {}, search: {}", 
                   page, size, sortBy, sortDir, search);
        
        PagedResponse<ProductDto> response = productService.getAllProducts(page, size, sortBy, sortDir, search);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Get product by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Product found"),
        @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(
            @Parameter(description = "Product ID") @PathVariable Long id) {
        
        logger.info("GET /api/v1/products/{}", id);
        
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    
    @Operation(summary = "Create a new product")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Product created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid product data")
    })
    @PostMapping
    public ResponseEntity<ProductDto> createProduct(
            @Parameter(description = "Product data") @Valid @RequestBody ProductDto productDto) {
        
        logger.info("POST /api/v1/products - Creating product: {}", productDto.getName());
        
        ProductDto createdProduct = productService.createProduct(productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }
    
    @Operation(summary = "Update an existing product")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Product updated successfully"),
        @ApiResponse(responseCode = "404", description = "Product not found"),
        @ApiResponse(responseCode = "400", description = "Invalid product data")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(
            @Parameter(description = "Product ID") @PathVariable Long id,
            @Parameter(description = "Updated product data") @Valid @RequestBody ProductDto productDto) {
        
        logger.info("PUT /api/v1/products/{} - Updating product", id);
        
        ProductDto updatedProduct = productService.updateProduct(id, productDto);
        return ResponseEntity.ok(updatedProduct);
    }
    
    @Operation(summary = "Delete a product")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Product deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "Product ID") @PathVariable Long id) {
        
        logger.info("DELETE /api/v1/products/{}", id);
        
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    
    @Operation(summary = "Get products by category")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Products retrieved successfully")
    })
    @GetMapping("/category/{category}")
    public ResponseEntity<PagedResponse<ProductDto>> getProductsByCategory(
            @Parameter(description = "Category name") @PathVariable String category,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "id") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "asc") String sortDir) {
        
        logger.info("GET /api/v1/products/category/{}", category);
        
        PagedResponse<ProductDto> response = productService.getProductsByCategory(category, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Get products by price range")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Products retrieved successfully")
    })
    @GetMapping("/price-range")
    public ResponseEntity<PagedResponse<ProductDto>> getProductsByPriceRange(
            @Parameter(description = "Minimum price") @RequestParam BigDecimal minPrice,
            @Parameter(description = "Maximum price") @RequestParam BigDecimal maxPrice,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "id") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "asc") String sortDir) {
        
        logger.info("GET /api/v1/products/price-range - min: {}, max: {}", minPrice, maxPrice);
        
        PagedResponse<ProductDto> response = productService.getProductsByPriceRange(minPrice, maxPrice, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Get all distinct categories")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Categories retrieved successfully")
    })
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        logger.info("GET /api/v1/products/categories");
        
        List<String> categories = productService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
    
    @Operation(summary = "Get products with low stock")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Low stock products retrieved successfully")
    })
    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductDto>> getLowStockProducts(
            @Parameter(description = "Stock threshold") @RequestParam(defaultValue = "10") Integer threshold) {
        
        logger.info("GET /api/v1/products/low-stock - threshold: {}", threshold);
        
        List<ProductDto> lowStockProducts = productService.getLowStockProducts(threshold);
        return ResponseEntity.ok(lowStockProducts);
    }
    
    @Operation(summary = "Get dashboard statistics")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Dashboard statistics retrieved successfully")
    })
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        logger.info("GET /api/v1/products/dashboard");
        
        DashboardStatsDto stats = productService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
    
    @Operation(summary = "Export products to CSV")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "CSV file generated successfully")
    })
    @GetMapping("/export/csv")
    public void exportProductsToCSV(HttpServletResponse response) throws IOException {
        logger.info("GET /api/v1/products/export/csv");
        
        List<ProductDto> products = productService.getAllProductsForExport();
        csvExportService.exportProductsToCSV(products, response);
    }
}