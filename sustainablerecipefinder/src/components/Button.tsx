import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "danger";
  color?: string;
  textColor?: string;
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  color,
  textColor,
}: ButtonProps) {
  const isDanger = variant === "danger";

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: color ?? (isDanger ? "#ef4444" : "#bbbb9a"),
        color: textColor ?? (isDanger ? "white" : "#14532d"),
        border: "none",
        padding: "8px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: 600,
        marginRight: 10,
      }}
    >
      {children}
    </button>
  );
}