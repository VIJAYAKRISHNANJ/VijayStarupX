import type {
  FundingStage,
  RiskLevel,
  StartupFormData,
  ValuationResult,
} from "../types/startup";

const INDUSTRY_MULTIPLES: Record<string, number> = {
  SaaS: 12,
  FinTech: 10,
  EdTech: 8,
  AI: 15,
  Healthcare: 9,
  "E-Commerce": 6,
  Logistics: 7,
  Gaming: 8,
};

const STAGE_MULTIPLIERS: Record<string, number> = {
  Idea: 0.3,
  MVP: 0.6,
  Beta: 0.85,
  "Live Product": 1.0,
  Scaling: 1.35,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function scoreTeam(data: StartupFormData): number {
  let score = 40;
  score += Math.min(data.numberOfFounders * 8, 16);
  score += Math.min(data.teamSize * 2, 20);
  score += Math.min(data.technicalFounders * 6, 18);
  if (data.previousStartupExperience) score += 12;
  if (data.advisorAvailability) score += 8;
  return clamp(score, 0, 100);
}

function scoreMarket(data: StartupFormData): number {
  if (data.tam <= 0) return 35;
  const tamCr = data.tam / 1e7;
  let score = 30;
  if (tamCr >= 1000) score += 35;
  else if (tamCr >= 500) score += 28;
  else if (tamCr >= 100) score += 20;
  else if (tamCr >= 10) score += 12;
  else score += 5;

  if (data.sam > 0 && data.tam > 0) {
    const samRatio = data.sam / data.tam;
    score += samRatio > 0.3 ? 15 : samRatio > 0.1 ? 10 : 5;
  }
  if (data.som > 0 && data.sam > 0) {
    const somRatio = data.som / data.sam;
    score += somRatio > 0.05 ? 10 : 5;
  }
  return clamp(score, 0, 100);
}

function scoreRevenue(data: StartupFormData): number {
  const arr = data.annualRevenue || data.monthlyRevenue * 12;
  if (arr <= 0) return 15;
  let score = 25;
  const arrCr = arr / 1e7;
  if (arrCr >= 10) score += 45;
  else if (arrCr >= 5) score += 38;
  else if (arrCr >= 1) score += 30;
  else if (arrCr >= 0.5) score += 22;
  else if (arrCr >= 0.1) score += 15;
  else score += 8;

  if (data.grossMargin >= 70) score += 15;
  else if (data.grossMargin >= 50) score += 10;
  else if (data.grossMargin >= 30) score += 5;

  if (data.profitMargin > 0) score += 10;
  return clamp(score, 0, 100);
}

function scoreProduct(data: StartupFormData): number {
  const stageScores: Record<string, number> = {
    Idea: 20,
    MVP: 45,
    Beta: 65,
    "Live Product": 80,
    Scaling: 95,
  };
  return stageScores[data.productStage] ?? 40;
}

function scoreTraction(data: StartupFormData): number {
  let score = 20;
  if (data.payingCustomers >= 1000) score += 30;
  else if (data.payingCustomers >= 100) score += 22;
  else if (data.payingCustomers >= 10) score += 14;
  else if (data.payingCustomers > 0) score += 8;

  if (data.retentionRate >= 90) score += 20;
  else if (data.retentionRate >= 75) score += 14;
  else if (data.retentionRate >= 50) score += 8;

  if (data.churnRate <= 2) score += 15;
  else if (data.churnRate <= 5) score += 10;
  else if (data.churnRate <= 10) score += 5;

  score += clamp(data.monthlyGrowthPercent * 1.5, 0, 20);
  return clamp(score, 0, 100);
}

function scoreCompetition(data: StartupFormData): number {
  let score = 50;
  if (data.numberOfCompetitors <= 3) score += 25;
  else if (data.numberOfCompetitors <= 10) score += 10;
  else score -= 10;

  if (data.patentIp) score += 15;
  if (data.competitiveAdvantage.length > 20) score += 10;
  if (data.marketDifferentiation.length > 20) score += 8;
  return clamp(score, 0, 100);
}

function scoreScalability(data: StartupFormData): number {
  let score = data.scalability * 8;
  if (data.cloudInfrastructure) score += 10;
  if (data.aiUsage) score += 12;
  if (data.security) score += 8;
  return clamp(score, 0, 100);
}

function predictFundingStage(
  data: StartupFormData,
  valuation: number,
): FundingStage {
  const arr = data.annualRevenue || data.monthlyRevenue * 12;
  const valCr = valuation / 1e7;

  if (data.totalFunding === 0 && arr < 1e6 && data.productStage === "Idea") {
    return "Bootstrapped";
  }
  if (valCr < 5 || data.totalFunding < 5e6) return "Pre-Seed";
  if (valCr < 25 || data.totalFunding < 5e7) return "Seed";
  if (valCr < 100 || data.totalFunding < 2e8) return "Series A";
  if (valCr < 500) return "Series B";
  return "Series C+";
}

function computeGrowthScore(data: StartupFormData): number {
  const growth =
    data.annualGrowthPercent ||
    data.monthlyGrowthPercent * 12 ||
    data.revenueGrowth ||
    data.customerGrowth;
  return clamp(Math.round(growth * 1.2 + 20), 0, 100);
}

function computeRiskLevel(
  data: StartupFormData,
  healthOverall: number,
): RiskLevel {
  let riskPoints = 0;
  const runway =
    data.monthlyBurnRate > 0
      ? (data.totalFunding || data.monthlyRevenue * 6) / data.monthlyBurnRate
      : 24;

  if (runway < 6) riskPoints += 3;
  else if (runway < 12) riskPoints += 2;
  if (data.churnRate > 10) riskPoints += 2;
  if (data.numberOfCompetitors > 15) riskPoints += 2;
  if (healthOverall < 40) riskPoints += 2;
  if (data.teamSize < 3) riskPoints += 1;

  if (riskPoints >= 5) return "High";
  if (riskPoints >= 2) return "Medium";
  return "Low";
}

type HealthScoresComputed = ValuationResult["healthScore"];
type InsightArrays = Pick<
  ValuationResult,
  "strengths" | "weaknesses" | "opportunities" | "risks" | "recommendations"
>;

export function generateFallbackInsights(
  data: StartupFormData,
  scores: HealthScoresComputed,
): InsightArrays {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const risks: string[] = [];
  const recommendations: string[] = [];

  if (scores.traction >= 70)
    strengths.push(
      `Excellent traction score of ${scores.traction}/100 — customer growth and retention metrics are ahead of industry benchmarks for ${data.productStage} stage.`,
    );
  if (scores.revenue >= 65) {
    const arr = data.annualRevenue || data.monthlyRevenue * 12;
    strengths.push(
      `Strong recurring revenue foundation (Score: ${scores.revenue}/100) with ARR of ₹${arr.toLocaleString("en-IN")} and gross margin of ${data.grossMargin}%.`,
    );
  }
  if (scores.market >= 70)
    strengths.push(
      `Large addressable market opportunity (Score: ${scores.market}/100) with TAM of ₹${data.tam.toLocaleString("en-IN")} — indicates significant headroom for scale.`,
    );
  if (scores.team >= 70)
    strengths.push(
      `Capable founding team (Score: ${scores.team}/100) with ${data.numberOfFounders} founders, ${data.teamSize} team members, ${
        data.previousStartupExperience
          ? "prior startup experience"
          : "relevant domain expertise"
      }, and ${data.technicalFounders} technical founder(s).`,
    );
  if (data.aiUsage)
    strengths.push(
      "AI/ML integration in the product stack provides a differentiated competitive edge and potential for premium valuation multiples.",
    );
  if (data.patentIp)
    strengths.push(
      "Patent and IP protection creates defensible moats against competitors and enhances enterprise acquisition appeal.",
    );

  if (scores.team < 50)
    weaknesses.push(
      `Team score of ${scores.team}/100 is below average — ${data.teamSize} total members with ${data.technicalFounders} technical founder(s). Consider strengthening advisory and technical bench.`,
    );
  if (data.grossMargin < 40 && data.grossMargin > 0)
    weaknesses.push(
      `Gross margin of ${data.grossMargin}% compresses valuation potential compared to ${data.industry} peers (typical 50-70%). Unit economics need optimization.`,
    );
  if (data.churnRate > 8)
    weaknesses.push(
      `Churn rate of ${data.churnRate}% is elevated. Sustainable unit economics require churn under 5% monthly for most SaaS/business models.`,
    );
  if (scores.product < 50)
    weaknesses.push(
      `Product maturity score of ${scores.product}/100 (${data.productStage} stage) limits investor confidence and revenue-based valuation multiples.`,
    );
  if (
    data.monthlyBurnRate > data.monthlyRevenue * 2 &&
    data.monthlyBurnRate > 0
  ) {
    const runway =
      data.monthlyBurnRate > 0
        ? Math.round(
            (data.totalFunding || data.monthlyRevenue * 6) /
              data.monthlyBurnRate,
          )
        : 0;
    weaknesses.push(
      `Burn rate (₹${data.monthlyBurnRate.toLocaleString("en-IN")}/mo) is more than 2× monthly revenue with only ~${runway} months of runway.`,
    );
  }

  if (data.tam > data.sam * 5)
    opportunities.push(
      `TAM is ${Math.round(data.tam / data.sam)}× larger than SAM — expand into adjacent vertical segments and use cases to capture a broader market.`,
    );
  if (data.productStage === "Live Product" || data.productStage === "Scaling") {
    opportunities.push(
      `Given ${data.productStage} stage, pursue enterprise customer acquisition and channel partnerships to accelerate ARR from the current ₹${(
        (data.annualRevenue || data.monthlyRevenue * 12) / 1e7
      ).toFixed(1)}Cr run-rate.`,
    );
  }
  if (scores.market >= 60)
    opportunities.push(
      `Market score of ${scores.market}/100 supports international expansion — prioritize adjacent geographies with similar regulatory and competitive dynamics to ${data.country}.`,
    );
  opportunities.push(
    "Develop strategic partnerships with 1-2 industry incumbents to unlock distribution, co-sell motion, and enterprise credibility.",
  );

  if (data.numberOfCompetitors > 10)
    risks.push(
      `${data.numberOfCompetitors} identified competitors indicate heavy market competition in the ${data.industry} sector — pricing compression and customer acquisition cost escalation are real risks.`,
    );
  if (
    data.monthlyBurnRate > 0 &&
    data.totalFunding / data.monthlyBurnRate < 12
  ) {
    const runway = Math.round(data.totalFunding / data.monthlyBurnRate);
    risks.push(
      `Cash runway of only ~${runway} months. A failed fundraising attempt could force cost cuts or down-round scenario.`,
    );
  }
  if (
    data.payingCustomers > 0 &&
    data.payingCustomers / data.totalCustomers < 0.1
  ) {
    const conv = Math.round((data.payingCustomers / data.totalCustomers) * 100);
    risks.push(
      `Monetization conversion rate is just ${conv}% — freemium-to-paid funnel is underperforming, threatening revenue predictability.`,
    );
  }
  if (scores.competition < 45)
    risks.push(
      `Competitive differentiation score of ${scores.competition}/100 indicates weak moats — new entrants and incumbents can easily replicate the value proposition.`,
    );

  if (data.retentionRate < 70)
    recommendations.push(
      `Improve retention from current ${data.retentionRate}% toward 80%+ by re-architecting onboarding flows and building customer success motion. Every +5pt retention lifts LTV by ~25%.`,
    );
  if (data.grossMargin < 50)
    recommendations.push(
      `Optimize gross margins from ${data.grossMargin}% to 55%+ via pricing tiering, COGS rationalization, and reducing cost-to-serve through automation.`,
    );
  if (!data.advisorAvailability)
    recommendations.push(
      "Recruit 1-2 seasoned operators or angel investors as formal advisors to unlock introductions, credibility, and pattern-matching expertise.",
    );
  if (data.tam === 0)
    recommendations.push(
      "Commission credible third-party TAM analysis (Gartner/Statista-style) to back market sizing with investor-grade data points.",
    );
  if (!data.security)
    recommendations.push(
      "Implement SOC 2 Type I baseline and data security program — enterprise buyers increasingly require security diligence before contracting.",
    );
  recommendations.push(
    "Increase recurring revenue share by migrating ad-hoc/project revenue streams to structured subscription or retainer contracts.",
  );

  if (strengths.length === 0)
    strengths.push(
      "Foundational business model with identifiable revenue pathways and a clear target market segment to build upon.",
    );
  if (weaknesses.length === 0)
    weaknesses.push(
      "Limited historical operating data constrains full diagnostic depth — more data points (3+ months) will sharpen accuracy.",
    );
  if (risks.length === 0)
    risks.push(
      "Market volatility and macroeconomic factors remain ever-present risks to fundraising timelines and revenue predictability.",
    );

  return { strengths, weaknesses, opportunities, risks, recommendations };
}

export function calculateValuation(data: StartupFormData): ValuationResult {
  const team = scoreTeam(data);
  const market = scoreMarket(data);
  const revenue = scoreRevenue(data);
  const product = scoreProduct(data);
  const traction = scoreTraction(data);
  const competition = scoreCompetition(data);
  const scalability = scoreScalability(data);

  const overall = Math.round(
    team * 0.15 +
      market * 0.15 +
      revenue * 0.2 +
      product * 0.12 +
      traction * 0.18 +
      competition * 0.1 +
      scalability * 0.1,
  );

  const arr = data.annualRevenue || data.monthlyRevenue * 12;
  const industryMultiple = INDUSTRY_MULTIPLES[data.industry] ?? 8;
  const stageMultiplier = STAGE_MULTIPLIERS[data.productStage] ?? 1;

  const growthBoost = 1 + clamp(data.monthlyGrowthPercent / 100, 0, 0.5);
  const teamBoost = 1 + (team - 50) / 200;
  const marketBoost = 1 + (market - 50) / 250;
  const tractionBoost = 1 + (traction - 50) / 200;

  let baseValuation = arr * industryMultiple * stageMultiplier;
  if (baseValuation < 1e7) {
    baseValuation = 1e7 * stageMultiplier * (overall / 50);
  }

  const estimatedValuation = Math.round(
    baseValuation * growthBoost * teamBoost * marketBoost * tractionBoost,
  );

  const fundingStage = predictFundingStage(data, estimatedValuation);
  const growthScore = computeGrowthScore(data);
  const investorReadiness = clamp(
    Math.round(
      overall * 0.4 + growthScore * 0.3 + product * 0.2 + revenue * 0.1,
    ),
    0,
    100,
  );

  const dataCompleteness = [
    data.startupName,
    data.industry,
    data.productStage,
    arr > 0,
    data.teamSize > 0,
    data.tam > 0,
  ].filter(Boolean).length;

  const confidenceScore = clamp(
    Math.round(55 + dataCompleteness * 6 + overall * 0.15),
    65,
    95,
  );

  const riskLevel = computeRiskLevel(data, overall);

  const rawBreakdown = [
    { category: "Industry", weight: industryMultiple / 15 },
    { category: "Revenue", weight: revenue / 100 },
    { category: "Growth", weight: growthScore / 100 },
    { category: "Team", weight: team / 100 },
    { category: "Market Size", weight: market / 100 },
    { category: "Technology", weight: scalability / 100 },
  ];

  const totalWeight = rawBreakdown.reduce((s, b) => s + b.weight, 0);
  const valuationBreakdown = rawBreakdown.map((b) => ({
    category: b.category,
    contribution: Math.round((b.weight / totalWeight) * 100),
  }));

  const healthScore = {
    overall,
    team,
    market,
    revenue,
    product,
    traction,
    competition,
    scalability,
  };

  const fallback = generateFallbackInsights(data, healthScore);

  return {
    estimatedValuation,
    confidenceScore,
    fundingStage,
    investorReadiness,
    growthScore,
    riskLevel,
    healthScore,
    valuationBreakdown,
    ...fallback,
    insightSource: {
      aiGenerated: false,
      fallbackReason: "AI augmentation not yet applied",
    },
  };
}

export async function fetchAIInsights(
  formData: StartupFormData,
  baseResult: ValuationResult,
): Promise<{
  insights: InsightArrays | null;
  error?: string;
}> {
  const metrics = {
    estimatedValuation: baseResult.estimatedValuation,
    fundingStage: baseResult.fundingStage,
    investorReadiness: baseResult.investorReadiness,
    growthScore: baseResult.growthScore,
    riskLevel: baseResult.riskLevel,
    confidenceScore: baseResult.confidenceScore,
    healthScore: baseResult.healthScore,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch("/api/generate-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData, metrics }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const payload = (await res.json().catch(() => ({}))) as {
      aiGenerated?: boolean;
      error?: string;
      strengths?: string[];
      weaknesses?: string[];
      opportunities?: string[];
      risks?: string[];
      recommendations?: string[];
    };

    if (!res.ok || !payload.aiGenerated) {
      return {
        insights: null,
        error: payload.error || `HTTP ${res.status}`,
      };
    }

    const required: Array<keyof InsightArrays> = [
      "strengths",
      "weaknesses",
      "opportunities",
      "risks",
      "recommendations",
    ];
    for (const key of required) {
      if (!Array.isArray(payload[key]) || payload[key]!.length === 0) {
        return { insights: null, error: `AI response missing ${key}` };
      }
    }

    return {
      insights: {
        strengths: payload.strengths!.slice(0, 6),
        weaknesses: payload.weaknesses!.slice(0, 6),
        opportunities: payload.opportunities!.slice(0, 6),
        risks: payload.risks!.slice(0, 6),
        recommendations: payload.recommendations!.slice(0, 8),
      },
    };
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.name === "AbortError"
          ? "AI request timed out after 15s"
          : err.message
        : "Unknown error";
    return { insights: null, error: msg };
  }
}

export async function calculateValuationWithAI(
  data: StartupFormData,
): Promise<ValuationResult> {
  const base = calculateValuation(data);

  const ai = await fetchAIInsights(data, base);

  if (ai.insights) {
    return {
      ...base,
      ...ai.insights,
      insightSource: { aiGenerated: true },
    };
  }

  const fallback = generateFallbackInsights(data, base.healthScore);
  return {
    ...base,
    ...fallback,
    insightSource: {
      aiGenerated: false,
      fallbackReason: ai.error || "AI unavailable",
    },
  };
}

export function simulateProcessingDelay(ms = 2800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
