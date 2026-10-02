
import { useState } from "react";
import "./CareerGuide.css";

const guideSteps = [
  {
    title: "Hey there! 👋",
    message:
      "I'm Caro, your CareerHub guide! I'll help you explore learning resources and discover internship opportunities. Let's get started!",
  },
  {
    title: "Explore Learning 📚",
    message:
      "Here you can search for learning resources by technology or domain, like Python, AI, or Cybersecurity.",
  },
  {
    title: "Find Internships 💼",
    message:
      "Looking for internships? Choose your preferred locations and work modes to explore relevant opportunities.",
  },
  {
    title: "Ready to explore? 🚀",
    message:
      "Enter your domain, select your preferences, and start exploring. I'm right here if you need help!",
  },
];

export default function CareerGuide() {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(0);

  const nextStep = () => {
    setStep((current) =>
      current < guideSteps.length - 1 ? current + 1 : 0
    );
  };

  const previousStep = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  return (
    <div className="caro-guide">
      {isOpen && (
        <div className="caro-bubble">
          <div className="caro-bubble-header">
            <div>
              <strong>{guideSteps[step].title}</strong>
              <span>CareerHub Guide</span>
            </div>
            <button
              className="caro-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close guide"
            >
              ×
            </button>
          </div>

          <p>{guideSteps[step].message}</p>

          <div className="caro-bubble-footer">
            <span>
              {step + 1} / {guideSteps.length}
            </span>
            <div className="caro-controls">
              <button
                onClick={previousStep}
                disabled={step === 0}
              >
                Back
              </button>
              <button className="caro-next" onClick={nextStep}>
                {step === guideSteps.length - 1 ? "Start again" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        className="caro-avatar-button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Hide Caro guide" : "Open Caro guide"}
      >
        <img src="/caro.png" alt="Caro, CareerHub's AI guide" />
        {!isOpen && <span className="caro-notification">1</span>}
      </button>
    </div>
  );
}