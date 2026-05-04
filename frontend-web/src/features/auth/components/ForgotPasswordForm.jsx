import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForgotPassword } from '../hooks/useAuth';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const schema = z.object({
  email: z.string().email('Email inválido'),
});

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const mutation = useForgotPassword();

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-sm text-gray-600">
        Ingrese su correo electrónico y le enviaremos un código de recuperación.
      </p>
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Button
        type="submit"
        isLoading={isSubmitting || mutation.isPending}
        className="w-full"
      >
        Enviar código
      </Button>
      {mutation.isSuccess && (
        <p className="text-green-600 text-sm text-center">
          Código enviado correctamente. Revise su correo.
        </p>
      )}
      {mutation.isError && (
        <p className="text-red-600 text-sm text-center">
          No se pudo enviar el código. Verifique el email.
        </p>
      )}
    </form>
  );
}