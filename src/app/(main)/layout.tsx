import Navbar from "@/components/navbar/Navbar";
import PremiumModal from "@/components/premium/PremiumModal";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {children}
      <PremiumModal />
    </div>
  );
}
