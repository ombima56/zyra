import axios, { AxiosError } from 'axios';

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export async function sendWhatsAppMessage(to: string, message: string, interactive?: any) {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.error("WhatsApp credentials are not configured in the .env file.");
    // Fallback to console logging if credentials are not set
    console.log(`Sending WhatsApp message to ${to}: ${message}`);
    return;
  }

  const payload: any = {
    messaging_product: "whatsapp",
    to: to,
  };

  if (interactive) {
    payload.type = "interactive";
    payload.interactive = interactive;
  } else {
    payload.type = "text";
    payload.text = {
      body: message,
    };
  }

  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Successfully sent WhatsApp message to ${to}`);
  } catch (error) {
    console.error("Error sending WhatsApp message:");
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
        console.error("Response Headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error("Request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error", error.message);
      }
      console.error("Error Config:", error.config);
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
}

export function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  let formattedPhone = phone.replace(/\D/g, '');

  // If the number starts with 254, add a +
  if (formattedPhone.startsWith('254')) {
    formattedPhone = '+' + formattedPhone;
  }
  // If the number starts with a 0, replace it with the country code
  else if (formattedPhone.startsWith('0')) {
    formattedPhone = '+254' + formattedPhone.substring(1);
  }
  // If the number does not start with a +, add the country code
  else if (!formattedPhone.startsWith('+')) {
    formattedPhone = '+254' + formattedPhone;
  }

  return formattedPhone;
}
