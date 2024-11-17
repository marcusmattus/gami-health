import { ReactNode } from 'react';

export type FoodAnalysis = {
  description: ReactNode;
  foodItem: string;
  timestamp: string;
  points: number;
  calories: number;
  isHealthy: boolean;
} 

export interface UserProgress {
  totalPoints: number;
  healthyChoices: number;
  unhealthyChoices: number;
  currentStreak: number;
  level: number;
} 