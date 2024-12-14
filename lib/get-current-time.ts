export function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Add leading zeros to minutes and seconds if they are less than 10
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

  // Return the time in HH:MM:SS format
  return `${hours}:${formattedMinutes}:${formattedSeconds}`;
}
