import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));

const ESPN = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba";
const ESPN_V2 = "https://site.api.espn.com/apis/v2/sports/basketball/nba";

async function proxy(url, res) {
  try {
    const response = await fetch(url, { headers: { "User-Agent": "NBA-PRO-ANALYST/1.0" } });
    if (!response.ok) return res.status(response.status).json({ error: "Source NBA temporairement indisponible." });
    res.json(await response.json());
  } catch {
    res.status(502).json({ error: "Impossible de récupérer les données NBA pour le moment." });
  }
}
app.get("/api/scoreboard", (req, res) => proxy(`${ESPN}/scoreboard`, res));
app.get("/api/teams", (req, res) => proxy(`${ESPN}/teams?limit=50`, res));
app.get("/api/standings", (req, res) => proxy(`${ESPN_V2}/standings`, res));
app.get("/health", (_req, res) => res.json({ ok: true, app: "NBA PRO ANALYST" }));
app.get("*", (_req, res) => res.sendFile(process.cwd() + "/public/index.html"));
app.listen(PORT, () => console.log(`NBA PRO ANALYST running on ${PORT}`));