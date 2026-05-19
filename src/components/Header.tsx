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
    <nav className="border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-green-500 font-bold text-xl">
          conduit
        </Link>

        <ul className="flex gap-6">
          <li>
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link to="/editor" className="text-gray-600 hover:text-gray-900">
                  New Post
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-gray-600 hover:text-gray-900">
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  to={`/profile/${user.username}`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {user.username}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-gray-900">
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;