import { format, isToday, isThisWeek, differenceInHours, differenceInMinutes } from "date-fns";

export const formatPostDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  if (isToday(date)) {
    const minutesAgo = differenceInMinutes(new Date(), date); // Calculate difference in minutes
    if (minutesAgo <= 3) {
      return "Just now";
    } else if (minutesAgo < 60) {
      return `${minutesAgo} mins ago`;
    } else {
      const hoursAgo = differenceInHours(new Date(), date); // Calculate difference in hours
      return `${hoursAgo} hr ago`;
    }
  }

  if (isThisWeek(date, { weekStartsOn: 1 })) {
    // Assuming Monday as start of the week
    return format(date, "EEE, h:mm a"); // Example: Tue, 9:40 AM
  }

  return format(date, "dd/MM/yyyy"); // Example: 23/10/2024
};
