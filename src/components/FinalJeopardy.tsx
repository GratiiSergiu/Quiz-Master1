import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { TEAM_COLORS, TEAM_TEXT_COLORS } from '../data/sampleQuiz';
import Scoreboard from './Scoreboard';
import { Crown, Clock, Check, X, Lock, Unlock } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export default function FinalJeopardy({ onComplete }: Props) {
  const { state, dispatch } = useGame();
  const [step, setStep] = useState<'bets' | 'question' | 'results'>('bets');
  const [bets, setBets] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState<Record<string, 'correct' | 'incorrect'>>({});

  const startTimer = useCallback(() => {
    setTimerRunning(true);
  }, []);

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

  const handleBetChange = (teamId: string, value: number) => {
    const team = state.teams.find(t => t.id === teamId);
    const maxBet = team?.score || 0;
    const clampedBet = Math.max(0, Math.min(maxBet, value));
    setBets(prev => ({ ...prev, [teamId]: clampedBet }));
  };

  const handleConfirmBets = () => {
    Object.entries(bets).forEach(([teamId, bet]) => {
      dispatch({ type: 'SET_FINAL_BET', payload: { teamId, bet } });
    });
    setStep('question');
  };

  const handleResult = (teamId: string, result: 'correct' | 'incorrect') => {
    const newResults = { ...results, [teamId]: result };
    setResults(newResults);
    dispatch({ type: 'SET_FINAL_RESULT', payload: { teamId, result } });
    
    // Check if all teams have been evaluated
    if (Object.keys(newResults).length === state.teams.length) {
      setTimeout(() => setStep('results'), 500);
    }
  };

  if (!state.quizData) return null;
  const finalQ = state.quizData.finalJeopardy;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-4 text-center border-b border-purple-700/50">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Crown className="w-6 h-6 text-yellow-400" />
          Final Jeopardy
        </h2>
        <p className="text-purple-300 text-sm">{finalQ.category}</p>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Bets */}
          {step === 'bets' && (
            <div className="space-y-6">
              <div className="bg-purple-900/30 border border-purple-600/50 rounded-xl p-6 text-center">
                <Lock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Introduceți Miza Secretă</h3>
                <p className="text-slate-400 text-sm">Fiecare echipă pariază până la scorul curent. Miza va fi adăugată sau scăzută din scor.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.teams.map((team, i) => {
                  const textColor = TEAM_TEXT_COLORS[i] || 'text-white';
                  return (
                    <div key={team.id} className="bg-slate-800/60 border border-slate-600 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-3 h-3 rounded-full ${TEAM_COLORS[i]}`} />
                        <span className={`font-semibold ${textColor}`}>{team.name}</span>
                        <span className="text-slate-400 text-sm ml-auto">Scor: {team.score}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={team.score}
                          value={bets[team.id] || 0}
                          onChange={(e) => handleBetChange(team.id, Number(e.target.value))}
                          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-center font-bold focus:border-purple-500 outline-none"
                        />
                        <span className="text-slate-400 text-sm">pct</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Max: {team.score} puncte</p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleConfirmBets}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-5 h-5" />
                Confirmă Mizele și Continuă
              </button>
            </div>
          )}

          {/* Step 2: Question */}
          {step === 'question' && (
            <div className="space-y-6">
              <div className="bg-purple-900/30 border border-purple-600/50 rounded-xl p-8 text-center">
                <p className="text-xl text-white leading-relaxed mb-6">{finalQ.question}</p>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    timeLeft <= 10 ? 'bg-red-900/50 border border-red-500' :
                    timeLeft <= 20 ? 'bg-yellow-900/50 border border-yellow-500' :
                    'bg-slate-700 border border-slate-600'
                  }`}>
                    <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-400' : timeLeft <= 20 ? 'text-yellow-400' : 'text-slate-300'}`} />
                    <span className={`text-3xl font-bold font-mono ${
                      timeLeft <= 10 ? 'text-red-400' : timeLeft <= 20 ? 'text-yellow-400' : 'text-white'
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

                {!showAnswer ? (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all"
                  >
                    Afișează Răspunsul
                  </button>
                ) : (
                  <div className="bg-green-900/30 border border-green-600/50 rounded-xl p-4 mt-4">
                    <p className="text-lg font-semibold text-green-300">{finalQ.answer}</p>
                    <p className="text-sm text-slate-400 mt-2">{finalQ.rationale}</p>
                  </div>
                )}
              </div>

              {showAnswer && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white text-center">Evaluează răspunsurile:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {state.teams.map((team, i) => {
                      const textColor = TEAM_TEXT_COLORS[i] || 'text-white';
                      const bet = bets[team.id] || 0;
                      const evaluated = results[team.id] !== undefined;
                      return (
                        <div key={team.id} className={`bg-slate-800/60 border rounded-xl p-4 ${evaluated ? 'border-slate-600 opacity-60' : 'border-slate-600'}`}>
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-3 h-3 rounded-full ${TEAM_COLORS[i]}`} />
                            <span className={`font-semibold ${textColor}`}>{team.name}</span>
                            <span className="text-slate-400 text-sm ml-auto">Miză: {bet}</span>
                          </div>
                          {!evaluated ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleResult(team.id, 'correct')}
                                className="flex-1 py-2 bg-green-600/80 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-1"
                              >
                                <Check className="w-4 h-4" /> Corect
                              </button>
                              <button
                                onClick={() => handleResult(team.id, 'incorrect')}
                                className="flex-1 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-500 transition-colors flex items-center justify-center gap-1"
                              >
                                <X className="w-4 h-4" /> Greșit
                              </button>
                            </div>
                          ) : (
                            <div className={`text-center py-2 rounded-lg ${results[team.id] === 'correct' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                              {results[team.id] === 'correct' ? '✓ Corect' : '✗ Greșit'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Results */}
          {step === 'results' && (
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-yellow-900/30 to-purple-900/30 border border-yellow-600/50 rounded-xl p-8">
                <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Rezultate Finale</h3>
                <p className="text-slate-400">Toate răspunsurile au fost evaluate!</p>
              </div>

              <div className="space-y-3">
                {[...state.teams]
                  .sort((a, b) => b.score - a.score)
                  .map((team, i) => {
                    const originalIndex = state.teams.findIndex(t => t.id === team.id);
                    const textColor = TEAM_TEXT_COLORS[originalIndex] || 'text-white';
                    return (
                      <div key={team.id} className={`flex items-center gap-4 p-4 rounded-xl border ${
                        i === 0 ? 'bg-yellow-900/20 border-yellow-500' : 'bg-slate-800/60 border-slate-600'
                      }`}>
                        <span className="text-2xl font-bold text-slate-400 w-8">#{i + 1}</span>
                        <div className={`w-4 h-4 rounded-full ${TEAM_COLORS[originalIndex]}`} />
                        <span className={`font-semibold flex-1 ${textColor}`}>{team.name}</span>
                        <span className="text-xl font-bold text-white">{team.score} pct</span>
                      </div>
                    );
                  })}
              </div>

              <button
                onClick={onComplete}
                className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold text-lg rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all flex items-center gap-2 mx-auto shadow-lg"
              >
                <Crown className="w-6 h-6" />
                Vezi Câștigătorul!
              </button>
            </div>
          )}
        </div>
      </div>

      <Scoreboard />
    </div>
  );
}
