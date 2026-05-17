import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResetPassword } from "../hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import PasswordInput from "../../../shared/components/PasswordInput";
import { Link } from "react-router-dom";

const schema = z
  .object({
    token: z
      .string()
      .min(6, "El código es de 6 digitos")
      .max(6, "El código es de 6 digitos")
      .regex(/^[0-9]+$/, "Solo se permiten números (0-9)"),
    newPassword: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
        "Debe tener mayúscula, número y carácter especial",
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmNewPassword"],
  });

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";
  const emailFromUrl = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { token: tokenFromUrl },
  });
  const mutation = useResetPassword();

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {}
      {emailFromUrl && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-700">
            Código enviado a: <strong>{emailFromUrl}</strong>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            ¿No es tu email? Vuelve{" "}
            <Link to="/forgot-password" className="underline">
              atrás
            </Link>{" "}
            y solicita un nuevo código.
          </p>
        </div>
      )}

      <Input
        label="Código de recuperación"
        {...register("token")}
        error={errors.token?.message}
      />

      <PasswordInput
        label="Nueva contraseña"
        {...register("newPassword")}
        error={errors.newPassword?.message}
      />

      <PasswordInput
        label="Confirmar nueva contraseña"
        {...register("confirmNewPassword")}
        error={errors.confirmNewPassword?.message}
      />

      <Button
        type="submit"
        isLoading={isSubmitting || mutation.isPending}
        className="w-full"
      >
        Restablecer contraseña
      </Button>
      {mutation.isSuccess && (
        <p className="text-green-600 text-sm text-center">
          Contraseña restablecida correctamente.
        </p>
      )}
      {mutation.isError && (
        <>
          <p className="text-red-600 text-sm text-center">
            {mutation.error?.response?.data?.message ||
              "Error al restablecer. Verifique el código."}
          </p>
        </>
      )}
    </form>
  );
}
