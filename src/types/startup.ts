export type ProductStage = "Idea" | "MVP" | "Beta" | "Live Product" | "Scaling";

export type FundingStage =
  | "Bootstrapped"
  | "Pre-Seed"
  | "Seed"
  | "Series A"
  | "Series B"
  | "Series C+";

export type RiskLevel = "Low" | "Medium" | "High";

export interface StartupFormData {
  startupName: string;
  founderName: string;
  country: string;
  foundedYear: number;
  industry: string;
  businessModel: string;

  numberOfFounders: number;
  teamSize: number;
  technicalFounders: number;
  previousStartupExperience: boolean;
  advisorAvailability: boolean;

  annualRevenue: number;
  monthlyRevenue: number;
  monthlyBurnRate: number;
  profitMargin: number;
  grossMargin: number;

  monthlyGrowthPercent: number;
  annualGrowthPercent: number;
  customerGrowth: number;
  revenueGrowth: number;

  productStage: ProductStage;

  totalCustomers: number;
  payingCustomers: number;
  activeUsers: number;
  retentionRate: number;
  churnRate: number;

  totalFunding: number;
  fundingStage: FundingStage;
  investors: number;
  grants: number;

  tam: number;
  sam: number;
  som: number;

  numberOfCompetitors: number;
  competitiveAdvantage: string;
  patentIp: boolean;
  marketDifferentiation: string;

  aiUsage: boolean;
  cloudInfrastructure: boolean;
  security: boolean;
  scalability: number;
  techStack: string;
}

export interface HealthScores {
  overall: number;
  team: number;
  market: number;
  revenue: number;
  product: number;
  traction: number;
  competition: number;
  scalability: number;
}

export interface ValuationBreakdown {
  category: string;
  contribution: number;
}

export interface InsightSource {
  aiGenerated: boolean;
  fallbackReason?: string;
}

export interface ValuationResult {
  estimatedValuation: number;
  confidenceScore: number;
  fundingStage: FundingStage;
  investorReadiness: number;
  growthScore: number;
  riskLevel: RiskLevel;
  healthScore: HealthScores;
  valuationBreakdown: ValuationBreakdown[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  risks: string[];
  recommendations: string[];
  insightSource: InsightSource;
}

export const defaultFormData: StartupFormData = {
  startupName: "",
  founderName: "",
  country: "India",
  foundedYear: new Date().getFullYear(),
  industry: "SaaS",
  businessModel: "Subscription",

  numberOfFounders: 1,
  teamSize: 3,
  technicalFounders: 1,
  previousStartupExperience: false,
  advisorAvailability: false,

  annualRevenue: 0,
  monthlyRevenue: 0,
  monthlyBurnRate: 0,
  profitMargin: 0,
  grossMargin: 0,

  monthlyGrowthPercent: 0,
  annualGrowthPercent: 0,
  customerGrowth: 0,
  revenueGrowth: 0,

  productStage: "MVP",

  totalCustomers: 0,
  payingCustomers: 0,
  activeUsers: 0,
  retentionRate: 0,
  churnRate: 0,

  totalFunding: 0,
  fundingStage: "Bootstrapped",
  investors: 0,
  grants: 0,

  tam: 0,
  sam: 0,
  som: 0,

  numberOfCompetitors: 5,
  competitiveAdvantage: "",
  patentIp: false,
  marketDifferentiation: "",

  aiUsage: false,
  cloudInfrastructure: true,
  security: false,
  scalability: 5,
  techStack: "",
};
