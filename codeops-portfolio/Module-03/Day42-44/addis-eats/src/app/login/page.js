import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getSession } from "@/lib/session";
import { safeNext } from "@/lib/safeNext";

export const metadata = {
  title: "Log in",
  description: "Log in to Addis Eats to order, track and cancel your deliveries.",
};

// Reads ?next= (where the person was going), so this page is rendered on request.
export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;
  const safe = safeNext(next, "");

  if (await getSession()) redirect(safe || "/menu"); // already signed in

  return (
    <main>
      <AuthForm mode="login" next={safe} />
    </main>
  );
}
