import { motion } from 'framer-motion';
import { BookOpen, Cpu, Eye, Layers } from 'lucide-react';

export function InfoSection() {
  const features = [
    {
      icon: Eye,
      title: 'Face Detection',
      description:
        'TinyFaceDetector neural network for real-time face localization with high accuracy.',
    },
    {
      icon: Layers,
      title: 'Feature Extraction',
      description:
        '68-point facial landmark detection to identify key facial features automatically.',
    },
    {
      icon: Cpu,
      title: 'Emotion Classification',
      description:
        'Deep learning model trained to recognize 7 distinct emotional expressions.',
    },
    {
      icon: BookOpen,
      title: 'Academic Purpose',
      description:
        'Designed for educational demonstrations in computer vision and AI courses.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <h2 className="text-lg font-semibold mb-4 text-gradient">How It Works</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="p-4 bg-secondary/30 rounded-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <feature.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
