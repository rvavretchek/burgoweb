import { createFileRoute } from '@tanstack/react-router';
import { OnboardingStartPage } from '../components/OnboardingStartPage';

export const Route = createFileRoute('/comecar')({ component: OnboardingStartPage });
