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

const StepIndicator = ({ step }: { step: number }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-xs text-foreground/60">
        <span className="font-medium">Step {step} of 3</span>
        <span>{step === 1 ? "Email" : step === 2 ? "Verify OTP" : "Profile"}</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={[
              "h-2 flex-1 rounded-full border border-border",
              n <= step ? "bg-primary border-primary/30" : "bg-secondary/10",
            ].join(" ")}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={[
              "h-2.5 w-2.5 rounded-full",
              n < step ? "bg-primary" : n === step ? "bg-secondary" : "bg-foreground/20",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
};

export const RegisterFlow = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RegisterData>({ email: "" });
  const navigate = useNavigate();

  const next = (values: Partial<RegisterData>) => {
    setData((prev) => ({ ...prev, ...values }));
    setStep((prev) => prev + 1);
  };

  const back = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const complete = () => {
    navigate("/", { replace: true });
  };

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