import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-gray-200 sticky top-0 bg-white z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          state={{ resetFeed: true }}
          className="text-green-600 font-bold text-2xl tracking-tight"
        >
          conduit
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/editor"
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
                Write
              </Link>

              <Link
                to="/settings"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Settings
              </Link>

              <Link
                to={`/profile/${user.username}`}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                  {user.username[0].toUpperCase()}
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;