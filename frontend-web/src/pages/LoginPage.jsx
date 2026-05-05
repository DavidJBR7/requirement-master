import AuthLayout from '../shared/components/AuthLayout';
import LoginForm from '../features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout currentPage="login">
      <LoginForm />
    </AuthLayout>
  );
}