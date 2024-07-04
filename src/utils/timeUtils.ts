// src/utils/timeUtils.ts

const calculateDuration =
  (unit: "minutes" | "hours" | "days") =>
  (HowMany: number): number => {
    const msPerSecond = 1000;
    const msPerMinute = msPerSecond * 60;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;

    switch (unit) {
      case "minutes":
        return HowMany * msPerMinute;
      case "hours":
        return HowMany * msPerHour;
      case "days":
        return HowMany * msPerDay;
      default:
        throw new Error("Invalid time unit");
    }
  };

export const hours = calculateDuration("hours");
export const minutes = calculateDuration("minutes");
export const days = calculateDuration("days");
