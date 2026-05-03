package com.requirementmaster.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI requirementMasterOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Requirement Master API")
                        .description("API RESTful para la plataforma educativa de levantamiento de requerimientos")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Requirement Master Team")
                                .email("team@requirementmaster.com"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Servidor local")
                ));
    }
}