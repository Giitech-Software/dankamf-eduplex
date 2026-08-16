import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-sm text-white transition hover:bg-white/20"
    >
      {theme === 'dark' ? (
        <div className="flex items-center gap-1">
          <FaSun className="text-white" /> Light
 </div>
      ) : (
        <div className="flex items-center gap-1">
          <FaMoon className="text-sky-100" /> Dark
</div>
      )}
    </button>
  );
};

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 min-w-0 items-center justify-between overflow-hidden bg-gradient-to-r from-[#001b36] via-[#003153] to-[#007BA7] px-4 pl-20 shadow-lg shadow-[#001b36]/20 lg:pl-72">
      <h1 className="min-w-0 truncate text-base font-black tracking-tight text-white sm:text-xl">
        Dankamf Admin Panel
      </h1>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <ThemeToggle />
        <span className="hidden max-w-[220px] truncate text-sm text-sky-100 sm:block">
          {user?.email}
        </span>
      </div>
    </header>
  );
}
