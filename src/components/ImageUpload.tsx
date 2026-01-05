import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DetectionResult } from '@/types/emotion';
import { EmotionBadge } from './EmotionBadge';
import { EmotionChart } from './EmotionChart';

interface ImageUploadProps {
  onDetect: (
    input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
  ) => Promise<DetectionResult | null>;
  isModelLoaded: boolean;
}

export function ImageUpload({ onDetect, isModelLoaded }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [noFaceDetected, setNoFaceDetected] = useState(false);

  const handleFileChange = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setResult(null);
    setNoFaceDetected(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const analyzeImage = async () => {
    if (!imageRef.current || !isModelLoaded) return;

    setIsAnalyzing(true);
    setNoFaceDetected(false);
    
    const detection = await onDetect(imageRef.current);
    
    if (detection) {
      setResult(detection);
    } else {
      setNoFaceDetected(true);
    }
    
    setIsAnalyzing(false);
  };

  const clearImage = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
    setResult(null);
    setNoFaceDetected(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Image Analysis</h2>
        </div>
        {imageUrl && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={analyzeImage}
              disabled={isAnalyzing || !isModelLoaded}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> Analyzing
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" /> Analyze
                </>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={clearImage}>
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div
          className={`relative aspect-video bg-secondary rounded-lg overflow-hidden transition-all ${
            isDragging ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          
          <AnimatePresence mode="wait">
            {imageUrl ? (
              <motion.div
                key="image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Uploaded face"
                  className="w-full h-full object-contain"
                  crossOrigin="anonymous"
                />
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-3 left-3"
                  >
                    <EmotionBadge
                      emotion={result.dominantEmotion}
                      confidence={result.dominantConfidence}
                      size="lg"
                    />
                  </motion.div>
                )}
                {noFaceDetected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-background/80 flex items-center justify-center"
                  >
                    <div className="text-center p-4">
                      <span className="text-3xl mb-2 block">🔍</span>
                      <p className="text-sm text-muted-foreground">
                        No face detected in this image
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Try uploading a clearer image with a visible face
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.button
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <Upload className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">Drop an image here</p>
                <p className="text-xs opacity-60">or click to browse</p>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Emotion Distribution
          </div>
          {result ? (
            <EmotionChart emotions={result.emotions} />
          ) : (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              {imageUrl
                ? isAnalyzing
                  ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </div>
                  )
                  : 'Click "Analyze" to detect emotions'
                : 'Upload an image to analyze'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
