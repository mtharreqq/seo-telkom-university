// TODO: Fix this code

let startTime: number = 0;
let elapsedTime: number = 0;
let intervalId: NodeJS.Timeout | null = null;

// Function to format time
function formatTime(ms: number): string {
  let seconds: number = Math.floor(ms / 1000);
  let minutes: number = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Function to start the stopwatch
export function start(): void {
  if (!intervalId) {
    startTime = Date.now() - elapsedTime;
    intervalId = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      console.log(`Elapsed time: ${formatTime(elapsedTime)}`);
    }, 1000);
  }
}

// Function to stop the stopwatch
export function stop(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

// Function to reset the stopwatch
export function reset(): void {
  stop();
  elapsedTime = 0;
  console.log("Elapsed time: 0:00");
}
