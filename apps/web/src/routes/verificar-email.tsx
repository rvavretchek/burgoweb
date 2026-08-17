import { createFileRoute } from '@tanstack/react-router';
import { EmailVerificationPage } from '../components/EmailVerificationPage';

export const Route = createFileRoute('/verificar-email')({ component: EmailVerificationPage });
