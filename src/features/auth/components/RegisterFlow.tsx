import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterStepEmail } from "./RegisterStep1";
import { RegisterStepOtp } from "./RegisterStep2";
import { RegisterStepProfile } from "./RegisterStep3";

export type RegisterData = {
  email: string;
  emailToken?: string;
  otp?: string;
  verifyToken?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
};

const STEPS = [
  { n: 1, label: "Email" },
  { n: 2, label: "Verify" },
  { n: 3, label: "Profile" },
];

const StepIndicator = ({ step }: { step: number }) => (
  <div className="mb-8" aria-label={`Step ${step} of 3`}>
    <div className="flex items-center gap-0">
      {STEPS.map(({ n, label }, idx) => {
        const done    = n < step;
        const active  = n === step;
        const isLast  = idx === STEPS.length - 1;

        return (
          <div key={n} className="flex items-center flex-1 last:flex-none">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={[
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                  done   ? "bg-primary border-primary text-white"
                         : active ? "bg-background border-primary text-primary"
                         : "bg-background border-border text-foreground/30",
                ].join(" ")}
                aria-current={active ? "step" : undefined}
              >
                {done ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : n}
              </div>
              <span className={[
                "text-[10px] font-semibold uppercase tracking-wide",
                active ? "text-primary" : done ? "text-primary/60" : "text-foreground/30",
              ].join(" ")}>
                {label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex-1 h-[2px] mx-2 mb-4 rounded-full overflow-hidden bg-border">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: done ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export const RegisterFlow = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RegisterData>({ email: "" });
  const navigate = useNavigate();

  const next = (values: Partial<RegisterData>) => {
    setData((prev) => ({ ...prev, ...values }));
    setStep((prev) => prev + 1);
  };

  const back = () => setStep((prev) => Math.max(prev - 1, 1));

  const complete = () => navigate("/", { replace: true });

  return (
    <>
      <StepIndicator step={step} />

      {step === 1 && <RegisterStepEmail onNext={next} />}

      {step === 2 && (
        <RegisterStepOtp
          email={data.email}
          token={data.emailToken ?? ""}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 3 && (
        <RegisterStepProfile
          email={data.email}
          token={data.verifyToken ?? ""}
          onNext={next}
          onBack={back}
          onComplete={complete}
        />
      )}
    </>
  );
};