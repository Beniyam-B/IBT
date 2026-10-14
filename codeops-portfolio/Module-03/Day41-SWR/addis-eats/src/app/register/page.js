import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Register · Addis Eats" };

export default function RegisterPage() {
  return (
    <main>
      <AuthForm mode="register" />
    </main>
  );
}
