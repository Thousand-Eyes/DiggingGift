
export type PhaseType = 'Perception' | 'Computation' | 'Interaction' | 'Expression';

export type StatKey = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

export interface TalentInfo {
  phase: PhaseType;
  id: string;
  name: string;
  desc: string;
  keywords: string[];
}

export interface UserSkill {
  level: number; // 0-10 based on score 0.0-1.0
  score: number; // Raw score 0.0 - 1.0
  phase: PhaseType;
}

export interface AtomResult {
  atomId: string;
  score: number; // 0.0 to 1.0
  reason: string;
}

export interface AnalysisResult {
  atoms: AtomResult[];
  diagnosis: string; // "Neural Performance Diagnosis"
  singularity: string; // "Value Singularity Suggestion"
  missing_info_query?: string; // Stress Interrogation question
}

export interface Story {
  id: number;
  date: string;
  content: string;
  diagnosis: string;
  singularity: string;
  analysisData: AtomResult[];
}

export interface Stats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Resonance {
  phase: PhaseType;
  name: string;
  name_en?: string;
  iconName: string;
  color: string;
  desc: string;
  threshold: number; // Sum of levels in this phase
}
