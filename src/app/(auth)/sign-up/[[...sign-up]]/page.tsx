import { SignUp } from "@clerk/nextjs";

export default function page() {
  return (
    <main className="h-screen flex items-center justify-center p-3">
      <SignUp/>
    </main>
  )
}
