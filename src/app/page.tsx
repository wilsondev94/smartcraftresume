import Image from "next/image";

import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function page() {
  return (
    <main className="min-h-screen flex items-center justify-center gap-6 bg-gray-100 text-gray-900 px-5 py-12 text-center md:text-start md:flex-row lg:gap-12">
      <div className="max-w-prose space-y-3">
        <Image
          src={logo}
          width={150}
          height={150}
          alt="Logo"
          className="mx-auto md:mx-0"
        />
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl scroll-m-20">
          Create a{" "}
          <span className="inline-block bg-gradient-to-r from-[#2C5AA0] to-[#6C8EBF] bg-clip-text text-transparent">
            professional Resume
          </span>{" "}
          Swiftly
        </h1>
        <p className="text-lg text-gray-500">
          Design a perfect resume with our resume builder.
        </p>
        <Button asChild size="lg" variant="premium">
          <Link href="/resumes">Get started</Link>
        </Button>
      </div>
    </main>
  );
}
