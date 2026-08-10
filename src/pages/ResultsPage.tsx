import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ResultsDashboard } from "../components/results/ResultsDashboard";
import { Button } from "../components/ui/Button";
import type { StartupFormData, ValuationResult } from "../types/startup";
import { defaultFormData } from "../types/startup";

const DEFAULT_INSIGHT_SOURCE: ValuationResult["insightSource"] = {
  aiGenerated: false,
  fallbackReason: "Loaded from saved data (pre-AI version)",
};

function safeParseForm(raw: string | null): StartupFormData | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return { ...defaultFormData, ...parsed };
  } catch {
    return null;
  }
}

function safeParseResult(raw: string | null): ValuationResult | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ValuationResult>;
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.estimatedValuation !== "number") return null;
    if (!parsed.healthScore || typeof parsed.healthScore.overall !== "number")
      return null;

    const ensureArr = (v: unknown): string[] =>
      Array.isArray(v)
        ? v.filter((x): x is string => typeof x === "string")
        : [];

    return {
      estimatedValuation: parsed.estimatedValuation,
      confidenceScore:
        typeof parsed.confidenceScore === "number"
          ? parsed.confidenceScore
          : 75,
      fundingStage:
        (parsed.fundingStage as ValuationResult["fundingStage"]) || "Pre-Seed",
      investorReadiness:
        typeof parsed.investorReadiness === "number"
          ? parsed.investorReadiness
          : 50,
      growthScore:
        typeof parsed.growthScore === "number" ? parsed.growthScore : 40,
      riskLevel: (parsed.riskLevel as ValuationResult["riskLevel"]) || "Medium",
      healthScore: parsed.healthScore as ValuationResult["healthScore"],
      valuationBreakdown: Array.isArray(parsed.valuationBreakdown)
        ? parsed.valuationBreakdown
        : [],
      strengths: ensureArr(parsed.strengths),
      weaknesses: ensureArr(parsed.weaknesses),
      opportunities: ensureArr(parsed.opportunities),
      risks: ensureArr(parsed.risks),
      recommendations: ensureArr(parsed.recommendations),
      insightSource:
        parsed.insightSource && typeof parsed.insightSource === "object"
          ? {
              aiGenerated: !!parsed.insightSource.aiGenerated,
              fallbackReason: parsed.insightSource.fallbackReason as
                | string
                | undefined,
            }
          : DEFAULT_INSIGHT_SOURCE,
    };
  } catch {
    return null;
  }
}

export function ResultsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StartupFormData | null>(null);
  const [result, setResult] = useState<ValuationResult | null>(null);

  useEffect(() => {
    const storedForm = sessionStorage.getItem("startupwin-form");
    const storedResult = sessionStorage.getItem("startupwin-result");

    const parsedForm = safeParseForm(storedForm);
    const parsedResult = safeParseResult(storedResult);

    if (!parsedForm || !parsedResult) {
      sessionStorage.removeItem("startupwin-form");
      sessionStorage.removeItem("startupwin-result");
      navigate("/predict");
      return;
    }

    setFormData(parsedForm);
    setResult(parsedResult);
  }, [navigate]);

  const handleDownload = () => {
    if (!formData || !result) return;
    window.print();
  };

  if (!formData || !result) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-muted">Loading results...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8 print:hidden">
        <Link to="/predict">
          <Button variant="secondary" size="sm">
            ← New Prediction
          </Button>
        </Link>
        <Button size="sm" onClick={handleDownload}>
          Download Report (Print/PDF)
        </Button>
      </div>
      <ResultsDashboard formData={formData} result={result} />
    </div>
  );
}
