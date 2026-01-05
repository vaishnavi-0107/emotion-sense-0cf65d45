import { useState, useEffect, useCallback, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { DetectionResult, EmotionType } from '@/types/emotion';

const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

export function useFaceDetection() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    const loadModels = async () => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      try {
        setIsLoading(true);
        setError(null);

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);

        setIsModelLoaded(true);
      } catch (err) {
        console.error('Failed to load face detection models:', err);
        setError('Failed to load AI models. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const detectEmotions = useCallback(
    async (
      input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
    ): Promise<DetectionResult | null> => {
      if (!isModelLoaded) {
        console.warn('Models not loaded yet');
        return null;
      }

      try {
        const detections = await faceapi
          .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        if (!detections) {
          return null;
        }

        const expressions = detections.expressions;
        const emotionData: Array<{ emotion: EmotionType; confidence: number }> = [
          { emotion: 'happy' as EmotionType, confidence: expressions.happy },
          { emotion: 'sad' as EmotionType, confidence: expressions.sad },
          { emotion: 'angry' as EmotionType, confidence: expressions.angry },
          { emotion: 'neutral' as EmotionType, confidence: expressions.neutral },
          { emotion: 'surprised' as EmotionType, confidence: expressions.surprised },
          { emotion: 'fearful' as EmotionType, confidence: expressions.fearful },
          { emotion: 'disgusted' as EmotionType, confidence: expressions.disgusted },
        ];
        
        const sortedEmotions = emotionData.sort((a, b) => b.confidence - a.confidence);
        const dominant = sortedEmotions[0];

        return {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          emotions: sortedEmotions,
          dominantEmotion: dominant.emotion,
          dominantConfidence: dominant.confidence,
        };
      } catch (err) {
        console.error('Detection error:', err);
        return null;
      }
    },
    [isModelLoaded]
  );

  return {
    isModelLoaded,
    isLoading,
    error,
    detectEmotions,
  };
}
