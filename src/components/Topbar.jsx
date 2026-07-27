import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
    >
      {theme === 'dark' ? (
        <div className="flex items-center gap-1">
          <FaSun className="text-white" /> Light
 </div>
      ) : (
        <div className="flex items-center gap-1">
          <FaMoon className="text-gray-600 dark:text-gray-200" /> Dark
</div>
      )}
    </button>
  );
};

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-primary px-4 shadow-md flex justify-between items-center pl-20 lg:pl-72">
      <h1 className="text-base sm:text-xl font-bold text-primary dark:text-white truncate">
        Dankamf Admin Panel
      </h1>
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <ThemeToggle />
        <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-200 truncate max-w-[220px]">
          {user?.email}
        </span>
      </div>
    </header>
  );
}
