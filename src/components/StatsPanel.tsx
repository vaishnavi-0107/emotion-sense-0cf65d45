import { motion } from 'framer-motion';
import { BarChart3, Target, Clock, Zap } from 'lucide-react';
import { DetectionResult, EmotionType, EMOTION_CONFIG } from '@/types/emotion';

interface StatsPanelProps {
  history: DetectionResult[];
  isModelLoaded: boolean;
}

export function StatsPanel({ history, isModelLoaded }: StatsPanelProps) {
  const totalDetections = history.length;
  
  const emotionCounts = history.reduce((acc, item) => {
    acc[item.dominantEmotion] = (acc[item.dominantEmotion] || 0) + 1;
    return acc;
  }, {} as Record<EmotionType, number>);

  const mostCommon = Object.entries(emotionCounts).sort(
    ([, a], [, b]) => b - a
  )[0];

  const avgConfidence =
    history.length > 0
      ? history.reduce((sum, item) => sum + item.dominantConfidence, 0) /
        history.length
      : 0;

  const stats = [
    {
      icon: BarChart3,
      label: 'Total Detections',
      value: totalDetections,
      color: 'text-primary',
    },
    {
      icon: Target,
      label: 'Most Common',
      value: mostCommon
        ? `${EMOTION_CONFIG[mostCommon[0] as EmotionType].icon} ${EMOTION_CONFIG[mostCommon[0] as EmotionType].label}`
        : '—',
      color: mostCommon
        ? EMOTION_CONFIG[mostCommon[0] as EmotionType].colorClass
        : 'text-muted-foreground',
    },
    {
      icon: Clock,
      label: 'Avg Confidence',
      value: avgConfidence > 0 ? `${Math.round(avgConfidence * 100)}%` : '—',
      color: 'text-accent',
    },
    {
      icon: Zap,
      label: 'Model Status',
      value: isModelLoaded ? 'Ready' : 'Loading',
      color: isModelLoaded ? 'text-accent' : 'text-muted-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
          <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
