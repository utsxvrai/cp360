import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="retro-button text-sm"
      title={`Switch to ${theme === 'retro' ? 'inverted' : 'retro'} theme`}
    >
      {theme === 'retro' ? 'INVERT' : 'NORMAL'}
    </button>
  );
};

export default ThemeToggle;

