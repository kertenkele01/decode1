import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const DECODO_TOKEN = process.env.DECODO_TOKEN;


console.log("🔥 NEW SERVER VERSION LOADED");

app.post("/scrape", (req, res) => {
  console.log("SCRAPE HIT");
  res.json({ ok: true });
});

/**
 * HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.send("Decodo Tool API OK");
});

/**
 * SCRAPE TOOL
 */
app.post("/scrape", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
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
        body: JSON.stringify({ url })
      }
    );

    const data = await response.json();

    res.json({
      tool: "scrape",
      url,
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

/**
 * SEARCH (şimdilik placeholder)
 */
app.post("/search", async (req, res) => {
  res.json({
    tool: "search",
    message: "search not implemented yet"
  });
});

/**
 * START SERVER
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Tool API running on port", PORT);
});
