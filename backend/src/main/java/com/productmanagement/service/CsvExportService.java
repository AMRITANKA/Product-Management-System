package com.productmanagement.service;

import com.productmanagement.dto.ProductDto;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class CsvExportService {
    
    private static final Logger logger = LoggerFactory.getLogger(CsvExportService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    /**
     * Export products to CSV format
     */
    public void exportProductsToCSV(List<ProductDto> products, HttpServletResponse response) throws IOException {
        logger.info("Exporting {} products to CSV", products.size());
        
        // Set response headers
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"products.csv\"");
        
        try (PrintWriter writer = response.getWriter()) {
            // Write CSV header
            writer.println("Id,Name,Category,Price,Quantity,Description,Created At,Updated At");
            
            // Write product data
            for (ProductDto product : products) {
                writer.printf("%d,\"%s\",\"%s\",%s,%d,\"%s\",\"%s\",\"%s\"%n",
                    product.getId(),
                    escapeCsvValue(product.getName()),
                    escapeCsvValue(product.getCategory()),
                    product.getPrice(),
                    product.getQuantity(),
                    escapeCsvValue(product.getDescription()),
                    product.getCreatedAt() != null ? product.getCreatedAt().format(DATE_FORMATTER) : "",
                    product.getUpdatedAt() != null ? product.getUpdatedAt().format(DATE_FORMATTER) : ""
                );
            }
            
            writer.flush();
        }
        
        logger.info("CSV export completed successfully");
    }
    
    /**
     * Escape CSV values to handle commas, quotes, and newlines
     */
    private String escapeCsvValue(String value) {
        if (value == null) {
            return "";
        }
        
        // Replace double quotes with two double quotes
        return value.replace("\"", "\"\"");
    }
}