import ThemeToggle from "../Common/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../store/cartContext";
import Button from "../Common/Button";

function Header({ onNavigate }) {
  const { user, logout } = useAuth();
  const { totalItems, clearCart } = useCart();

  const handleLogout = () => {
    logout();
    clearCart();
  }

  return (
    <header className="bg-surface dark:bg-surface-dark text-primary-700 dark:text-primary-100 sticky top-0 z-10 flex items-center justify-between gap-6 border-b border-slate-200 bg-white/90 px-10 py-4 backdrop-blur-md max-md:flex-col max-md:items-stretch max-md:px-4">
      {/* Logo */}
      <Button
        variant="none"
        onClick={() => onNavigate?.("home")}
        className="text-[22px] font-extrabold tracking-normal p-0 hover:bg-transparent"
      >
        WoangShop
      </Button>

      <div className="flex items-center gap-4 max-md:justify-between">
        {/* Auth section */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="whitespace-nowrap text-sm font-medium text-slate-500">
              Welcome,{" "}
              <span className="font-semibold text-teal-600 dark:text-teal-400">
                {user.username}
              </span>
              !
            </span>

            <Button
              variant="danger-outline"
              onClick={handleLogout}
              className="flex items-center gap-1.5"
              title="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" strokeWidth="2.3" />
              </svg>
              <span className="max-sm:hidden">Logout</span>
            </Button>

            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 max-md:hidden" />

            {/* Cart icon */}
            <Button
              variant="icon"
              onClick={() => onNavigate?.("cart")}
              aria-label={`Cart — ${totalItems} items`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>

              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white dark:bg-primary-dark">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Button>
          </div>
        ) : (
          <span className="whitespace-nowrap text-sm font-medium text-slate-500">
            Please login
          </span>
        )}

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 max-md:hidden" />

        <ThemeToggle />
      </div>
    </header>
  );
}

export default Header;
