package com.requirementmaster.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Requirement Master API")
                .version("1.0")
                .description("API para la plataforma educativa de levantamiento de requerimientos")
                .contact(new Contact().name("Requirement Master Team").email("support@requirementmaster.com"))
            );
    }
}
