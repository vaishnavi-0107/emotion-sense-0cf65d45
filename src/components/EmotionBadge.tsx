import { motion } from 'framer-motion';
import { EmotionType, EMOTION_CONFIG } from '@/types/emotion';
import { cn } from '@/lib/utils';

interface EmotionBadgeProps {
  emotion: EmotionType;
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
  showConfidence?: boolean;
  animate?: boolean;
}

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

const iconSizes = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
};

export function EmotionBadge({
  emotion,
  confidence,
  size = 'md',
  showConfidence = true,
  animate = true,
}: EmotionBadgeProps) {
  const config = EMOTION_CONFIG[emotion];
  const confidencePercent = Math.round(confidence * 100);

  const Component = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }
    : {};

  return (
    <Component
      {...animationProps}
      className={cn(
        'inline-flex items-center gap-2 rounded-full font-medium',
        'bg-gradient-to-r from-secondary to-muted border border-border/50',
        sizeClasses[size]
      )}
    >
      <span className={iconSizes[size]}>{config.icon}</span>
      <span className={config.colorClass}>{config.label}</span>
      {showConfidence && (
        <span className="text-muted-foreground font-mono">
          {confidencePercent}%
        </span>
      )}
    </Component>
  );
}
