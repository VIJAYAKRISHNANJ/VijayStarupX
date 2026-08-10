import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

function buildPrompt(payload) {
  const { formData, metrics } = payload;
  const hs = metrics.healthScore;

  const arr = formData.annualRevenue || formData.monthlyRevenue * 12;
  const runwayMonths =
    formData.monthlyBurnRate > 0
      ? Math.round(
          (formData.totalFunding || formData.monthlyRevenue * 6) /
            formData.monthlyBurnRate,
        )
      : 24;
  const payConv =
    formData.totalCustomers > 0
      ? Math.round((formData.payingCustomers / formData.totalCustomers) * 100)
      : 0;
  const somSamRatio =
    formData.sam > 0 && formData.som > 0
      ? Math.round((formData.som / formData.sam) * 100)
      : 0;
  const samTamRatio =
    formData.tam > 0 && formData.sam > 0
      ? Math.round((formData.sam / formData.tam) * 100)
      : 0;

  return `You are an expert startup valuation analyst with deep experience in VC due diligence at top-tier firms.

Below is comprehensive data about a startup. Your task is to analyze it and output exactly 5 sections of insights in valid JSON format.

=== STARTUP PROFILE ===
Company: ${formData.startupName || "[Not Provided]"}
Founder(s): ${formData.founderName || "[Not Provided]"}
Country: ${formData.country} | Founded: ${formData.foundedYear}
Industry: ${formData.industry} | Business Model: ${formData.businessModel}
Product Stage: ${formData.productStage} | Current Funding Stage: ${formData.fundingStage}

=== TEAM ===
Number of Founders: ${formData.numberOfFounders}
Team Size: ${formData.teamSize}
Technical Founders: ${formData.technicalFounders}
Previous Startup Experience: ${formData.previousStartupExperience ? "Yes" : "No"}
Advisors Available: ${formData.advisorAvailability ? "Yes" : "No"}
Team Score (0-100): ${hs.team}

=== FINANCIAL METRICS ===
Annual Revenue (ARR): ₹${arr.toLocaleString("en-IN")}
Monthly Revenue: ₹${formData.monthlyRevenue.toLocaleString("en-IN")}
Monthly Burn Rate: ₹${formData.monthlyBurnRate.toLocaleString("en-IN")}
Profit Margin: ${formData.profitMargin}%
Gross Margin: ${formData.grossMargin}%
Estimated Runway: ~${runwayMonths} months
Revenue Score (0-100): ${hs.revenue}

=== GROWTH ===
Monthly Growth: ${formData.monthlyGrowthPercent}%
Annual Growth: ${formData.annualGrowthPercent}%
Customer Growth: ${formData.customerGrowth}%
Revenue Growth: ${formData.revenueGrowth}%
Growth Score (0-100): ${metrics.growthScore}

=== CUSTOMERS & TRACTION ===
Total Customers: ${formData.totalCustomers}
Paying Customers: ${formData.payingCustomers}
Active Users: ${formData.activeUsers}
Retention Rate: ${formData.retentionRate}%
Churn Rate: ${formData.churnRate}%
Paying Conversion Rate: ${payConv}%
Traction Score (0-100): ${hs.traction}

=== FUNDING ===
Total Funding Raised: ₹${formData.totalFunding.toLocaleString("en-IN")}
Number of Investors: ${formData.investors}
Grants Received: ₹${formData.grants.toLocaleString("en-IN")}

=== MARKET SIZE (INR) ===
TAM (Total Addressable Market): ₹${formData.tam.toLocaleString("en-IN")}
SAM (Serviceable Addressable Market): ₹${formData.sam.toLocaleString("en-IN")}
SOM (Serviceable Obtainable Market): ₹${formData.som.toLocaleString("en-IN")}
SAM/TAM Ratio: ${samTamRatio}%
SOM/SAM Ratio: ${somSamRatio}%
Market Score (0-100): ${hs.market}

=== COMPETITION ===
Number of Competitors: ${formData.numberOfCompetitors}
Competitive Advantage: ${formData.competitiveAdvantage || "[Not specified]"}
Market Differentiation: ${formData.marketDifferentiation || "[Not specified]"}
Patent/IP Protection: ${formData.patentIp ? "Yes" : "No"}
Competition Score (0-100): ${hs.competition}

=== TECHNOLOGY ===
Tech Stack: ${formData.techStack || "[Not specified]"}
Scalability Score (1-10): ${formData.scalability}/10
AI Integration: ${formData.aiUsage ? "Yes" : "No"}
Cloud Infrastructure: ${formData.cloudInfrastructure ? "Yes" : "No"}
Security & Compliance: ${formData.security ? "Yes" : "No"}
Scalability Score (0-100): ${hs.scalability}

=== VALUATION RESULTS ===
Estimated Valuation: ₹${metrics.estimatedValuation.toLocaleString("en-IN")}
Predicted Funding Stage: ${metrics.fundingStage}
Overall Health Score (0-100): ${hs.overall}
Investor Readiness Score (0-100): ${metrics.investorReadiness}
Confidence Score: ${metrics.confidenceScore}%
Risk Level: ${metrics.riskLevel}
Product Score (0-100): ${hs.product}

=== YOUR TASK ===
Analyze the data above and generate 5 sections with specific, actionable, and tailored insights. Do NOT use generic platitudes. Reference the actual numbers and specifics above whenever possible.

1. "strengths" — Array of 3-5 specific, data-backed strengths. Mention exact scores or metrics when highlighting what this startup does well.
2. "weaknesses" — Array of 3-5 specific, constructive weaknesses. Reference the actual data points that indicate areas of concern.
3. "opportunities" — Array of 3-5 concrete growth opportunities specific to this startup's industry, stage, market, and current trajectory.
4. "risks" — Array of 3-5 specific, prioritized risks the startup faces, grounded in its actual financial, market, competitive, or team data.
5. "recommendations" — Array of 5-7 prioritized, actionable recommendations to improve valuation, investor readiness, and overall health. Be specific and tie each to a quantifiable metric.

OUTPUT REQUIREMENTS:
- Respond ONLY with raw JSON, no markdown, no code fences, no explanations.
- Output must be valid JSON parseable by JSON.parse().
- Do not include any text before or after the JSON object.
- All 5 arrays must be present and non-empty.
- Each string should be a complete sentence, concise (1-2 lines), and professional.
- Do not invent or fabricate data; only use what is provided above.

Example output format:
{"strengths":["..."],"weaknesses":["..."],"opportunities":["..."],"risks":["..."],"recommendations":["..."]}`;
}

