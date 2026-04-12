import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-neutral-100 px-4 py-12">
      <SignIn fallbackRedirectUrl="/app" signUpUrl="/sign-up" />
    </div>
  );
}
