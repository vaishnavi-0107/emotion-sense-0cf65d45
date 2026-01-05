export type EmotionType = 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'neutral' 
  | 'surprised' 
  | 'fearful' 
  | 'disgusted';

export interface EmotionResult {
  emotion: EmotionType;
  confidence: number;
}

export interface DetectionResult {
  id: string;
  timestamp: Date;
  emotions: EmotionResult[];
  dominantEmotion: EmotionType;
  dominantConfidence: number;
  imageUrl?: string;
}

export interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const EMOTION_CONFIG: Record<EmotionType, { label: string; icon: string; colorClass: string }> = {
  happy: { label: 'Happy', icon: '😊', colorClass: 'text-emotion-happy' },
  sad: { label: 'Sad', icon: '😢', colorClass: 'text-emotion-sad' },
  angry: { label: 'Angry', icon: '😠', colorClass: 'text-emotion-angry' },
  neutral: { label: 'Neutral', icon: '😐', colorClass: 'text-emotion-neutral' },
  surprised: { label: 'Surprised', icon: '😲', colorClass: 'text-emotion-surprised' },
  fearful: { label: 'Fearful', icon: '😨', colorClass: 'text-emotion-fearful' },
  disgusted: { label: 'Disgusted', icon: '🤢', colorClass: 'text-emotion-disgusted' },
};