app.post("/api/generate-insights", async (req, res) => {
  try {
    const { formData, metrics } = req.body;

    if (!formData || !metrics) {
      return res
        .status(400)
        .json({ error: "Missing formData or metrics in request body" });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(501).json({
        error: "AI_API_NOT_CONFIGURED",
        message:
          "OpenRouter API key is not configured. Using fallback insights.",
      });
    }

    const prompt = buildPrompt({ formData, metrics });

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
          "X-Title": "VijayX StartupWin",
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || "openrouter/quasar-alpha",
          messages: [
            {
              role: "system",
              content:
                "You are a senior VC analyst. Always output valid JSON with exactly 5 keys: strengths, weaknesses, opportunities, risks, recommendations. Each value is a non-empty array of strings. No markdown, no explanations, only JSON.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
          max_tokens: 2500,
          response_format: { type: "json_object" },
        }),
      },
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error(`OpenRouter API error: ${response.status} ${errText}`);
      return res.status(502).json({
        error: "AI_API_ERROR",
        message: `AI provider returned status ${response.status}`,
      });
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content;

    if (!rawContent) {
      return res.status(502).json({
        error: "AI_EMPTY_RESPONSE",
        message: "AI returned empty content",
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      const cleaned = rawContent
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        return res.status(502).json({
          error: "AI_JSON_PARSE_ERROR",
          message: "AI response was not valid JSON",
        });
      }
    }

    const required = [
      "strengths",
      "weaknesses",
      "opportunities",
      "risks",
      "recommendations",
    ];
    for (const key of required) {
      if (!Array.isArray(parsed[key]) || parsed[key].length === 0) {
        return res.status(502).json({
          error: "AI_MISSING_FIELDS",
          message: `AI response missing non-empty array for: ${key}`,
        });
      }
    }

    const sanitized = {};
    for (const key of required) {
      sanitized[key] = parsed[key]
        .filter((s) => typeof s === "string" && s.trim().length > 0)
        .map((s) => s.trim())
        .slice(0, 8);
    }

    res.json({
      aiGenerated: true,
      ...sanitized,
    });
  } catch (err) {
    console.error("Server error in /api/generate-insights:", err);
    res.status(500).json({
      error: "SERVER_ERROR",
      message: err.message || "Internal server error",
    });
  }
});

app.get("/api/health", (_req, res) => {
  const configured = !!process.env.OPENROUTER_API_KEY;
  res.json({
    status: "ok",
    aiConfigured: configured,
    model: process.env.OPENROUTER_MODEL || "openrouter/quasar-alpha",
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 VijayX StartupWin Backend running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(
    `   AI configured: ${process.env.OPENROUTER_API_KEY ? "YES" : "NO (fallback mode)"}`,
  );
  console.log(`\n   Set OPENROUTER_API_KEY in .env to enable AI insights.\n`);
});
