import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { TEAM_COLORS, TEAM_TEXT_COLORS } from '../data/sampleQuiz';
import { Crown, Trophy, RotateCcw, PartyPopper, Home, ArrowLeft } from 'lucide-react';

interface Props {
  onRestart: () => void;
}

function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; color: string; size: number }>>([]);
  
  useEffect(() => {
    const colors = ['#fbbf24', '#818cf8', '#34d399', '#f472b6', '#fb923c', '#22d3ee'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute animate-bounce"
          style={{
            left: `${p.x}%`,
            top: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `fall ${3 + Math.random() * 2}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function WinnerScreen({ onRestart }: Props) {
  const { state, dispatch } = useGame();
  const sortedTeams = [...state.teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];
  const winnerIndex = state.teams.findIndex(t => t.id === winner?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Confetti />
      
      {/* Winner Card */}
      <div className="relative z-50 text-center max-w-lg w-full">
        <div className="mb-8">
          <PartyPopper className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
            Felicitări!
          </h1>
          <p className="text-slate-400 text-lg">Avem un câștigător!</p>
        </div>

        {/* Winner */}
        {winner && (
          <div className="bg-gradient-to-br from-yellow-900/30 to-purple-900/30 border-2 border-yellow-500 rounded-2xl p-8 mb-8 shadow-2xl shadow-yellow-500/10">
            <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <div className={`w-6 h-6 rounded-full ${TEAM_COLORS[winnerIndex]} mx-auto mb-3`} />
            <h2 className={`text-3xl font-bold ${TEAM_TEXT_COLORS[winnerIndex] || 'text-white'} mb-2`}>
              {winner.name}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-4xl font-bold text-white">{winner.score}</span>
              <span className="text-slate-400 text-lg">puncte</span>
            </div>
          </div>
        )}

        {/* Full Ranking */}
        <div className="bg-slate-800/60 border border-slate-600 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Clasament Final</h3>
          <div className="space-y-3">
            {sortedTeams.map((team, i) => {
              const originalIndex = state.teams.findIndex(t => t.id === team.id);
              const textColor = TEAM_TEXT_COLORS[originalIndex] || 'text-white';
              return (
                <div
                  key={team.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    i === 0 ? 'bg-yellow-900/20 border border-yellow-600/50' : 'bg-slate-900/50'
                  }`}
                >
                  <span className={`text-lg font-bold ${i === 0 ? 'text-yellow-400' : 'text-slate-400'} w-8`}>
                    {i === 0 ? '👑' : `#${i + 1}`}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${TEAM_COLORS[originalIndex]}`} />
                  <span className={`font-medium flex-1 text-left ${textColor}`}>{team.name}</span>
                  <span className="text-white font-bold">{team.score} pct</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => dispatch({ type: 'GO_BACK' })}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center gap-3 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Înapoi
          </button>
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-slate-700 text-slate-300 font-bold text-lg rounded-xl hover:bg-slate-600 transition-all flex items-center gap-3"
          >
            <Home className="w-5 h-5" />
            Ecranul Principal
          </button>
        </div>
      </div>
    </div>
  );
}
