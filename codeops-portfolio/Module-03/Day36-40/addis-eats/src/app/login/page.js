import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Log in · Addis Eats" };

export default function LoginPage() {
  return (
    <main>
      <AuthForm mode="login" />
    </main>
  );
}
