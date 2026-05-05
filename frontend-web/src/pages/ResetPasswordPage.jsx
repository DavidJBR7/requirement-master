import AuthLayout from '../shared/components/AuthLayout';
import ResetPasswordForm from '../features/auth/components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <AuthLayout currentPage="reset-password">
      <ResetPasswordForm />
    </AuthLayout>
  );
}