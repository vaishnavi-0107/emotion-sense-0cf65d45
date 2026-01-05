import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DetectionResult, EMOTION_CONFIG } from '@/types/emotion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DetectionHistoryProps {
  history: DetectionResult[];
  onClear: () => void;
}

export function DetectionHistory({ history, onClear }: DetectionHistoryProps) {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Detection History</h2>
          <span className="text-xs text-muted-foreground font-mono">
            ({history.length})
          </span>
        </div>
        {history.length > 0 && (
          <Button size="sm" variant="ghost" onClick={onClear}>
            <Trash2 className="w-4 h-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      <ScrollArea className="h-[300px]">
        <AnimatePresence mode="popLayout">
          {history.length > 0 ? (
            <div className="space-y-2">
              {history.map((item, index) => {
                const config = EMOTION_CONFIG[item.dominantEmotion];
                const time = new Date(item.timestamp).toLocaleTimeString();
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div>
                        <p className={`font-medium ${config.colorClass}`}>
                          {config.label}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">
                        {Math.round(item.dominantConfidence * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground">confidence</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <History className="w-12 h-12 mb-2 opacity-30" />
              <p className="text-sm">No detections yet</p>
              <p className="text-xs opacity-60">
                Start the webcam or upload an image
              </p>
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
