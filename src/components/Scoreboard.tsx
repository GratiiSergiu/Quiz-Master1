import { useGame } from '../context/GameContext';
import { TEAM_TEXT_COLORS } from '../data/sampleQuiz';
import { Crown, Trophy } from 'lucide-react';

export default function Scoreboard() {
  const { state } = useGame();
  const sortedTeams = [...state.teams].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-slate-800/80 backdrop-blur border-t border-slate-700 px-4 py-3">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Trophy className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-medium text-slate-300">Clasament Live</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {sortedTeams.map((team, index) => {
          const originalIndex = state.teams.findIndex(t => t.id === team.id);
          const textColor = TEAM_TEXT_COLORS[originalIndex] || 'text-white';
          const isFirst = index === 0 && team.score > 0;
          
          return (
            <div
              key={team.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-500 ${
                isFirst
                  ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/10'
                  : 'border-slate-600 bg-slate-900/50'
              }`}
            >
              {isFirst && <Crown className="w-4 h-4 text-yellow-400" />}
              <span className={`font-semibold text-sm ${textColor}`}>{team.name}</span>
              <span className="text-white font-bold">{team.score}</span>
              <span className="text-slate-500 text-xs">pct</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
