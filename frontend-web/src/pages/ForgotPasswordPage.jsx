import AuthLayout from '../shared/components/AuthLayout';
import ForgotPasswordForm from '../features/auth/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout currentPage="forgot-password">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}