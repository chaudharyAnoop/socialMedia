import React from "react";
import { Check, X } from "lucide-react";
import styles from "./PasswordStrength.module.css";

interface PasswordStrengthProps {
  password: string;
  showStrength: boolean;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  showStrength,
}) => {
  const requirements = [
    { test: (pwd: string) => pwd.length >= 8, text: "At least 8 characters" },
    { test: (pwd: string) => /[A-Z]/.test(pwd), text: "One uppercase letter" },
    { test: (pwd: string) => /[a-z]/.test(pwd), text: "One lowercase letter" },
    { test: (pwd: string) => /[0-9]/.test(pwd), text: "One number" },
    {
      test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd),
      text: "One special character",
    },
  ];

  const getStrengthLevel = () => {
    const passedRequirements = requirements.filter((req) =>
      req.test(password)
    ).length;
    if (passedRequirements <= 2) return { level: "weak", color: "#ed4956" };
    if (passedRequirements <= 3) return { level: "medium", color: "#ffa726" };
    if (passedRequirements <= 4) return { level: "good", color: "#42a5f5" };
    return { level: "strong", color: "#66bb6a" };
  };

  const strength = getStrengthLevel();

  if (!showStrength || !password) return null;

  return (
    <div className={styles.strengthContainer}>
      <div className={styles.strengthHeader}>
        <span className={styles.strengthLabel}>Password strength: </span>
        <span
          className={styles.strengthLevel}
          style={{ color: strength.color }}
        >
          {strength.level}
        </span>
      </div>
      <div className={styles.requirementsList}>
        {requirements.map((req, index) => {
          const isPassed = req.test(password);
          return (
            <div key={index} className={styles.requirement}>
              {isPassed ? (
                <Check size={14} style={{ color: "#66bb6a" }} />
              ) : (
                <X size={14} style={{ color: "#8e8e8e" }} />
              )}
              <span
                className={`${styles.requirementText} ${
                  isPassed ? styles.requirementPassed : styles.requirementFailed
                }`}
              >
                {req.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrength;
