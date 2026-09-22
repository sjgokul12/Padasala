import { type ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  center?: boolean;
}

export function SectionHeading({ eyebrow, title, subtitle, center }: SectionHeadingProps) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
      <h2 className="heading text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.1] text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-ink-500 leading-relaxed text-balance">
          {subtitle}
        </p>
      )}
    </div>
  );
}
