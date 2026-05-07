import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const TOKEN = process.env.DECODO_TOKEN;

app.post("/mcp", async (req, res) => {
  try {
    const { tool, arguments: args } = req.body;

    if (tool === "scrape") {
      const response = await fetch("https://scraper-api.decodo.com/v2/scrape", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: args.url
        })
      });

      const data = await response.json();

      return res.json({
        content: [
          {
            type: "text",
            text: JSON.stringify(data)
          }
        ]
      });
    }

    res.status(400).json({ error: "Unknown tool" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Decodo MCP OK");
});

app.listen(3000, () => {
  console.log("running on 3000");
});
