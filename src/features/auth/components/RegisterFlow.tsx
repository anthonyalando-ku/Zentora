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