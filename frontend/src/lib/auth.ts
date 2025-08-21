export async function checkUserSession() {
  try {
    const res = await fetch("/api/user");
    if (res.ok) {
      const userData = await res.json();
      return { isLoggedIn: true, publicKey: userData.publicKey };
    } else {
      return { isLoggedIn: false, publicKey: null };
    }
  } catch (error) {
    console.error("Error checking user session:", error);
    return { isLoggedIn: false, publicKey: null };
  }
}
