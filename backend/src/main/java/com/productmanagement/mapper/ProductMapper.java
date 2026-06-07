package com.productmanagement.mapper;

import com.productmanagement.dto.ProductDto;
import com.productmanagement.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface ProductMapper {
    
    /**
     * Convert Product entity to ProductDto
     */
    ProductDto toDto(Product product);
    
    /**
     * Convert ProductDto to Product entity
     */
    Product toEntity(ProductDto productDto);
    
    /**
     * Convert list of Product entities to list of ProductDtos
     */
    List<ProductDto> toDtoList(List<Product> products);
    
    /**
     * Convert list of ProductDtos to list of Product entities
     */
    List<Product> toEntityList(List<ProductDto> productDtos);
    
    /**
     * Update existing Product entity with values from ProductDto
     * Ignores null values in the source
     */
    void updateProductFromDto(ProductDto productDto, @MappingTarget Product product);
}