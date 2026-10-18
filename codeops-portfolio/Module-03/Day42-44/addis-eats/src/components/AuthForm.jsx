"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction } from "@/app/actions";
import ui from "./ui.module.css";
import styles from "./auth.module.css";

const copy = {
  login: {
    title: "Welcome back",
    sub: "Log in to place and manage your orders.",
    button: "Log in",
    pending: "Logging in…",
    switchText: "New here?",
    switchLink: "/register",
    switchLabel: "Create an account",
  },
  register: {
    title: "Create your account",
    sub: "It takes a minute, and lets you order and track your meals.",
    button: "Register",
    pending: "Creating account…",
    switchText: "Already registered?",
    switchLink: "/login",
    switchLabel: "Log in",
  },
};

// One client leaf for both screens: only the useActionState wiring needs the browser.
export default function AuthForm({ mode, next = "" }) {
  const isLogin = mode === "login";
  const t = copy[mode];
  const [state, formAction, pending] = useActionState(isLogin ? loginAction : registerAction, null);
  const errors = state?.fieldErrors ?? {};

  const field = (name, label, props = {}) => (
    <div className={ui.field}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...props}
      />
      {errors[name] && (
        <p id={`${name}-error`} className={ui.fieldError} role="alert">
          {errors[name][0]}
        </p>
      )}
    </div>
  );

  return (
    <div className={styles.wrap}>
      <form action={formAction} className={`${ui.card} ${styles.card}`} noValidate>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.sub}>{t.sub}</p>

        {state?.error && <p className={ui.alert} role="alert">{state.error}</p>}

        {/* where to go after signing in; the action checks it again before redirecting */}
        <input type="hidden" name="next" value={next} />

        {isLogin ? (
          field("identifier", "Phone number or email", {
            autoComplete: "username",
            placeholder: "09… or +2519… or you@example.com",
            defaultValue: state?.values?.identifier ?? "",
          })
        ) : (
          <>
            {field("name", "Full name", { autoComplete: "name", defaultValue: state?.values?.name ?? "" })}
            {field("phone", "Phone number", {
              type: "tel",
              autoComplete: "tel",
              placeholder: "09… or +2519…",
              defaultValue: state?.values?.phone ?? "",
            })}
            {field("email", "Email (optional)", {
              type: "email",
              autoComplete: "email",
              defaultValue: state?.values?.email ?? "",
            })}
          </>
        )}
        {field("password", "Password", {
          type: "password",
          autoComplete: isLogin ? "current-password" : "new-password",
        })}

        <button type="submit" disabled={pending} className={`${ui.btn} ${ui.primary} ${styles.submit}`}>
          {pending ? t.pending : t.button}
        </button>
        <p className={styles.switch}>
          {t.switchText} <Link href={next ? `${t.switchLink}?next=${encodeURIComponent(next)}` : t.switchLink}>{t.switchLabel}</Link>
        </p>
      </form>
    </div>
  );
}
