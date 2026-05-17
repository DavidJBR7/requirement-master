import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotPassword } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom"; // añadido
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

const schema = z.object({
  email: z.string().email("Email inválido"),
});

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const mutation = useForgotPassword();
  const navigate = useNavigate();

  const onSubmit = (data) => mutation.mutate(data);

  const handleGoToReset = () => {
    const email = getValues("email");
    navigate(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  // Determinar el mensaje de error a mostrar
  const getErrorMessage = () => {
    if (errors.email?.message) return errors.email?.message;
    if (mutation.isError && mutation.error?.response?.data?.message) {
      return mutation.error.response.data.message;
    }
    if (mutation.isError) return "Error al enviar el código";
    return undefined;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={getErrorMessage()}
        disabled={mutation.isSuccess} // deshabilitar después de éxito
      />
      {!mutation.isSuccess ? (
        <Button
          type="submit"
          isLoading={isSubmitting || mutation.isPending}
          className="w-full"
        >
          Enviar código
        </Button>
      ) : (
        <>
          <p className="text-green-600 text-sm text-center">
            Código enviado correctamente. Revise su correo.
          </p>
          <Button
            type="button"
            onClick={handleGoToReset}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Ir a restablecer contraseña
          </Button>
        </>
      )}
    </form>
  );
}
