import { useState } from 'react';

const SyncButton = ({ onSync, disabled }) => {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const handleSync = async () => {
    if (syncing || disabled) return;

    setSyncing(true);
    try {
      await onSync();
      setLastSync(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {lastSync && (
        <div className="flex flex-col items-end">
          <span className="text-[8px] text-retro-muted uppercase tracking-[0.2em] opacity-50">Last_Sync_Buffer</span>
          <span className="text-[10px] font-mono terminal-text opacity-70">
            {lastSync.toLocaleTimeString().split(' ')[0]} <span className="opacity-30">{lastSync.toLocaleTimeString().split(' ')[1]}</span>
          </span>
        </div>
      )}
      <button
        onClick={handleSync}
        disabled={syncing || disabled}
        className={`
          relative group overflow-hidden
          px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest
          transition-all duration-300
          ${syncing 
            ? 'bg-retro-accent/20 text-retro-accent cursor-wait animate-pulse ring-1 ring-retro-accent/50' 
            : 'bg-retro-accent text-retro-bg hover:shadow-glow-yellow active:scale-95'
          }
          ${disabled && !syncing ? 'opacity-30 cursor-not-allowed grayscale' : ''}
        `}
        title="Synchronize system state with Codeforces"
      >
        <div className="flex items-center gap-2 relative z-10">
          {syncing && (
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          <span>{syncing ? 'Syncing...' : 'Sync_System'}</span>
        </div>
        
        {/* Background button animation */}
        {!syncing && (
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        )}
      </button>
    </div>
  );
};

export default SyncButton;

