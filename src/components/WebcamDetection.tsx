import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, VideoOff, Play, Square, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DetectionResult } from '@/types/emotion';
import { EmotionBadge } from './EmotionBadge';
import { EmotionChart } from './EmotionChart';

interface WebcamDetectionProps {
  onDetect: (
    input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
  ) => Promise<DetectionResult | null>;
  isModelLoaded: boolean;
}

export function WebcamDetection({ onDetect, isModelLoaded }: WebcamDetectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      console.error('Camera error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setIsDetecting(false);
    setResult(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const toggleDetection = useCallback(() => {
    if (isDetecting) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsDetecting(false);
    } else {
      setIsDetecting(true);
      const detect = async () => {
        if (videoRef.current && isModelLoaded) {
          const detection = await onDetect(videoRef.current);
          if (detection) {
            setResult(detection);
          }
        }
      };
      detect();
      intervalRef.current = setInterval(detect, 500);
    }
  }, [isDetecting, isModelLoaded, onDetect]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Real-time Detection</h2>
        </div>
        <div className="flex items-center gap-2">
          {isStreaming && (
            <Button
              size="sm"
              variant={isDetecting ? 'destructive' : 'default'}
              onClick={toggleDetection}
              disabled={!isModelLoaded}
            >
              {isDetecting ? (
                <>
                  <Square className="w-4 h-4 mr-1" /> Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" /> Start
                </>
              )}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={isStreaming ? stopCamera : startCamera}
          >
            {isStreaming ? (
              <>
                <VideoOff className="w-4 h-4 mr-1" /> Turn Off
              </>
            ) : (
              <>
                <Video className="w-4 h-4 mr-1" /> Turn On
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden">
          {isStreaming ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isDetecting && (
                <div className="scan-line" />
              )}
              <AnimatePresence>
                {result && isDetecting && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-3 left-3"
                  >
                    <EmotionBadge
                      emotion={result.dominantEmotion}
                      confidence={result.dominantConfidence}
                      size="lg"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              {isDetecting && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-destructive"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-xs font-mono text-foreground/80 bg-background/50 px-2 py-0.5 rounded">
                    LIVE
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <VideoOff className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm">Camera is off</p>
              <p className="text-xs opacity-60">Click "Turn On" to start</p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 p-4">
              <p className="text-sm text-destructive text-center">{error}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Emotion Distribution
          </div>
          {result ? (
            <EmotionChart emotions={result.emotions} />
          ) : (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              {isStreaming ? (
                isDetecting ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  'Click "Start" to begin detection'
                )
              ) : (
                'Turn on camera to detect emotions'
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
