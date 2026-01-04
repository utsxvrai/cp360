import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ streak, isActiveToday }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="glass-panel p-6 mb-8 group relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-retro-accent/10 blur-3xl group-hover:bg-retro-accent/20 transition-all duration-700" />
      
      <div className="flex items-center justify-between flex-wrap gap-6 relative z-10">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-retro-accent flex items-center justify-center rounded-lg shadow-glow-yellow animate-pulse-slow shrink-0">
            <span className="text-retro-bg font-black text-xl">CP</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold tracking-tighter terminal-text leading-none">
              CP360
            </h1>
            <div className="text-retro-muted text-[8px] uppercase tracking-widest font-mono mt-1">
              v2.0_stable
            </div>
          </div>
        </div>

        {/* Centered Hacked Branding */}
        <div className="flex-[2] flex flex-col items-center justify-center min-w-[200px] text-center">
          <div className="relative group cursor-default">
            <div className="text-[15px] font-mono text-retro-hard/40 line-through tracking-[0.3em] uppercase mb-0.5">
              Problem of the day 
            </div>
            <div className="text-[20px] font-black terminal-text tracking-[0.2em] uppercase text-glow">
              Triplets of the day
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8 flex-1 justify-end">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-retro-muted uppercase tracking-[0.2em] mb-1 font-bold">
              SYSTEM STREAK
            </div>
            <div className="flex items-center justify-end gap-3">
              <div className="flex flex-col items-end leading-none">
                <span className="text-2xl font-bold terminal-text">
                  {String(streak).padStart(2, '0')}
                </span>
                <span className="text-[8px] uppercase tracking-tighter opacity-50">CYCLES</span>
              </div>
              
              <div
                className={`w-4 h-4 rounded-sm border ring-2 ring-offset-2 ring-offset-retro-bg transition-all duration-500 ${
                  isActiveToday 
                    ? 'bg-retro-easy border-retro-easy shadow-[0_0_10px_rgba(16,185,129,0.5)] ring-retro-easy/20 animate-pulse' 
                    : 'bg-retro-disabled border-retro-disabled ring-transparent'
                }`}
                title={isActiveToday ? 'Sync sequence active' : 'Sync sequence pending'}
              />
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="retro-button-outline text-[10px] px-4 py-2"
          >
            TERMINATE_SESSION
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

