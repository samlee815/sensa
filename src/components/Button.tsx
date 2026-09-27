"use client";
import Magnetic from "./Magnetic";
import { TLink } from "./Transition";
import { Arrow } from "./Icons";

type Props = {
  children: string;
  href?: string;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  type?: "button" | "submit";
  magnetic?: boolean;
  className?: string;
};

export default function Button({ children, href, variant = "primary", onClick, type = "button", magnetic = true, className = "" }: Props) {
  const inner = (
    <>
      <span className="btn-label">
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
      <span className="btn-icon">
        <Arrow />
      </span>
    </>
  );
  const cls = `btn btn-${variant} ${className}`;
  const el = href ? (
    <TLink href={href} className={cls}>
      {inner}
    </TLink>
  ) : (
    <button type={type} className={cls} onClick={onClick}>
      {inner}
    </button>
  );
  return magnetic ? <Magnetic strength={0.25}>{el}</Magnetic> : el;
}
