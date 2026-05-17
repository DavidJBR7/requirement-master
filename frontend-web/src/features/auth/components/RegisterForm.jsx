import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister } from "../hooks/useAuth";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import PasswordInput from "../../../shared/components/PasswordInput";
import { useEffect } from "react";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Mínimo 2 caracteres")
      .max(100, "Máximo 100 caracteres"),
    username: z
      .string()
      .min(3, "Mínimo 3 caracteres")
      .max(20, "Máximo 20 caracteres")
      .regex(/^[a-zA-Z0-9._-]+$/, "Solo letras, números, puntos, guiones"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
        "Debe tener mayúscula, número y carácter especial",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const registerMutation = useRegister();

  // Ver la estructura completa del error
  useEffect(() => {
    if (registerMutation.isError) {
      console.log("Error completo:", registerMutation.error);
      console.log("Response:", registerMutation.error?.response);
      console.log("Data:", registerMutation.error?.response?.data);
      console.log("Status:", registerMutation.error?.response?.status);
    }
  }, [registerMutation.isError]);

  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Nombre completo"
        {...register("fullName")}
        error={errors.fullName?.message}
      />
      <Input
        label="Nombre de usuario"
        {...register("username")}
        error={errors.username?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <PasswordInput
        label="Contraseña"
        {...register("password")}
        error={errors.password?.message}
      />
      <PasswordInput
        label="Confirmar contraseña"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />
      <Button
        type="submit"
        isLoading={isSubmitting || registerMutation.isPending}
        className="w-full"
      >
        Crear cuenta
      </Button>
      {registerMutation.isError && (
        <>
          <p className="text-red-600 text-sm text-center">
            {registerMutation.error?.response?.data?.message ||
              "Error al registrarse. Intente con otros datos."}
          </p>
        </>
      )}
    </form>
  );
}
