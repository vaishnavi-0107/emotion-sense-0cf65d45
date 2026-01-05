import { motion } from 'framer-motion';
import { EmotionResult, EMOTION_CONFIG } from '@/types/emotion';

interface EmotionChartProps {
  emotions: EmotionResult[];
}

export function EmotionChart({ emotions }: EmotionChartProps) {
  const sortedEmotions = [...emotions].sort((a, b) => b.confidence - a.confidence);

  return (
    <div className="space-y-3">
      {sortedEmotions.map((item, index) => {
        const config = EMOTION_CONFIG[item.emotion];
        const percentage = Math.round(item.confidence * 100);

        return (
          <motion.div
            key={item.emotion}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>{config.icon}</span>
                <span className={config.colorClass}>{config.label}</span>
              </div>
              <span className="font-mono text-muted-foreground">{percentage}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                style={{
                  opacity: 0.3 + item.confidence * 0.7,
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
