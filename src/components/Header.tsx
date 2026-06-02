import { Link } from "react-router-dom"

function Header() {
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
                </ul>
            </div>
        </nav>
    )
}

export default Header