import { GameProvider, useGame } from './context/GameContext';
import Dashboard from './components/Dashboard';
import Setup from './components/Setup';
import GameBoard from './components/GameBoard';
import FinalJeopardy from './components/FinalJeopardy';
import WinnerScreen from './components/WinnerScreen';

function GameRouter() {
  const { state, dispatch } = useGame();

  const handleNextPhase = () => {
    switch (state.phase) {
      case 'round1':
        dispatch({ type: 'SET_PHASE', payload: 'bonus1' });
        break;
      case 'bonus1':
        dispatch({ type: 'SET_PHASE', payload: 'round2' });
        break;
      case 'round2':
        dispatch({ type: 'SET_PHASE', payload: 'bonus2' });
        break;
      case 'bonus2':
        dispatch({ type: 'SET_PHASE', payload: 'finalJeopardy' });
        break;
      case 'finalJeopardy':
        dispatch({ type: 'SET_PHASE', payload: 'winner' });
        break;
      default:
        break;
    }
  };

  const handleRestart = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  switch (state.phase) {
    case 'dashboard':
      return <Dashboard />;
    case 'setup':
      return <Setup />;
    case 'round1':
    case 'round2':
    case 'bonus1':
    case 'bonus2':
      return <GameBoard onNextPhase={handleNextPhase} />;
    case 'finalJeopardy':
      return <FinalJeopardy onComplete={handleNextPhase} />;
    case 'winner':
      return <WinnerScreen onRestart={handleRestart} />;
    default:
      return <Dashboard />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
