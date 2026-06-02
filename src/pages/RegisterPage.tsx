import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { parseApiError, registerApi } from "../api/auth";

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!username || !email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin")
      return
    }
    setIsLoading(true);

    try {
      await registerApi(username, email, password);
      navigate("/login");
    } catch (err: unknown) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-2">Sign up</h1>
      <p className="text-center mb-6">
        <Link to="/login" className="text-green-500 hover:underline">
          Have an account?
        </Link>
      </p>

      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded px-4 py-3 w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-4 py-3 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded px-4 py-3 w-full"
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-green-500 text-white px-6 py-3 rounded text-lg self-end hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? "Đang xử lý..." : "Sign up"}
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;