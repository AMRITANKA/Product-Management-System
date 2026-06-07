package com.productmanagement.dto;

import java.math.BigDecimal;

public class DashboardStatsDto {
    
    private Long totalProducts;
    private Long totalCategories;
    private Long totalQuantity;
    private BigDecimal inventoryValue;
    
    // Default constructor
    public DashboardStatsDto() {}
    
    // Constructor with all fields
    public DashboardStatsDto(Long totalProducts, Long totalCategories, Long totalQuantity, BigDecimal inventoryValue) {
        this.totalProducts = totalProducts;
        this.totalCategories = totalCategories;
        this.totalQuantity = totalQuantity;
        this.inventoryValue = inventoryValue;
    }
    
    // Getters and Setters
    public Long getTotalProducts() {
        return totalProducts;
    }
    
    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }
    
    public Long getTotalCategories() {
        return totalCategories;
    }
    
    public void setTotalCategories(Long totalCategories) {
        this.totalCategories = totalCategories;
    }
    
    public Long getTotalQuantity() {
        return totalQuantity;
    }
    
    public void setTotalQuantity(Long totalQuantity) {
        this.totalQuantity = totalQuantity;
    }
    
    public BigDecimal getInventoryValue() {
        return inventoryValue;
    }
    
    public void setInventoryValue(BigDecimal inventoryValue) {
        this.inventoryValue = inventoryValue;
    }
    
    @Override
    public String toString() {
        return "DashboardStatsDto{" +
                "totalProducts=" + totalProducts +
                ", totalCategories=" + totalCategories +
                ", totalQuantity=" + totalQuantity +
                ", inventoryValue=" + inventoryValue +
                '}';
    }
}