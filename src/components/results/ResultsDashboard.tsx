import type { ReactNode } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import type { StartupFormData, ValuationResult } from "../../types/startup";
import { formatCurrencyINR } from "../../lib/formatters";
import { Card } from "../ui/Card";
import { AnimatedCounter } from "./AnimatedCounter";

const COLORS = [
  "#E50914",
  "#FF2D2D",
  "#FF5555",
  "#FF7777",
  "#FF9999",
  "#FFBBBB",
];

const DEFAULT_INSIGHT = {
  strengths: ["Foundational business model with growth potential"],
  weaknesses: ["Limited operating history constrains full assessment"],
  opportunities: ["Explore adjacent market verticals and use cases"],
  risks: ["Market volatility remains ever-present risk"],
  recommendations: ["Continue iterating on product and customer feedback"],
};

function safeInsight(
  arr: string[] | undefined | null,
  fallback: string[],
): string[] {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr.filter(
      (x): x is string => typeof x === "string" && x.trim().length > 0,
    );
  }
  return fallback;
}

interface ResultsDashboardProps {
  formData: StartupFormData;
  result: ValuationResult;
}

function MetricCard({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <Card glow={highlight} className="text-center">
      <p className="text-xs text-muted uppercase tracking-wider mb-2">
        {label}
      </p>
      <div
        className={`text-2xl sm:text-3xl font-heading font-bold ${
          highlight ? "text-primary" : "text-white"
        }`}
      >
        {value}
      </div>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </Card>
  );
}

function InsightList({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  return (
    <Card>
      <h3 className={`font-heading font-semibold text-lg mb-4 ${color}`}>
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted">
            <span
              className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${color.replace("text-", "bg-")}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function ResultsDashboard({ formData, result }: ResultsDashboardProps) {
  const radarData = [
    { subject: "Team", score: result?.healthScore?.team ?? 50 },
    { subject: "Market", score: result?.healthScore?.market ?? 50 },
    { subject: "Revenue", score: result?.healthScore?.revenue ?? 50 },
    { subject: "Product", score: result?.healthScore?.product ?? 50 },
    { subject: "Traction", score: result?.healthScore?.traction ?? 50 },
    { subject: "Competition", score: result?.healthScore?.competition ?? 50 },
    { subject: "Scale", score: result?.healthScore?.scalability ?? 50 },
  ];

  const growthData = [
    { month: "M1", value: 20 },
    { month: "M2", value: 28 },
    { month: "M3", value: 35 },
    { month: "M4", value: 42 },
    { month: "M5", value: 55 },
    { month: "M6", value: result?.growthScore ?? 50 },
  ];

  const riskColor =
    result?.riskLevel === "Low"
      ? "text-success"
      : result?.riskLevel === "Medium"
        ? "text-warning"
        : "text-primary";

  const aiGen = !!result?.insightSource?.aiGenerated;
  const fallbackReason = result?.insightSource?.fallbackReason;

  const strengths = safeInsight(result?.strengths, DEFAULT_INSIGHT.strengths);
  const weaknesses = safeInsight(
    result?.weaknesses,
    DEFAULT_INSIGHT.weaknesses,
  );
  const opportunities = safeInsight(
    result?.opportunities,
    DEFAULT_INSIGHT.opportunities,
  );
  const risks = safeInsight(result?.risks, DEFAULT_INSIGHT.risks);
  const recommendations = safeInsight(
    result?.recommendations,
    DEFAULT_INSIGHT.recommendations,
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="text-muted text-sm mb-2">Valuation Report for</p>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold">
          {formData?.startupName || "Your Startup"}
        </h1>
        <p className="text-muted mt-2">
          {formData?.industry ?? "—"} · {formData?.productStage ?? "—"} ·{" "}
          {formData?.country ?? "—"}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
          {aiGen ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/15 border border-success/30 text-success text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              AI-Generated Insights
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/15 border border-warning/30 text-warning text-xs font-medium"
              title={fallbackReason || ""}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-warning" />
              Rule-Based Insights · Fallback Mode
            </span>
          )}
        </div>
        {!aiGen && fallbackReason && (
          <p className="mt-2 text-[11px] text-muted/80 print:hidden">
            Reason: {fallbackReason} · Start the backend server with
            OPENROUTER_API_KEY to enable AI insights.
          </p>
        )}
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Estimated Valuation"
          value={formatCurrencyINR(result.estimatedValuation)}
          highlight
        />
        <MetricCard
          label="Confidence Score"
          value={<AnimatedCounter value={result.confidenceScore} suffix="%" />}
        />
        <MetricCard label="Funding Stage" value={result.fundingStage} />
        <MetricCard
          label="Investor Readiness"
          value={
            <AnimatedCounter value={result.investorReadiness} suffix="/100" />
          }
        />
        <MetricCard
          label="Startup Health"
          value={
            <AnimatedCounter value={result.healthScore.overall} suffix="/100" />
          }
        />
        <MetricCard
          label="Growth Score"
          value={<AnimatedCounter value={result.growthScore} suffix="/100" />}
        />
        <MetricCard
          label="Risk Level"
          value={<span className={riskColor}>{result.riskLevel}</span>}
        />
        <MetricCard label="Product Stage" value={formData.productStage} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-heading font-semibold mb-4">
            Startup Health Radar
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#2B2B2B" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#a3a3a3", fontSize: 12 }}
              />
              <Radar
                dataKey="score"
                stroke="#E50914"
                fill="#E50914"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-heading font-semibold mb-4">
            Valuation Contribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={result.valuationBreakdown}
                dataKey="contribution"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(props) => {
                  const entry = props.payload as {
                    category: string;
                    contribution: number;
                  };
                  return `${entry.category} ${entry.contribution}%`;
                }}
                labelLine={{ stroke: "#666" }}
              >
                {result.valuationBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#151515",
                  border: "1px solid #2B2B2B",
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-heading font-semibold mb-4">
            Health Score Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={radarData} layout="vertical">
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "#a3a3a3" }}
              />
              <YAxis
                type="category"
                dataKey="subject"
                tick={{ fill: "#a3a3a3", fontSize: 12 }}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  background: "#151515",
                  border: "1px solid #2B2B2B",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="score" fill="#E50914" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-heading font-semibold mb-4">Growth Trajectory</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2B2B2B" />
              <XAxis dataKey="month" tick={{ fill: "#a3a3a3" }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#a3a3a3" }} />
              <Tooltip
                contentStyle={{
                  background: "#151515",
                  border: "1px solid #2B2B2B",
                  borderRadius: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#E50914"
                strokeWidth={2}
                dot={{ fill: "#E50914", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightList title="Strengths" items={strengths} color="text-success" />
        <InsightList
          title="Weaknesses"
          items={weaknesses}
          color="text-primary"
        />
        <InsightList
          title="Opportunities"
          items={opportunities}
          color="text-accent"
        />
        <InsightList title="Risks" items={risks} color="text-warning" />
      </div>

      <Card glow>
        <h3 className="font-heading font-semibold text-lg mb-4 text-primary">
          Recommendations to Improve Valuation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendations.map((rec, i) => (
            <div
              key={`${i}-${rec.slice(0, 20)}`}
              className="flex items-start gap-3 p-3 rounded-lg bg-bg/50 border border-border"
            >
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0 font-bold">
                {i + 1}
              </span>
              <p className="text-sm text-muted">{rec}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
