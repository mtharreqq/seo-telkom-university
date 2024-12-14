require("dotenv").config();

// Function to send a message to a Telegram channel
export async function sendTelegramMessage(channel: string, message: any) {
  try {
    // Construct the Telegram API endpoint for sending a message
    const request = await fetch(
      `https://api.telegram.org/${process.env.TOKEN}/sendMessage?chat_id=${channel}&text=${message}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        body: JSON.stringify({
          chat_id: channel,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    // Parse the JSON response from the Telegram API
    const response = await request.json();

    // Return the response object
    return response;
  } catch (error) {
    // Handle errors by logging them to the console
    console.error("Error:", error);
  }
}
