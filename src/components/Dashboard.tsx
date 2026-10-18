import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sampleQuiz } from '../data/sampleQuiz';
import { QuizData } from '../types';
import { generateQuizWithAI } from '../services/aiService';
import { Sparkles, Upload, FileText, Brain, Trophy, BookOpen, Globe, History, Key, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { dispatch } = useGame();
  const [mode, setMode] = useState<'ai' | 'manual' | null>(null);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [rounds, setRounds] = useState(2);
  const [jsonInput, setJsonInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleAIGenerate = async () => {
    if (!topic.trim()) {
      setError('Te rog introdu un subiect!');
      return;
    }
    
    if (!apiKey.trim()) {
      setError('Te rog introdu cheia API Google Gemini!');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const quizData = await generateQuizWithAI(apiKey, topic, difficulty, rounds);
      dispatch({ type: 'SET_QUIZ_DATA', payload: quizData });
      dispatch({ type: 'SET_PHASE', payload: 'setup' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la generarea concursului');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.title || !parsed.round1 || !parsed.finalJeopardy) {
        setError('JSON-ul nu respectă schema cerută!');
        return;
      }
      dispatch({ type: 'SET_QUIZ_DATA', payload: parsed as QuizData });
      dispatch({ type: 'SET_PHASE', payload: 'setup' });
    } catch {
      setError('JSON invalid! Verifică formatul.');
    }
  };

  const handleLoadSample = () => {
    dispatch({ type: 'SET_QUIZ_DATA', payload: sampleQuiz });
    dispatch({ type: 'SET_PHASE', payload: 'setup' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setJsonInput(ev.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-12 h-12 text-yellow-400" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            QuizMaster Jeopardy
          </h1>
        </div>
        <p className="text-slate-400 text-lg">Platformă interactivă de concursuri pe echipe</p>
      </div>

      {/* Quick Actions */}
      {!mode && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <button
            onClick={() => setMode('ai')}
            className="group bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:border-indigo-500 hover:bg-slate-800/80 transition-all duration-300"
          >
            <Brain className="w-12 h-12 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold text-white mb-2">Generator AI</h3>
            <p className="text-slate-400 text-sm">Generează automat un concurs complet pe orice temă</p>
          </button>

          <button
            onClick={() => setMode('manual')}
            className="group bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:border-indigo-500 hover:bg-slate-800/80 transition-all duration-300"
          >
            <FileText className="w-12 h-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold text-white mb-2">Import / Manual</h3>
            <p className="text-slate-400 text-sm">Importă JSON sau creează întrebări manual</p>
          </button>

          <button
            onClick={handleLoadSample}
            className="group bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:border-indigo-500 hover:bg-slate-800/80 transition-all duration-300"
          >
            <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold text-white mb-2">Demo Rapid</h3>
            <p className="text-slate-400 text-sm">Încearcă un concurs predefinit de Cultură Generală</p>
          </button>
        </div>
      )}

      {/* AI Generator Mode */}
      {mode === 'ai' && (
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl p-8 max-w-2xl w-full">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-8 h-8 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Generator AI de Concursuri</h2>
          </div>

          <div className="space-y-5">
            {/* API Key Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Key className="w-4 h-4 inline mr-1" />
                Cheie API Google Gemini
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Introdu cheia API (ex: AIzaSy...)"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Obține o cheie gratuită de la{' '}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
                  Google AI Studio
                </a>
              </p>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Subiectul concursului</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  { label: 'Biblie', icon: <BookOpen className="w-4 h-4" /> },
                  { label: 'Geografie', icon: <Globe className="w-4 h-4" /> },
                  { label: 'Istorie', icon: <History className="w-4 h-4" /> },
                  { label: 'Cultură Generală', icon: <Brain className="w-4 h-4" /> },
                ].map(s => (
                  <button
                    key={s.label}
                    onClick={() => setTopic(s.label)}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-sm hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Epistola către Romani, Capitalele Europei..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Difficulty and Rounds */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Dificultate</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-indigo-500 outline-none"
                >
                  <option value="easy">Ușor</option>
                  <option value="medium">Mediu</option>
                  <option value="hard">Avansat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Număr runde</label>
                <select
                  value={rounds}
                  onChange={(e) => setRounds(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-indigo-500 outline-none"
                >
                  <option value={1}>1 Rundă</option>
                  <option value={2}>2 Runde</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Se generează...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generează Concurs
                  </>
                )}
              </button>
              <button
                onClick={() => { setMode(null); setError(''); }}
                className="px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-xl hover:bg-slate-600 transition-colors"
              >
                Înapoi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual/Import Mode */}
      {mode === 'manual' && (
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl p-8 max-w-2xl w-full">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Import JSON</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Încarcă fișier JSON</label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Sau lipește JSON aici</label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={8}
                placeholder='{"title": "...", "round1": [...], ...}'
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-mono text-sm resize-none"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={handleImportJSON}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl hover:from-green-500 hover:to-teal-500 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Importă JSON
              </button>
              <button
                onClick={() => { setMode(null); setError(''); }}
                className="px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-xl hover:bg-slate-600 transition-colors"
              >
                Înapoi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="text-slate-600 text-sm mt-10">
        QuizMaster Jeopardy © 2025 — Creat cu React + Tailwind CSS
      </p>
    </div>
  );
}
