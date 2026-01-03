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
    <div className="flex items-center gap-3">
      <button
        onClick={handleSync}
        disabled={syncing || disabled}
        className={`
          retro-button text-sm
          ${syncing ? 'opacity-50 cursor-not-allowed' : ''}
          ${syncing ? 'animate-flicker' : ''}
        `}
        title="Sync your progress from Codeforces"
      >
        {syncing ? 'SYNCING...' : 'SYNC'}
      </button>
      {lastSync && (
        <span className="text-xs text-retro-muted uppercase">
          LAST SYNC: {lastSync.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default SyncButton;

