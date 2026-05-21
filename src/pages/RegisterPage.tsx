import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { parseApiError, registerApi } from "../api/auth";
import { registerFields } from "../components/form/authFields";
import AuthForm from "../components/form/AuthForm";
function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!form.username || !form.email || !form.password) {
      setError("Vui lòng nhập đầy đủ thông tin")
      return
    }
    setIsLoading(true);

    try {
      await registerApi(form.username, form.email, form.password);
      navigate("/login");
    } catch (err: unknown) {
      console.log("Lỗi:", err);
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

      <AuthForm
        fields={registerFields}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        buttonText="Sign up"
      />

    </div>
  );
}

export default RegisterPage;