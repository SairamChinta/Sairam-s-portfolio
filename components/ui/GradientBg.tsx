"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);

  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);
  const [isSafari, setIsSafari] = useState(false);

  // ✅ Apply CSS variables on client only
  useEffect(() => {
    if (typeof document === "undefined") return;

    const bodyStyle = document.body.style;
    bodyStyle.setProperty("--gradient-background-start", gradientBackgroundStart);
    bodyStyle.setProperty("--gradient-background-end", gradientBackgroundEnd);
    bodyStyle.setProperty("--first-color", firstColor);
    bodyStyle.setProperty("--second-color", secondColor);
    bodyStyle.setProperty("--third-color", thirdColor);
    bodyStyle.setProperty("--fourth-color", fourthColor);
    bodyStyle.setProperty("--fifth-color", fifthColor);
    bodyStyle.setProperty("--pointer-color", pointerColor);
    bodyStyle.setProperty("--size", size);
    bodyStyle.setProperty("--blending-value", blendingValue);
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue,
  ]);

  // ✅ Smooth pointer animation
  useEffect(() => {
    const animate = () => {
      if (!interactiveRef.current) return;
      setCurX((prevX) => prevX + (tgX - prevX) / 20);
      setCurY((prevY) => prevY + (tgY - prevY) / 20);
      interactiveRef.current.style.transform = `translate(${Math.round(
        curX
      )}px, ${Math.round(curY)}px)`;
      requestAnimationFrame(animate);
    };
    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [tgX, tgY, curX, curY]);

  // ✅ Safari detection
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
    }
  }, []);

  // ✅ Mouse move handler
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveRef.current) return;
    const rect = interactiveRef.current.getBoundingClientRect();
    setTgX(event.clientX - rect.left);
    setTgY(event.clientY - rect.top);
  };

  return (
    <div
      className={cn(
        "w-full h-full absolute overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
    >
      {/* Blur filter */}
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className={cn("", className)}>{children}</div>

      <div
        className={cn(
          "gradients-container h-full w-full blur-lg",
          isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(40px)]"
        )}
        onMouseMove={handleMouseMove}
        ref={interactive ? interactiveRef : null}
      >
        {/* 5 gradient circles */}
        {[
          "--first-color",
          "--second-color",
          "--third-color",
          "--fourth-color",
          "--fifth-color",
        ].map((color, i) => (
          <div
            key={i}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_var(${color})_0,_var(${color})_50%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)]`,
              `top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
              `animate-${["first","second","third","fourth","fifth"][i]} opacity-${i===3?"70":"100"}`
            )}
          />
        ))}

        {interactive && (
          <div
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2 opacity-70`
            )}
          />
        )}
      </div>
    </div>
  );
};
