/**
 * Converts a time string in the format "HH:MM:SS" to total seconds.
 *
 * @param timeString - A string representing time in the format "HH:MM:SS".
 * @returns The total number of seconds as a number.
 * @throws Error if the input format is invalid.
 *
 * @example
 * // returns 6020
 * const seconds = convertStringTimeToSeconds("01:30:20");
 */
export function convertStringTimeToSeconds(timeString: string): number {
  // Split the string into hours, minutes, and seconds
  const timeParts = timeString.split(":");

  // Check if the input format is valid
  if (timeParts.length !== 3) {
    throw new Error('Invalid time format. Please use "HH:MM:SS".');
  }

  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = parseInt(timeParts[2], 10);

  // Validate the parsed values
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    throw new Error(
      "Invalid time format. Please ensure hours, minutes, and seconds are numbers."
    );
  }

  // Calculate total seconds
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Converts total seconds into a time string in the format "HH:MM:SS".
 *
 * @param totalSeconds - The total number of seconds.
 * @returns A string representing time in the format "HH:MM:SS".
 *
 * @example
 * // returns "01:30:20"
 * const timeString = convertSecondsToTime(6020);
 */
export function convertSecondsToTime(totalSeconds: number): string {
  // Validate input
  if (totalSeconds < 0) {
    throw new Error("Total seconds cannot be negative.");
  }

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format to "HH:MM:SS"
  const timeString = [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");

  return timeString;
}
