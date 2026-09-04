package com.avento.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI aventoOpenAPI() {
        String securitySchemeName = "BearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("AVENTO Platform Enterprise REST API")
                        .description("High-performance campus event management, 0.3s QR turnstile check-ins, Razorpay payments, and verified certificates.")
                        .version("v2.4.0")
                        .contact(new Contact()
                                .name("AVENTO Engineering Architecture")
                                .email("dev@avento.io")
                                .url("https://avento.io"))
                        .license(new License()
                                .name("Commercial Proprietary")
                                .url("https://avento.io/terms")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("Firebase ID Token")));
    }
}
