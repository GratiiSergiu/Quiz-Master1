import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { sampleQuiz } from '../data/sampleQuiz';
import { QuizData } from '../types';
import { generateQuizWithAI, extractTextFromHTML } from '../services/aiService';
import { 
  Sparkles, Upload, FileText, Brain, Trophy, BookOpen, Globe, History, 
  Key, AlertCircle, Save, Trash2, FileUp, CheckCircle, X
} from 'lucide-react';

const API_KEY_STORAGE_KEY = 'quizmaster_gemini_api_key';

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
  const [hasSavedKey, setHasSavedKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  
  // Fișier sursă
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceContent, setSourceContent] = useState<string>('');
  const [sourceFileName, setSourceFileName] = useState<string>('');

  // Încarcă cheia API salvată la mount
  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
      setHasSavedKey(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
      setHasSavedKey(true);
    }
  };

  const handleDeleteApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    setHasSavedKey(false);
  };

  const handleSourceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSourceFile(file);
    setSourceFileName(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      
      // Dacă e HTML, extrage textul util
      if (file.name.toLowerCase().endsWith('.html') || file.name.toLowerCase().endsWith('.htm')) {
        const extractedText = extractTextFromHTML(content);
        setSourceContent(extractedText);
      } else {
        // Pentru TXT și alte fișiere text
        setSourceContent(content);
      }
    };
    reader.readAsText(file);
  };

  const handleClearSourceFile = () => {
    setSourceFile(null);
    setSourceContent('');
    setSourceFileName('');
  };

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
      const quizData = await generateQuizWithAI(
        apiKey, 
        topic, 
        difficulty, 
        rounds,
        sourceContent || undefined
      );
      dispatch({ type: 'SET_QUIZ_DATA', payload: quizData });
      dispatch({ type: 'SET_PHASE', payload: 'setup' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Eroare la generarea concursului';
      
      if (message.includes('API key') || message.includes('401') || message.includes('API_KEY_INVALID')) {
        setError('Cheia API este invalidă. Verifică cheia și încearcă din nou.');
      } else if (message.includes('JSON') || message.includes('pars')) {
        setError('AI-ul nu a putut genera un JSON valid după mai multe încercări. Încearcă o temă mai simplă sau folosește opțiunea "Demo Rapid".');
      } else if (message.includes('quota') || message.includes('429')) {
        setError('Limita de cereri API a fost depășită. Așteaptă puțin și încearcă din nou.');
      } else if (message.includes('not found') || message.includes('not available')) {
        setError('Modelul AI nu este disponibil momentan. Încearcă din nou în câteva momente.');
      } else {
        setError(message);
      }
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
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setHasSavedKey(false);
                    }}
                    placeholder="Introdu cheia API (ex: AIzaSy...)"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 text-xs"
                  >
                    {showKey ? 'Ascunde' : 'Arată'}
                  </button>
                </div>
                {hasSavedKey ? (
                  <button
                    onClick={handleDeleteApiKey}
                    className="px-4 py-3 bg-red-900/40 border border-red-700/50 text-red-300 rounded-xl hover:bg-red-900/60 transition-colors flex items-center gap-2"
                    title="Șterge cheia salvată"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSaveApiKey}
                    disabled={!apiKey.trim()}
                    className="px-4 py-3 bg-green-900/40 border border-green-700/50 text-green-300 rounded-xl hover:bg-green-900/60 transition-colors flex items-center gap-2 disabled:opacity-50"
                    title="Salvează cheia"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                )}
              </div>
              {hasSavedKey && (
                <div className="flex items-center gap-2 mt-2 text-green-400 text-xs">
                  <CheckCircle className="w-3 h-3" />
                  <span>Cheia este salvată local în browser</span>
                </div>
              )}
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

            {/* Source File Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <FileUp className="w-4 h-4 inline mr-1" />
                Fișier sursă (opțional) - HTML, TXT
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Încarcă un fișier HTML sau TXT cu conținut relevant. AI-ul va genera întrebări bazate pe acest conținut.
              </p>
              {!sourceFile ? (
                <input
                  type="file"
                  accept=".html,.htm,.txt"
                  onChange={handleSourceFileUpload}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                />
              ) : (
                <div className="bg-slate-900/50 border border-indigo-600/50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-400" />
                      <span className="text-white font-medium text-sm">{sourceFileName}</span>
                    </div>
                    <button
                      onClick={handleClearSourceFile}
                      className="p-1 hover:bg-slate-700 rounded transition-colors"
                      title="Elimină fișierul"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="text-xs text-slate-400">
                    <p className="mb-1">
                      <span className="text-indigo-300">Lungime:</span> {sourceContent.length} caractere
                    </p>
                    <p className="bg-slate-800 rounded p-2 max-h-24 overflow-y-auto font-mono text-xs">
                      {sourceContent.substring(0, 200)}{sourceContent.length > 200 ? '...' : ''}
                    </p>
                  </div>
                </div>
              )}
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
