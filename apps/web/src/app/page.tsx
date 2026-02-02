import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to login - same behavior as original PHP
  redirect('/auth/login');
}
