import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { MultiStepForm, FORM_STEPS } from "../components/form/MultiStepForm";
import { ProcessingAnimation } from "../components/results/ProcessingAnimation";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import {
  calculateValuation,
  calculateValuationWithAI,
} from "../lib/valuationEngine";
import { defaultFormData, type StartupFormData } from "../types/startup";

const MIN_PROCESSING_MS = 1500;

export function PredictPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<StartupFormData>(defaultFormData);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const progress = ((step + 1) / FORM_STEPS.length) * 100;

  const handleChange = (updates: Partial<StartupFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setErrorMsg(null);
  };

  const handleNext = async () => {
    if (step < FORM_STEPS.length - 1) {
      setStep((s) => s + 1);
      setErrorMsg(null);
      return;
    }

    setProcessing(true);
    setErrorMsg(null);

    const startedAt = Date.now();
    try {
      const result = await calculateValuationWithAI(formData);
      const elapsed = Date.now() - startedAt;
      const wait = Math.max(0, MIN_PROCESSING_MS - elapsed);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));

      sessionStorage.setItem("startupwin-form", JSON.stringify(formData));
      sessionStorage.setItem("startupwin-result", JSON.stringify(result));
      navigate("/results");
    } catch (err) {
      console.error("Valuation pipeline failed:", err);

      const fallback = calculateValuation(formData);
      const elapsed = Date.now() - startedAt;
      const wait = Math.max(0, MIN_PROCESSING_MS - elapsed);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));

      sessionStorage.setItem("startupwin-form", JSON.stringify(formData));
      sessionStorage.setItem("startupwin-result", JSON.stringify(fallback));
      navigate("/results");
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
    setErrorMsg(null);
  };

  if (processing) {
    return <ProcessingAnimation />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">
          Startup Valuation Form
        </h1>
        <p className="text-muted text-sm">
          Step {step + 1} of {FORM_STEPS.length} — {FORM_STEPS[step]}
        </p>
        <div className="mt-4 h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-1 mt-3 flex-wrap">
          {FORM_STEPS.map((label, i) => (
            <span
              key={label}
              className={`text-xs px-2 py-0.5 rounded-full ${
                i === step
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : i < step
                    ? "bg-success/10 text-success"
                    : "bg-border/50 text-muted"
              }`}
            >
              {i + 1}
            </span>
          ))}
        </div>
      </div>

      {errorMsg && (
        <Card className="mb-6 border-primary/50 bg-primary/5">
          <div className="flex items-start gap-3">
            <span className="text-primary text-xl shrink-0">⚠</span>
            <div>
              <h3 className="font-heading font-semibold text-primary mb-1">
                Something went wrong
              </h3>
              <p className="text-sm text-muted">{errorMsg}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="mb-6">
        <h2 className="font-heading font-semibold text-xl mb-6">
          {FORM_STEPS[step]}
        </h2>
        <AnimatePresence mode="wait">
          <MultiStepForm step={step} data={formData} onChange={handleChange} />
        </AnimatePresence>
      </Card>

      <div className="flex justify-between gap-4">
        <Button variant="secondary" onClick={handleBack} disabled={step === 0}>
          ← Back
        </Button>
        <Button onClick={handleNext}>
          {step === FORM_STEPS.length - 1
            ? "Generate Valuation →"
            : "Continue →"}
        </Button>
      </div>
    </div>
  );
}
