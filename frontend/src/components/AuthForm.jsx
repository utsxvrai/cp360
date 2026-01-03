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
    <div className="min-h-screen flex items-center justify-center bg-retro-bg">
      <div className="retro-card w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl uppercase tracking-widest mb-2">
            {isLogin ? 'LOGIN' : 'REGISTER'}
          </h1>
          <div className="text-retro-muted text-sm">
            {isLogin ? 'ENTER CREDENTIALS' : 'CREATE ACCOUNT'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              EMAIL
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setActiveInput('email')}
                onBlur={() => setActiveInput(null)}
                className="retro-input w-full"
                required
              />
              {activeInput === 'email' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 animate-blink text-retro-text">
                  _
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setActiveInput('password')}
                onBlur={() => setActiveInput(null)}
                className="retro-input w-full"
                required
              />
              {activeInput === 'password' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 animate-blink text-retro-text">
                  _
                </span>
              )}
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                CODEFORCES HANDLE
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={codeforcesHandle}
                  onChange={(e) => setCodeforcesHandle(e.target.value)}
                  onFocus={() => setActiveInput('handle')}
                  onBlur={() => setActiveInput(null)}
                  className="retro-input w-full"
                  required={!isLogin}
                />
                {activeInput === 'handle' && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 animate-blink text-retro-text">
                    _
                  </span>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="text-retro-hard border-2 border-retro-hard p-2 text-sm uppercase">
              ERROR: {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="retro-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'PROCESSING...' : isLogin ? 'LOGIN' : 'REGISTER'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-retro-muted hover:text-retro-text text-sm uppercase tracking-wider"
          >
            {isLogin ? 'NEED AN ACCOUNT? REGISTER' : 'HAVE AN ACCOUNT? LOGIN'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

