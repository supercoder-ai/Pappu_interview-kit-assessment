export const TIMESLOTS_24H = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

export function formatTimeslot24ToDisplay(slot24: string): string {
  const [hours, minutes] = slot24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function formatDateLong(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Build stored datetime using wall-clock date + time (no UTC shift). */
export function buildAppointmentDatetime(date: string, time24: string): string {
  return `${date}T${time24}:00`;
}

/** Parse appointment datetime without applying timezone offset to the slot time. */
export function parseAppointmentDatetime(datetime: string): Date {
  const match = datetime.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/
  );
  if (match) {
    const [, year, month, day, hours, minutes] = match.map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }
  return new Date(datetime);
}

export function formatAppointmentDateTime(datetime: string): string {
  return parseAppointmentDatetime(datetime).toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function isUpcoming(datetime: string): boolean {
  return parseAppointmentDatetime(datetime) >= new Date();
}
