import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GamePhase, QuizData, Team } from '../types';

type Action =
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'SET_QUIZ_DATA'; payload: QuizData }
  | { type: 'SET_TEAMS'; payload: Team[] }
  | { type: 'ADD_SCORE'; payload: { teamId: string; points: number } }
  | { type: 'MARK_ANSWERED'; payload: { round: 'round1' | 'round2'; catIndex: number; qIndex: number; teamName: string } }
  | { type: 'MARK_BONUS_ANSWERED'; payload: { bonus: 'bonus1' | 'bonus2'; teamName: string } }
  | { type: 'SET_FINAL_BET'; payload: { teamId: string; bet: number } }
  | { type: 'SET_FINAL_ANSWER'; payload: { teamId: string; answer: string } }
  | { type: 'SET_FINAL_RESULT'; payload: { teamId: string; result: 'correct' | 'incorrect' } }
  | { type: 'GO_BACK' }
  | { type: 'RESET_GAME' };

// Ordinea fazelor pentru navigarea "Înapoi"
const PHASE_ORDER: GamePhase[] = [
  'dashboard',
  'setup',
  'round1',
  'bonus1',
  'round2',
  'bonus2',
  'finalJeopardy',
  'winner',
];

function getPreviousPhase(current: GamePhase): GamePhase {
  const idx = PHASE_ORDER.indexOf(current);
  if (idx <= 0) return 'dashboard';
  return PHASE_ORDER[idx - 1];
}

const initialState: GameState = {
  phase: 'dashboard',
  quizData: null,
  teams: [],
  currentRound: 1,
  timerDuration: 30,
  finalBets: {},
  finalAnswers: {},
  finalResults: {},
};

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.payload };
    case 'SET_QUIZ_DATA':
      return { ...state, quizData: action.payload };
    case 'SET_TEAMS':
      return { ...state, teams: action.payload };
    case 'ADD_SCORE':
      return {
        ...state,
        teams: state.teams.map(t =>
          t.id === action.payload.teamId
            ? { ...t, score: t.score + action.payload.points }
            : t
        ),
      };
    case 'MARK_ANSWERED':
      if (!state.quizData) return state;
      const roundKey = action.payload.round;
      const updatedRound = [...state.quizData[roundKey]];
      updatedRound[action.payload.catIndex] = {
        ...updatedRound[action.payload.catIndex],
        questions: updatedRound[action.payload.catIndex].questions.map((q, i) =>
          i === action.payload.qIndex ? { ...q, answered: true, answeredBy: action.payload.teamName } : q
        ),
      };
      return { ...state, quizData: { ...state.quizData, [roundKey]: updatedRound } };
    case 'MARK_BONUS_ANSWERED':
      if (!state.quizData) return state;
      return {
        ...state,
        quizData: {
          ...state.quizData,
          [action.payload.bonus]: { ...state.quizData[action.payload.bonus], answered: true, answeredBy: action.payload.teamName },
        },
      };
    case 'SET_FINAL_BET':
      return { ...state, finalBets: { ...state.finalBets, [action.payload.teamId]: action.payload.bet } };
    case 'SET_FINAL_ANSWER':
      return { ...state, finalAnswers: { ...state.finalAnswers, [action.payload.teamId]: action.payload.answer } };
    case 'SET_FINAL_RESULT': {
      const newResults = { ...state.finalResults, [action.payload.teamId]: action.payload.result };
      let newTeams = [...state.teams];
      const team = newTeams.find(t => t.id === action.payload.teamId);
      if (team) {
        const bet = state.finalBets[action.payload.teamId] || 0;
        const points = action.payload.result === 'correct' ? bet : -bet;
        newTeams = newTeams.map(t =>
          t.id === action.payload.teamId ? { ...t, score: t.score + points } : t
        );
      }
      return { ...state, finalResults: newResults, teams: newTeams };
    }
    case 'GO_BACK':
      return { ...state, phase: getPreviousPhase(state.phase) };
    case 'RESET_GAME':
      return { ...initialState };
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
