import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SERVER_IP = "http://10.0.0.58:8090"; // Ensure the protocol is included

export function Index() {
  const [date, setSelectedDate] = useState<Date | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [month, setMonth] = useState<number | undefined>(undefined);
  const [day, setDay] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Function to convert Date to Julian Day
  const toJulianDay = (date: Date): number => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // Months are zero-based in JS
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();

    let A = Math.floor(year / 100);
    let B = 2 - A + Math.floor(A / 4);

    if (
      year < 1582 ||
      (year === 1582 && month < 10) ||
      (year === 1582 && month === 10 && day < 15)
    ) {
      B = 0;
    }

    let JD =
      Math.floor(365.25 * (year + 4716)) +
      Math.floor(30.6001 * (month + 1)) +
      day +
      B -
      1524.5;

    // Add the fractional day
    JD += (hour + minute / 60 + second / 3600) / 24;

    return JD;
  };

  // Function to set birthday by sending POST request
  const setBirthday = async (selectedDate: Date) => {
    const jd = toJulianDay(selectedDate);
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${SERVER_IP}/api/main/time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          time: jd.toString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.text();
      console.log("Success:", result);
      setSuccess("Birthday set successfully!");
    } catch (error) {
      console.error("Failed to set birthday:", error);
      if (error instanceof Error) {
        setError(`Couldn't connect to Stellarium. Is it running?`);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (selectedYear: string) => {
    const yearNumber = parseInt(selectedYear, 10);
    setYear(yearNumber);
  };

  const handleMonthChange = (selectedMonth: string) => {
    const monthNumber = parseInt(selectedMonth, 10);
    setMonth(monthNumber);
  };

  const handleDayChange = (selectedDay: string) => {
    const dayNumber = parseInt(selectedDay, 10);
    setDay(dayNumber);
  };

  const handleSubmit = () => {
    if (year && month !== undefined && day) {
      const newDate = new Date(year, month, day);
      setSelectedDate(newDate);
      setBirthday(newDate);
    } else {
      setError("Please select a year, month, and day before submitting.");
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

  // Generate an array of years from 1900 to the current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1899 },
    (_, i) => currentYear - i
  );

  // Generate arrays for months and days
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden relative">
      <div className="absolute inset-0 opacity-30"></div>
      <div className="z-10">
        <h1 className="text-5xl font-bold text-blue-200 mb-8 text-center leading-tight">
          Birthday Skies
        </h1>
        <div className="bg-gray-950 bg-opacity-90 p-8 rounded-lg shadow-2xl border border-indigo-900">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            Select Your Birthday
          </h2>
          <div className="space-y-4">
            <Select onValueChange={handleYearChange}>
              <SelectTrigger className="w-full bg-gray-900 border-indigo-800 text-blue-200">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto bg-gray-900 border-indigo-800">
                {years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    className="text-blue-200"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleMonthChange}>
              <SelectTrigger className="w-full bg-gray-900 border-indigo-800 text-blue-200">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-indigo-800">
                {months.map((month, index) => (
                  <SelectItem
                    key={month}
                    value={index.toString()}
                    className="text-blue-200"
                  >
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleDayChange}>
              <SelectTrigger className="w-full bg-gray-900 border-indigo-800 text-blue-200">
                <SelectValue placeholder="Select Day" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto bg-gray-900 border-indigo-800">
                {days.map((day) => (
                  <SelectItem
                    key={day}
                    value={day.toString()}
                    className="text-blue-200"
                  >
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Set Birthday"}
            </Button>
          </div>
          {date && (
            <p className="mt-4 text-sm text-blue-400">
              Selected: {format(date, "MMMM d, yyyy")}
            </p>
          )}
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          {success && <p className="mt-4 text-sm text-green-400">{success}</p>}
        </div>
      </div>
      <style>{`
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
