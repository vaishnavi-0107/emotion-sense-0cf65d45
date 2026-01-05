import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { ModelLoadingOverlay } from '@/components/ModelLoadingOverlay';
import { WebcamDetection } from '@/components/WebcamDetection';
import { ImageUpload } from '@/components/ImageUpload';
import { DetectionHistory } from '@/components/DetectionHistory';
import { StatsPanel } from '@/components/StatsPanel';
import { InfoSection } from '@/components/InfoSection';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { DetectionResult } from '@/types/emotion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Image } from 'lucide-react';

const Index = () => {
  const { isModelLoaded, isLoading, error, detectEmotions } = useFaceDetection();
  const [history, setHistory] = useState<DetectionResult[]>([]);

  const handleDetection = useCallback(
    async (
      input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
    ): Promise<DetectionResult | null> => {
      const result = await detectEmotions(input);
      if (result) {
        setHistory((prev) => [result, ...prev].slice(0, 50));
      }
      return result;
    },
    [detectEmotions]
  );

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <ModelLoadingOverlay isLoading={isLoading} error={error} />

      <Header />

      <main className="max-w-7xl mx-auto px-4 pb-12 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Real-time <span className="text-gradient">Emotion Recognition</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced deep learning model for detecting and classifying human emotions
            from facial expressions. Supports webcam streaming and image uploads.
          </p>
        </motion.div>

        <StatsPanel history={history} isModelLoaded={isModelLoaded} />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="webcam" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="webcam" className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Webcam
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Upload
                </TabsTrigger>
              </TabsList>
              <TabsContent value="webcam">
                <WebcamDetection
                  onDetect={handleDetection}
                  isModelLoaded={isModelLoaded}
                />
              </TabsContent>
              <TabsContent value="upload">
                <ImageUpload
                  onDetect={handleDetection}
                  isModelLoaded={isModelLoaded}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <DetectionHistory history={history} onClear={clearHistory} />
          </div>
        </div>

        <InfoSection />

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-8 text-xs text-muted-foreground"
        >
          <p>
            Built with TensorFlow.js & face-api.js • Academic Project •{' '}
            <span className="font-mono">Face Recognition & Computer Vision</span>
          </p>
        </motion.footer>
      </main>
    </div>
  );
};

export default Index;
