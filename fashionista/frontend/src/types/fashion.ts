export interface Outfit {
  id: string;
  name: string;
  category: 'Formal' | 'Evening' | 'Casual' | 'Active' | 'Streetwear' | string;
  gender?: string;
  price: number;
  image: string;
  style_tags: string[];
  color_palette: string[];
  compatibility_score: number;
  description: string;
}

export interface FitAnalytics {
  overall_match_score: number;
  shoulder_alignment: string;
  waist_contour_fit: string;
  color_compatibility: string;
  fabric_drape_rating: string;
  recommended_size: string;
  style_notes: string;
}

export interface TryOnResult {
  status: 'success' | 'error';
  try_on_image: string;
  fit_analytics: FitAnalytics;
  outfit?: Outfit;
  timestamp?: string;
}

export interface MatchingAnalysis {
  compatibility_score: number;
  harmony_level: string;
  color_synergy: string;
  style_cohesion: string;
  pairing_recommendation: string;
}

export interface Trend {
  id: string;
  name: string;
  growth: string;
  sentiment: string;
  description: string;
  colors: string[];
  featured_outfit_id: string;
}

export interface SavedLook {
  id: string;
  date: string;
  outfitName: string;
  category: string;
  image: string;
  matchScore: number;
  size: string;
}

export interface CameraAnalysis {
  resolution: string;
  opencv_laplacian_sharpness: number;
  sharpness_rating: string;
  opencv_lab_luminance: number;
  luminance_stddev: number;
  opencv_body_bbox: { x: number; y: number; w: number; h: number };
  opencv_detected_contours: number;
  body_contour_detected: boolean;
  posture_alignment?: string;
  annotated_photo?: string;
}

export type ActiveTab = 'home' | 'try-on' | 'recommendations' | 'matching' | 'trends' | 'closet';
