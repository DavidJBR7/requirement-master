import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResetPassword } from '../hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const schema = z.object({
  token: z.string().min(1, 'El código es obligatorio'),
  newPassword: z.string().regex(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    'Debe tener mayúscula, número y carácter especial'
  ),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmNewPassword'],
});

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || ''; // 👈 Agregar esta línea

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
      <p className="text-sm text-gray-600">
        Ingrese el código recibido y su nueva contraseña.
      </p>
      
      {}
      {emailFromUrl && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-700">
            Código enviado a: <strong>{emailFromUrl}</strong>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            ¿No es tu email? Vuelve atrás y solicita un nuevo código.
          </p>
        </div>
      )}
      
      <Input
        label="Código de recuperación"
        {...register('token')}
        error={errors.token?.message}
      />
      <Input
        label="Nueva contraseña"
        type="password"
        {...register('newPassword')}
        error={errors.newPassword?.message}
      />
      <Input
        label="Confirmar nueva contraseña"
        type="password"
        {...register('confirmNewPassword')}
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
        <p className="text-red-600 text-sm text-center">
          Error al restablecer. Verifique el código.
        </p>
      )}
    </form>
  );
}