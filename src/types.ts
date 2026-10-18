export interface Question {
  points: number;
  type: 'standard';
  question: string;
  answer: string;
  rationale: string;
  answered?: boolean;
  answeredBy?: string;
}

export interface Category {
  category: string;
  questions: Question[];
}

export interface BonusQuestion {
  category: string;
  points: number;
  question: string;
  answer: string;
  rationale: string;
  answered?: boolean;
  answeredBy?: string;
}

export interface FinalJeopardy {
  category: string;
  question: string;
  answer: string;
  rationale: string;
}

export interface QuizData {
  title: string;
  topic: string;
  round1: Category[];
  bonus1: BonusQuestion;
  round2: Category[];
  bonus2: BonusQuestion;
  finalJeopardy: FinalJeopardy;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  score: number;
}

export type GamePhase =
  | 'dashboard'
  | 'setup'
  | 'round1'
  | 'bonus1'
  | 'round2'
  | 'bonus2'
  | 'finalJeopardy'
  | 'finalBets'
  | 'finalQuestion'
  | 'finalResults'
  | 'winner';

export interface GameState {
  phase: GamePhase;
  quizData: QuizData | null;
  teams: Team[];
  currentRound: number;
  timerDuration: number;
  finalBets: Record<string, number>;
  finalAnswers: Record<string, string>;
  finalResults: Record<string, 'correct' | 'incorrect'>;
}
