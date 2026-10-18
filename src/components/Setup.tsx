import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { TEAM_COLORS } from '../data/sampleQuiz';
import { Users, Play, Minus, Plus, Clock, ArrowLeft, Home } from 'lucide-react';

export default function Setup() {
  const { state, dispatch } = useGame();
  const [numTeams, setNumTeams] = useState(4);
  const [teamNames, setTeamNames] = useState<string[]>(['Echipa 1', 'Echipa 2', 'Echipa 3', 'Echipa 4']);
  const [timerDuration, setTimerDuration] = useState(30);

  const handleNumTeamsChange = (n: number) => {
    const newNum = Math.max(2, Math.min(10, n));
    setNumTeams(newNum);
    const newNames = [...teamNames];
    while (newNames.length < newNum) {
      newNames.push(`Echipa ${newNames.length + 1}`);
    }
    setTeamNames(newNames.slice(0, newNum));
  };

  const handleTeamNameChange = (index: number, name: string) => {
    const newNames = [...teamNames];
    newNames[index] = name;
    setTeamNames(newNames);
  };

  const handleStartGame = () => {
    const teams = teamNames.map((name, i) => ({
      id: `team-${i}`,
      name: name || `Echipa ${i + 1}`,
      color: TEAM_COLORS[i],
      score: 0,
    }));
    dispatch({ type: 'SET_TEAMS', payload: teams });
    dispatch({ type: 'SET_PHASE', payload: 'round1' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Configurare Joc</h2>
          </div>
          <button
            onClick={() => dispatch({ type: 'GO_BACK' })}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi
          </button>
        </div>

        {/* Quiz Title */}
        <div className="mb-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700">
          <p className="text-sm text-slate-400">Concurs:</p>
          <p className="text-lg font-semibold text-white">{state.quizData?.title}</p>
          <p className="text-sm text-indigo-400">Tema: {state.quizData?.topic}</p>
        </div>

        {/* Number of Teams */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">Număr de echipe</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNumTeamsChange(numTeams - 1)}
              className="w-10 h-10 flex items-center justify-center bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-3xl font-bold text-white w-12 text-center">{numTeams}</span>
            <button
              onClick={() => handleNumTeamsChange(numTeams + 1)}
              className="w-10 h-10 flex items-center justify-center bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
            <span className="text-slate-400 text-sm ml-2">(2 - 10 echipe)</span>
          </div>
        </div>

        {/* Team Names */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">Numele echipelor</label>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {teamNames.map((name, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${TEAM_COLORS[i]}`} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleTeamNameChange(i, e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
                  placeholder={`Echipa ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Timer Duration */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            <Clock className="w-4 h-4 inline mr-2" />
            Timp per întrebare (secunde)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={10}
              max={120}
              step={5}
              value={timerDuration}
              onChange={(e) => setTimerDuration(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="text-xl font-bold text-white w-16 text-center">{timerDuration}s</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleStartGame}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-900/30"
          >
            <Play className="w-6 h-6" />
            Start Joc!
          </button>
          <button
            onClick={() => dispatch({ type: 'RESET_GAME' })}
            className="w-full py-3 px-6 bg-slate-700/50 text-slate-400 font-medium rounded-xl hover:bg-slate-700 hover:text-slate-300 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Home className="w-4 h-4" />
            Înapoi la Ecranul Principal
          </button>
        </div>
      </div>
    </div>
  );
}
