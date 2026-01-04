import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [codeforcesHandle, setCodeforcesHandle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!codeforcesHandle) {
          setError('Codeforces handle is required');
          setLoading(false);
          return;
        }
        await signup(email, password, codeforcesHandle);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-retro-bg p-4 relative overflow-hidden">
      <div className="scanline" />
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-retro-accent/5 blur-[120px] pointer-events-none" />

      <div className="glass-panel w-full max-w-md p-8 relative z-10 space-y-8 animate-fade-in shadow-glow-yellow/5">
        <div className="text-center">
          <div className="inline-block p-3 rounded-xl bg-retro-accent/10 border border-retro-accent/20 mb-4">
            <h1 className="text-2xl font-black terminal-text tracking-[0.2em]">
              {isLogin ? 'AUTH_EXEC' : 'REG_INIT'}
            </h1>
          </div>
          <div className="text-retro-muted text-[10px] uppercase font-mono tracking-widest opacity-50">
            {isLogin ? 'Establishing sync sequence...' : 'Initializing new operative profile...'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-[10px] text-retro-muted uppercase tracking-[0.2em] font-mono font-bold">
              User_Identifier
            </label>
            <div className="relative group">
              <input
                type="email"
                placeholder="EMAIL_ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setActiveInput('email')}
                onBlur={() => setActiveInput(null)}
                className="w-full bg-white/5 border border-retro-border rounded-lg px-4 py-3 text-sm focus:border-retro-accent/50 focus:bg-retro-accent/5 outline-none transition-all font-mono"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                {activeInput === 'email' && <div className="w-1.5 h-1.5 rounded-full bg-retro-accent animate-pulse" />}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] text-retro-muted uppercase tracking-[0.2em] font-mono font-bold">
              Secure_Key
            </label>
            <div className="relative group">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setActiveInput('password')}
                onBlur={() => setActiveInput(null)}
                className="w-full bg-white/5 border border-retro-border rounded-lg px-4 py-3 text-sm focus:border-retro-accent/50 focus:bg-retro-accent/5 outline-none transition-all font-mono"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                {activeInput === 'password' && <div className="w-1.5 h-1.5 rounded-full bg-retro-accent animate-pulse" />}
              </div>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="block text-[10px] text-retro-muted uppercase tracking-[0.2em] font-mono font-bold">
                CF_Interface_Handle
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="HANDLE"
                  value={codeforcesHandle}
                  onChange={(e) => setCodeforcesHandle(e.target.value)}
                  onFocus={() => setActiveInput('handle')}
                  onBlur={() => setActiveInput(null)}
                  className="w-full bg-white/5 border border-retro-border rounded-lg px-4 py-3 text-sm focus:border-retro-accent/50 focus:bg-retro-accent/5 outline-none transition-all font-mono uppercase"
                  required={!isLogin}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                  {activeInput === 'handle' && <div className="w-1.5 h-1.5 rounded-full bg-retro-accent animate-pulse" />}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-retro-hard/10 border border-retro-hard/30 rounded-lg text-retro-hard text-[10px] font-mono animate-shake">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>CMD_ERR: {error.toUpperCase()}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="retro-button w-full h-12 flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin font-bold" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              <span>{isLogin ? 'EXECUTE_LOGIN' : 'INITIATE_REGISTER'}</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-[10px] text-retro-muted hover:text-retro-accent uppercase tracking-widest font-mono transition-colors"
          >
            {isLogin ? '>_ SWITCH_TO_REGISTRATION' : '>_ BACK_TO_AUTH_CONSOLE'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

