import { join } from "@std/path";

// Port to listen on
const port = 8000;

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // API endpoint to serve resume data
  if (pathname === "/api/resume") {
    try {
      // Import the resume data
      const resumeData = await Deno.readTextFile("./data.json").then(JSON.parse);
      return new Response(JSON.stringify(resumeData), {
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to load resume data" }), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      });
    }
  }

  // Serve static files from the public directory
  try {
    // Default to index.html for the root path
    const filePath = pathname === "/" 
      ? join("public", "index.html") 
      : join("public", pathname);
    
    const content = await Deno.readFile(filePath);
    
    // Set content type based on file extension
    const contentType = getContentType(filePath);
    
    return new Response(content, {
      headers: {
        "content-type": contentType,
      },
    });
  } catch (error) {
    // If file not found, return 404
    if (error instanceof Deno.errors.NotFound) {
      return new Response("404 Not Found", { status: 404 });
    }
    // For other errors, return 500
    return new Response("500 Internal Server Error", { status: 500 });
  }
}

// Helper function to determine content type
function getContentType(path: string): string {
  const extension = path.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "html": return "text/html";
    case "css": return "text/css";
    case "js": return "text/javascript";
    case "json": return "application/json";
    case "png": return "image/png";
    case "jpg":
    case "jpeg": return "image/jpeg";
    case "svg": return "image/svg+xml";
    default: return "text/plain";
  }
}

console.log(`HTTP server running at http://localhost:${port}/`);
Deno.serve({ port }, handler);
