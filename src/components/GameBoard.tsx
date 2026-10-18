import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { TEAM_BORDER_COLORS } from '../data/sampleQuiz';
import QuestionModal from './QuestionModal';
import BonusModal from './BonusModal';
import Scoreboard from './Scoreboard';
import { Question } from '../types';
import { ChevronRight, Star, Zap, Trophy, ArrowRight, ArrowLeft, Home } from 'lucide-react';

interface Props {
  onNextPhase: () => void;
}

export default function GameBoard({ onNextPhase }: Props) {
  const { state, dispatch } = useGame();
  const [selectedQuestion, setSelectedQuestion] = useState<{
    question: Question;
    category: string;
    round: 'round1' | 'round2';
    catIndex: number;
    qIndex: number;
  } | null>(null);

  if (!state.quizData) return null;

  const isRound1 = state.phase === 'round1';
  const isBonus = state.phase === 'bonus1' || state.phase === 'bonus2';
  const roundData = isRound1 ? state.quizData.round1 : state.quizData.round2;
  const bonusData = isBonus ? (state.phase === 'bonus1' ? state.quizData.bonus1 : state.quizData.bonus2) : null;
  const roundTitle = isRound1 ? 'Runda 1' : 'Runda 2 (Puncte Duble)';
  const roundSubtitle = isRound1 ? 'Alege o întrebare' : 'Punctajul este dublu!';

  // Check if all questions in current round are answered
  const allAnswered = roundData.every(cat =>
    cat.questions.every(q => q.answered)
  );

  if (isBonus && bonusData) {
    if (bonusData.answered) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Bonus completat!</h2>
              <button
                onClick={onNextPhase}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-all flex items-center gap-2 mx-auto"
              >
                Continuă <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <Scoreboard />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
        <BonusModal
          question={bonusData}
          bonusKey={state.phase as 'bonus1' | 'bonus2'}
          onClose={onNextPhase}
        />
        <Scoreboard />
      </div>
    );
  }

  const numCols = roundData.length;
  const numRows = roundData[0]?.questions.length || 0;

  // Build grid cells
  const gridCells: Array<{
    q: Question;
    catIndex: number;
    qIndex: number;
    category: string;
  }> = [];

  for (let qIdx = 0; qIdx < numRows; qIdx++) {
    for (let catIdx = 0; catIdx < numCols; catIdx++) {
      const cat = roundData[catIdx];
      if (cat && cat.questions[qIdx]) {
        gridCells.push({
          q: cat.questions[qIdx],
          catIndex: catIdx,
          qIndex: qIdx,
          category: cat.category,
        });
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between max-w-6xl mx-auto gap-2">
          <button
            onClick={() => dispatch({ type: 'GO_BACK' })}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm flex-shrink-0"
            title="Mergi cu un pas înapoi în joc"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi
          </button>
          <div className="text-center flex-1">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              {roundTitle}
            </h2>
            <p className="text-indigo-300 text-sm">{roundSubtitle}</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'RESET_GAME' })}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/40 border border-red-700/50 text-red-300 rounded-lg hover:bg-red-900/60 transition-colors text-sm flex-shrink-0"
            title="Resetează jocul și mergi la ecranul principal"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Ecran Principal</span>
          </button>
        </div>
      </div>

      {/* Game Board Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Category Headers */}
          <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `repeat(${numCols}, 1fr)` }}>
            {roundData.map((cat, i) => (
              <div key={i} className="bg-indigo-900/50 border border-indigo-600/50 rounded-lg p-3 text-center">
                <span className="text-indigo-200 font-semibold text-sm">{cat.category}</span>
              </div>
            ))}
          </div>

          {/* Question Grid */}
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${numCols}, 1fr)` }}>
            {gridCells.map(({ q, catIndex, qIndex, category }) => {
              const teamIndex = q.answered && q.answeredBy
                ? state.teams.findIndex(t => t.name === q.answeredBy)
                : -1;
              const borderColor = teamIndex >= 0 ? TEAM_BORDER_COLORS[teamIndex] : '';

              return (
                <button
                  key={`${catIndex}-${qIndex}`}
                  onClick={() => !q.answered && setSelectedQuestion({ question: q, category, round: isRound1 ? 'round1' : 'round2', catIndex, qIndex })}
                  disabled={q.answered}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 min-h-[70px] ${
                    q.answered
                      ? `bg-slate-800/40 border-slate-700 ${borderColor} opacity-60`
                      : 'bg-gradient-to-br from-indigo-800/60 to-purple-800/60 border-indigo-500/50 hover:border-indigo-400 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer'
                  }`}
                >
                  {q.answered ? (
                    <div className="text-center">
                      <span className="text-slate-400 text-xs break-words">
                        {q.answeredBy === 'Nimeni' ? '✗' : `✓ ${q.answeredBy}`}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-2xl font-bold text-yellow-400">{q.points}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Phase Button */}
          {allAnswered && (
            <div className="mt-6 text-center">
              <button
                onClick={onNextPhase}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center gap-2 mx-auto shadow-lg"
              >
                <Trophy className="w-5 h-5" />
                Continuă la faza următoare
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Question Modal */}
      {selectedQuestion && (
        <QuestionModal
          question={selectedQuestion.question}
          category={selectedQuestion.category}
          round={selectedQuestion.round}
          catIndex={selectedQuestion.catIndex}
          qIndex={selectedQuestion.qIndex}
          onClose={() => setSelectedQuestion(null)}
        />
      )}

      {/* Scoreboard */}
      <Scoreboard />
    </div>
  );
}
