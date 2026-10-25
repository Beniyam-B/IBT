import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getSession } from "@/lib/session";
import { safeNext } from "@/lib/safeNext";

export const metadata = {
  title: "Register",
  description: "Create an Addis Eats account with your phone number to order Ethiopian food.",
};

// Reads ?next= (where the person was going), so this page is rendered on request.
export default async function RegisterPage({ searchParams }) {
  const { next } = await searchParams;
  const safe = safeNext(next, "");

  if (await getSession()) redirect(safe || "/menu"); // already signed in

  return (
    <main>
      <AuthForm mode="register" next={safe} />
    </main>
  );
}
