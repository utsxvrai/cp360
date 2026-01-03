import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header = ({ streak, isActiveToday }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="retro-border border-b-4 mb-8 pb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl uppercase tracking-widest mb-2">
            CODEFORCES POTD
          </h1>
          <div className="text-retro-muted text-sm uppercase">
            {user?.email} | {user?.codeforces_handle?.toUpperCase()}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm text-retro-muted uppercase tracking-wider mb-1">
              CURRENT STREAK
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{String(streak).padStart(2, '0')}</span>
              <span className="text-sm uppercase">DAYS</span>
              <div
                className={`w-3 h-3 border-2 ${
                  isActiveToday ? 'bg-retro-easy border-retro-easy' : 'bg-retro-disabled border-retro-disabled'
                }`}
                title={isActiveToday ? 'Streak active today' : 'Streak not active today'}
              />
            </div>
            <div className="text-xs text-retro-disabled mt-1 uppercase">
              SOLVE AT LEAST ONE PROBLEM DAILY
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="retro-button text-sm"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

