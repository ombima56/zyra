import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";

/**
 * Decrypts an encrypted ciphertext using the provided secret.
 *
 * @param {string} ciphertext - The ciphertext to decrypt.
 * @param {string} secret - The secret to use for decryption.
 * @returns {string} - The decrypted plaintext.
 */
const decrypt = (ciphertext: string, secret: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Handles the POST request to decrypt an encrypted secret.
 *
 * Expects a JSON body with `encryptedSecret` and `password` fields.
 * Returns a JSON response with the decrypted secret if successful.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response containing the decrypted secret or an error message.
 */

export async function POST(request: Request) {
  try {
    const { encryptedSecret, password } = await request.json();

    if (!encryptedSecret || !password) {
      return NextResponse.json(
        { error: "Missing encrypted secret or password" },
        { status: 400 }
      );
    }

    const decryptedSecret = decrypt(encryptedSecret, password);

    return NextResponse.json({ decryptedSecret }, { status: 200 });
  } catch (error: any) {
    console.error("Decryption error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
