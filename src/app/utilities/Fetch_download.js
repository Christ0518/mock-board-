export default async function Fetch_to(
  dir,
  payload = {},
  headers = { "x-api-key": process.env.API_KEY || "" },
  retries = 3,
  delay = 1000,
  expectBlob = false // <-- new flag
) {
  if (!dir || dir === "") {
    if (typeof window !== "undefined") alert("Invalid API Directory not found");
    return { success: false, message: "Invalid API Directory" };
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(dir, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        return { success: false, message: errText || `Request failed: ${response.status}` };
      }

      const data = expectBlob ? await response.blob() : await response.json().catch(() => null);

      return { success: true, data };
    } catch (err) {
      let message = "Unknown fetch error";
      if (err instanceof Error) message = err.message;
      console.error(`Attempt ${attempt} fetch error:`, message);
    }

    if (attempt < retries) await new Promise(res => setTimeout(res, delay));
  }

  return { success: false, message: `All ${retries} attempts failed for ${dir}` };
}
