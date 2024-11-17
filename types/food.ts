import { ReactNode } from 'react';

export interface FoodAnalysis {
  foodItem: string;
  calories: number;
  isHealthy: boolean;
  description: string;
  points: number;
  timestamp: string;
  imageUrl?: string;
} 

export interface UserProgress {
  totalPoints: number;
  healthyChoices: number;
  unhealthyChoices: number;
  currentStreak: number;
  level: number;
} 