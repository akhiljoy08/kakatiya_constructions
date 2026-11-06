import React from 'react';
import markImage from '../assets/kakatiya-mark.png';

export const LogoMark = ({ className = "w-11 h-11" }: { className?: string }) => (
  // KC towers with the Kakatiya gateway — white tile keeps the dark bars visible on navy
  <span className={`${className} flex shrink-0 items-center justify-center rounded-sm bg-white p-1`}>
    <img src={markImage} alt="" aria-hidden="true" width={460} height={615} className="h-full w-full object-contain" />
  </span>
);

// "lg" grows with the screen — used in the centred header
const sizes = {
  default: { mark: 'w-11 h-11', name: 'text-[17px]', tag: 'text-[9px]' },
  lg: {
    mark: 'w-11 h-11 md:w-14 md:h-14 xl:w-16 xl:h-16',
    name: 'text-[17px] md:text-xl xl:text-2xl',
    tag: 'text-[9px] md:text-[10px] xl:text-[11px]',
  },
};

type LogoProps = {
  className?: string;
  iconOnly?: boolean;
  size?: keyof typeof sizes;
  /** Wordmark colours — defaults suit dark backgrounds */
  nameClass?: string;
  tagClass?: string;
};

export const Logo = ({ className = "", iconOnly = false, size = "default", nameClass = "text-white", tagClass = "text-gold" }: LogoProps) => {
  const s = sizes[size];
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className={s.mark} />
      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <span className={`${s.name} font-extrabold tracking-[0.22em] transition-colors duration-500 ${nameClass}`}>
            KAKATIYA
          </span>
          <span className={`${s.tag} mt-1.5 font-semibold uppercase tracking-[0.42em] transition-colors duration-500 ${tagClass}`}>
            Constructions
          </span>
        </div>
      )}
    </div>
  );
};

export const Favicon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#101B2D" />
    <path d="M28 78V42l22-16 22 16v36" fill="none" stroke="#C6A56B" strokeWidth="6" />
    <path d="M44 78V56h12v22" fill="none" stroke="#C6A56B" strokeWidth="6" />
  </svg>
);
