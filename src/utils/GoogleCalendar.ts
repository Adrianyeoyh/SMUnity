// For Google Calendar
export const addToGoogleCalendar = (event: {
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
}) => {
  try {
    const [startTime, endTime] = event.time.split(" - ");
    const eventDate = new Date(event.date);

    const startDateTime = parseDateTime(eventDate, startTime);
    const endDateTime = parseDateTime(eventDate, endTime);

    const startStr = formatGoogleDate(startDateTime);
    const endStr = formatGoogleDate(endDateTime);

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: `${startStr}/${endStr}`,
      details: event.description || "",
      location: event.location,
      ctz: "Asia/Singapore",
    });

    const url = `https://calendar.google.com/calendar/render?${params.toString()}`;

    window.open(url, "_blank");

    return { success: true };
  } catch (error) {
    console.error("Error creating calendar link:", error);
    return { success: false, error };
  }
};

function formatGoogleDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = "00";

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

function parseDateTime(date: Date, time: string): Date {
  const [timeStr, period] = time.split(" ");
  let [hours, minutes] = timeStr.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const dateTime = new Date(date);
  dateTime.setHours(hours, minutes, 0, 0);
  return dateTime;
}

// Not needed for URL method but keep it anyways LOL
export const initGoogleCalendar = () => {
  return Promise.resolve();
};
