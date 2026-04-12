import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-neutral-100 px-4 py-12">
      <SignUp fallbackRedirectUrl="/app" signInUrl="/sign-in" />
    </div>
  );
}
