import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ENV: Coolify'den gelecek
const DECODO_TOKEN = process.env.DECODO_TOKEN;

/**
 * ROOT TEST
 * Coolify health check
 */
app.get("/", (req, res) => {
  res.send("Decodo MCP OK");
});

/**
 * MCP ENDPOINT
 * LiteLLM / Agent burayı çağıracak
 */
app.post("/mcp", async (req, res) => {
  try {
    console.log("MCP REQUEST:", JSON.stringify(req.body));

    const { tool, arguments: args } = req.body;

    if (!tool) {
      return res.status(400).json({
        error: "tool is required"
      });
    }

    /**
     * SCRAPE TOOL
     */
    if (tool === "scrape") {
      if (!args?.url) {
        return res.status(400).json({
          error: "url is required"
        });
      }

      const response = await fetch(
        "https://scraper-api.decodo.com/v2/scrape",
        {
          method: "POST",
          headers: {
            "Authorization": `Basic ${DECODO_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url: args.url
          })
        }
      );

      const data = await response.json();

      return res.json({
        tool: "scrape",
        url: args.url,
        content: [
          {
            type: "text",
            text: JSON.stringify(data)
          }
        ]
      });
    }

    /**
     * UNKNOWN TOOL
     */
    return res.status(400).json({
      error: "Unknown tool",
      got: tool
    });

  } catch (err) {
    console.error("MCP ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
});

/**
 * START SERVER
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});
