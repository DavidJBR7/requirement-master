package com.requirementmaster.backend.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String fullName;

    @NotBlank(message = "El username no puede estar vacío")
    @Pattern(regexp = "^[a-zA-Z0-9._-]{3,20}$",
            message = "El username debe tener 3-20 caracteres y solo letras, números, puntos, guiones o guiones bajos")
    private String username;
}