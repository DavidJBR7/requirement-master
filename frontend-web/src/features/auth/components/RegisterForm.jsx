import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '../hooks/useAuth';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  username: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(20, 'Máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Solo letras, números, puntos, guiones'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Debe tener mayúscula, número y carácter especial'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
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

  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Nombre completo"
        {...register('fullName')}
        error={errors.fullName?.message}
      />
      <Input
        label="Nombre de usuario"
        {...register('username')}
        error={errors.username?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Contraseña"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Input
        label="Confirmar contraseña"
        type="password"
        {...register('confirmPassword')}
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
        <p className="text-red-600 text-sm text-center">
          Error al registrarse. Intente con otros datos.
        </p>
      )}
    </form>
  );
}