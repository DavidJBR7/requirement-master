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
public class ResetPasswordRequest {

    @NotBlank(message = "El código es de 6 digitos")
    @Size(min = 6, max = 6, message = "El código es de 6 digitos")
    @Pattern(regexp = "^[0-9]+$", message = "Solo se permiten números (0-9)")
    private String token;

    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Size(min = 8, message = "Mínimo 8 caracteres")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$",
            message = "Debe tener mayúscula, número y carácter especial")
    private String newPassword;

    @NotBlank(message = "Debe confirmar la nueva contraseña")
    private String confirmNewPassword;
}