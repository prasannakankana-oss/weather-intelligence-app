import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  Snowflake,
  CloudLightning,
  LucideProps
} from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  name: string;
  className?: string;
  animated?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6', animated = false, ...props }) => {
  const animClass = animated ? 'transition-transform duration-500 hover:scale-110' : '';
  const combinedClass = `${className} ${animClass}`.trim();

  switch (name) {
    case 'Sun':
      return <Sun className={`${combinedClass} text-amber-500 animate-spin-slow`} {...props} />;
    case 'SunMedium':
      return <SunMedium className={`${combinedClass} text-amber-400`} {...props} />;
    case 'CloudSun':
      return <CloudSun className={`${combinedClass} text-sky-400`} {...props} />;
    case 'Cloud':
      return <Cloud className={`${combinedClass} text-slate-400`} {...props} />;
    case 'CloudFog':
      return <CloudFog className={`${combinedClass} text-slate-300`} {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`${combinedClass} text-blue-400`} {...props} />;
    case 'CloudRain':
      return <CloudRain className={`${combinedClass} text-blue-500`} {...props} />;
    case 'CloudRainWind':
      return <CloudRainWind className={`${combinedClass} text-indigo-500`} {...props} />;
    case 'Snowflake':
      return <Snowflake className={`${combinedClass} text-cyan-300 animate-pulse`} {...props} />;
    case 'CloudLightning':
      return <CloudLightning className={`${combinedClass} text-amber-400 animate-bounce-short`} {...props} />;
    default:
      return <Cloud className={`${combinedClass} text-slate-400`} {...props} />;
  }
};
