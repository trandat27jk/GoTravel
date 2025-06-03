// app/testcookie/page.tsx
import { cookies } from 'next/headers';

export default async function TestCookiePage() {
  let cookieValue;
  let errorMessage;

  try {
    const cookieStore = cookies();
    cookieValue = cookieStore.get('any_random_cookie_name_here')?.value;
    console.log('In TestCookiePage (fresh project): Cookie "any_random_cookie_name_here", value:', cookieValue);
  } catch (e: any) {
    console.error('Error in TestCookiePage (fresh project) directly using cookies().get():', e);
    errorMessage = e.message;
  }

  return (
    <div>
      <h1>Test Cookie Page (Fresh Project)</h1>
      <p>Value of "any_random_cookie_name_here": {cookieValue !== undefined ? cookieValue : 'not found or error during access'}</p>
      {errorMessage && <p style={{ color: 'red' }}>Error Message: {errorMessage}</p>}
    </div>
  );
}