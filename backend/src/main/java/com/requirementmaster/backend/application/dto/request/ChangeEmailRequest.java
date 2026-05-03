package com.requirementmaster.backend.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangeEmailRequest {
    @NotBlank(message = "El nuevo email es obligatorio")
    @Email(message = "Formato de email inválido")
    private String newEmail;
}