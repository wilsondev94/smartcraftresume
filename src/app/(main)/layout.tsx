import Navbar from "@/components/navbar/Navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {children}
    </div>
  );
}
