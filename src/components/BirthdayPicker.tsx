import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useOpenSpace from "@/hooks/useOpenSpace";

export function BirthdayPicker() {
  const [date, setDate] = useState<Date>();
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  }>();
  const { openspace, connected, error } = useOpenSpace();

  const setBirthday = (selectedDate: Date) => {
    if (!connected || !openspace) {
      setMessage({
        text: "Not connected to OpenSpace. Please try again later.",
        type: "error",
      });
      return;
    }

    const isoString = selectedDate.toISOString().split("T")[0] + "T00:00:00";

    try {
      openspace.time.setTime(isoString);
      setMessage({
        text: `Simulation time set to ${format(selectedDate, "MMMM d, yyyy")}`,
        type: "success",
      });
    } catch (error) {
      console.error("Error setting time:", error);
      setMessage({
        text: "Failed to set the simulation time. Please try again.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const createStar = () => {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 100}vh`;
      star.style.animationDuration = `${Math.random() * 3 + 2}s`;
      document.body.appendChild(star);

      setTimeout(() => {
        star.remove();
      }, 5000);
    };

    const interval = setInterval(createStar, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (error) {
      setMessage({ text: error, type: "error" });
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950 to-black overflow-hidden relative">
      <div className="absolute inset-0 opacity-30"></div>
      <div className="z-10">
        <h1 className="text-5xl font-bold text-blue-200 mb-8 text-center leading-tight">
          Birthday
          <br />
          Skies
        </h1>
        <div className="bg-gray-950 bg-opacity-90 p-8 rounded-lg shadow-2xl border border-indigo-900">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            Select Your Birthday
          </h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal bg-gray-900 border-indigo-800 hover:bg-gray-800 text-blue-200",
                  !date && "text-blue-400"
                )}
                disabled={!connected}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-900 border-indigo-800">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(newDate);
                    setBirthday(newDate);
                  }
                }}
                initialFocus
                className="bg-gray-900 text-blue-200"
              />
            </PopoverContent>
          </Popover>
          {date && (
            <p className="mt-4 text-sm text-blue-400">
              Selected: {format(date, "MMMM d, yyyy")}
            </p>
          )}
          <p className="mt-4 text-sm text-blue-300">
            Connection Status: {connected ? "Connected" : "Disconnected"}
          </p>
          {message && (
            <div
              className={`mt-4 p-2 rounded ${
                message.type === "success"
                  ? "bg-green-800"
                  : message.type === "error"
                  ? "bg-red-800"
                  : "bg-blue-800"
              }`}
            >
              <p className="text-sm text-white">{message.text}</p>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes twinkle {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
          }
        }
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background-color: #e2e8f0;
          border-radius: 50%;
          animation: twinkle linear infinite;
        }
      `}</style>
    </div>
  );
}
