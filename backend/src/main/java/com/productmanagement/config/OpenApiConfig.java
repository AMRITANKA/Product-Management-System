package com.productmanagement.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI productManagementOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Product Management API")
                        .description("REST API for Product Management System")
                        .version("v1.0")
                        .contact(new Contact()
                                .name("Product Management Team")
                                .email("support@productmanagement.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}