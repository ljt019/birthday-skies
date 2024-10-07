import { Button } from "@/components/ui/button";
import useOpenSpace from "@/hooks/useOpenSpace";
import { BirthdayPicker } from "@/components/BirthdayPicker";

export function Index() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <BirthdayPicker />
    </div>
  );
}
