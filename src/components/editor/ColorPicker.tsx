import { useState } from "react";
import { Color, ColorChangeHandler, TwitterPicker } from "react-color";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { PaletteIcon } from "lucide-react";
import { useSubLevel } from "../subscription/SubLevelProvider";
import { canUseCutomizations } from "@/lib/permission";
import usePremiumModal from "@/hooks/usePremiumModal";

interface ColorPickerProps {
  color: Color | undefined;
  onChange: ColorChangeHandler;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const userSubLevel = useSubLevel();

  const premiumModal = usePremiumModal();

  const [showPopover, setShowPopover] = useState(false);

  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Change resume color"
          onClick={() => {
            if (!canUseCutomizations(userSubLevel)) {
              premiumModal.setOpen(true);
              return;
            }
            setShowPopover(true);
          }}
        >
          <PaletteIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-none bg-transparent shadow-none"
        align="end"
      >
        <TwitterPicker color={color} onChange={onChange} triangle="top-right" />
      </PopoverContent>
    </Popover>
  );
}
