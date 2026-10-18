import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { TEAM_TEXT_COLORS } from '../data/sampleQuiz';
import { BonusQuestion } from '../types';
import { X, Clock, Eye, Check, XCircle, Star, ArrowLeft } from 'lucide-react';

interface Props {
  question: BonusQuestion;
  bonusKey: 'bonus1' | 'bonus2';
  onClose: () => void;
}

export default function BonusModal({ question, bonusKey, onClose }: Props) {
  const { state, dispatch } = useGame();
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [timerRunning, setTimerRunning] = useState(false);
  const [scored, setScored] = useState(false);

  const startTimer = () => {
    setTimerRunning(true);
  };

  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) {
      if (timeLeft <= 0) setTimerRunning(false);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const handleScore = (teamId: string, teamName: string, positive: boolean) => {
    const points = positive ? question.points : -question.points;
    dispatch({ type: 'ADD_SCORE', payload: { teamId, points } });
    dispatch({ type: 'MARK_BONUS_ANSWERED', payload: { bonus: bonusKey, teamName: positive ? teamName : 'Nimeni' } });
    setScored(true);
  };

  const handleNoAnswer = () => {
    dispatch({ type: 'MARK_BONUS_ANSWERED', payload: { bonus: bonusKey, teamName: 'Nimeni' } });
    setScored(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-slate-900 border border-purple-500/50 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-900/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-700/50">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-400" />
            <div>
              <span className="text-purple-300 text-sm font-medium">Întrebare Bonus</span>
              <h3 className="text-xl font-bold text-white">{question.category}</h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-yellow-400">{question.points} pct</span>
            <button
              onClick={() => dispatch({ type: 'RESET_GAME' })}
              className="flex items-center gap-1 px-3 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
              title="Înapoi la Ecranul Principal"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Înapoi</span>
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <div className="bg-purple-900/30 border border-purple-600/50 rounded-xl p-6 mb-6">
            <p className="text-xl text-white text-center leading-relaxed">{question.question}</p>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              timeLeft <= 5 ? 'bg-red-900/50 border border-red-500' :
              timeLeft <= 10 ? 'bg-yellow-900/50 border border-yellow-500' :
              'bg-slate-700 border border-slate-600'
            }`}>
              <Clock className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-400' : timeLeft <= 10 ? 'text-yellow-400' : 'text-slate-300'}`} />
              <span className={`text-2xl font-bold font-mono ${
                timeLeft <= 5 ? 'text-red-400' : timeLeft <= 10 ? 'text-yellow-400' : 'text-white'
              }`}>
                {timeLeft}s
              </span>
            </div>
            {!timerRunning && timeLeft > 0 && (
              <button
                onClick={startTimer}
                className="px-4 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-500 transition-colors"
              >
                Start Timer
              </button>
            )}
          </div>

          {/* Show Answer */}
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2 mb-6"
            >
              <Eye className="w-5 h-5" />
              Afișează Răspunsul
            </button>
          ) : (
            <div className="bg-green-900/30 border border-green-600/50 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-green-300 mb-2">{question.answer}</p>
                  <p className="text-sm text-slate-400">{question.rationale}</p>
                </div>
              </div>
            </div>
          )}

          {/* Scoring */}
          {showAnswer && !scored && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {state.teams.map((team) => {
                  const originalIndex = state.teams.findIndex(t => t.id === team.id);
                  const textColor = TEAM_TEXT_COLORS[originalIndex] || 'text-white';
                  return (
                    <div key={team.id} className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${textColor} flex-1`}>{team.name}</span>
                      <button
                        onClick={() => handleScore(team.id, team.name, true)}
                        className="px-3 py-1.5 bg-green-600/80 text-white text-sm rounded-lg hover:bg-green-500 transition-colors"
                      >
                        +{question.points}
                      </button>
                      <button
                        onClick={() => handleScore(team.id, team.name, false)}
                        className="px-3 py-1.5 bg-red-600/80 text-white text-sm rounded-lg hover:bg-red-500 transition-colors"
                      >
                        -{question.points}
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleNoAnswer}
                className="w-full py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Nimeni nu a răspuns
              </button>
            </div>
          )}

          {scored && (
            <button
              onClick={onClose}
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-500 transition-all"
            >
              Continuă →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
