import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '../hooks/useAuth';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

const loginSchema = z.object({
  login: z.string().min(1, 'Ingrese email o usuario'),
  password: z.string().min(1, 'Ingrese la contraseña'),
  rememberMe: z.boolean().optional(),
});

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });
  const loginMutation = useLogin();

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input label="Email o usuario" type="text" {...register('login')} error={errors.login?.message} />
      <Input label="Contraseña" type="password" {...register('password')} error={errors.password?.message} />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('rememberMe')} />
          Recordarme
        </label>
        <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
      <Button type="submit" isLoading={isSubmitting || loginMutation.isPending} className="w-full">
        Iniciar sesión
      </Button>
      {loginMutation.isError && (
        <p className="text-red-600 text-sm text-center">
          Error al iniciar sesión. Verifique sus credenciales.
        </p>
      )}
    </form>
  );
}