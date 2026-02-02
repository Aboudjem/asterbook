import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to dashboard - same behavior as original PHP index.php
  redirect('/dashboard');
}
