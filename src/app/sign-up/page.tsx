import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = {
  title: "Create account — Tuftlings",
};

export default function SignUpPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Create your account</h1>
        <p className="mt-1 text-sm text-stone-600">
          Tuftlings is a members-only craft community for people 18 and older.
        </p>
      </div>
      <SignUpForm />
      <p className="text-sm text-stone-600">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-amber-700 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
