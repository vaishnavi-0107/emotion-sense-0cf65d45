import { motion } from 'framer-motion';
import { Brain, Loader2 } from 'lucide-react';

interface ModelLoadingOverlayProps {
  isLoading: boolean;
  error: string | null;
}

export function ModelLoadingOverlay({ isLoading, error }: ModelLoadingOverlayProps) {
  if (!isLoading && !error) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      <div className="text-center">
        {isLoading ? (
          <>
            <motion.div
              className="relative w-24 h-24 mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-2 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary" />
              </div>
            </motion.div>
            <h2 className="text-xl font-semibold mb-2">Loading AI Models</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Initializing face detection and emotion recognition neural networks...
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="font-mono">Downloading model weights</span>
            </div>
          </>
        ) : (
          <div className="glass-card p-8">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-destructive">Error</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">{error}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
