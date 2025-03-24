"use client";

import { Circle, Square, Squircle } from "lucide-react";
import { Button } from "../ui/button";
import { canUseCutomizations } from "@/lib/permission";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useSubLevel } from "../subscription/SubLevelProvider";

export const borderStyles = {
  SQUARE: "square",
  CIRCLE: "circle",
  SQUIRCLE: "suircle",
};
const borders = Object.values(borderStyles);

interface BorderStyleBtnProps {
  borderStyle: string | undefined;
  onChange: (borderStyle: string) => void;
}
export default function BorderStyleBtn({
  borderStyle,
  onChange,
}: BorderStyleBtnProps) {
  const premiumModal = usePremiumModal();
  const userSubLevel = useSubLevel();

  function handleClick() {
    if (!canUseCutomizations(userSubLevel)) {
      premiumModal.setOpen(true);
      return;
    }

    const currentIndex = borderStyle ? borders.indexOf(borderStyle) : 0;

    const nextIndex = (currentIndex + 1) % borders.length;

    onChange(borders[nextIndex]);
  }

  const Icon =
    borderStyle === "square"
      ? Square
      : borderStyle === "circle"
        ? Circle
        : Squircle;

  return (
    <Button
      variant="outline"
      size="icon"
      title="Change border style"
      onClick={handleClick}
    >
      <Icon className="size-5" />
    </Button>
  );
}
