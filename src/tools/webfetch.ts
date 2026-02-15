const USER_AGENT = "Mozilla/5.0 (compatible; MCP-Server/1.0)";

export async function webfetch(url: string, format: "text" | "json" | "html" = "text"): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  
  if (contentType.includes("application/json") || format === "json") {
    const data = await response.json();
    return JSON.stringify(data, null, 2);
  } else {
    const text = await response.text();
    
    if (format === "html") {
      return text;
    }
    
    // Clean HTML to extract readable text
    return text
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
}
