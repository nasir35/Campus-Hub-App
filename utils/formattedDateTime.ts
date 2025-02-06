import { format, isToday, isThisWeek, differenceInHours } from "date-fns";

export const formatPostDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  if (isToday(date)) {
    const hoursAgo = differenceInHours(new Date(), date);
    return hoursAgo < 1 ? "Just now" : `${hoursAgo}hr ago`;
  }

  if (isThisWeek(date, { weekStartsOn: 1 })) {
    // Assuming Monday as start of the week
    return format(date, "EEE, h:mm a"); // Example: Tue, 9:40 AM
  }

  return format(date, "dd/MM/yyyy"); // Example: 23/10/2024
};
