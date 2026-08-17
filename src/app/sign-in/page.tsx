import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata = {
  title: "Sign in — Tuftlings",
};

export default function SignInPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Sign in</h1>
        <p className="mt-1 text-sm text-stone-600">Welcome back to Tuftlings.</p>
      </div>
      <SignInForm />
      <p className="text-sm text-stone-600">
        New here?{" "}
        <Link href="/sign-up" className="font-medium text-amber-700 underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
