import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { parseApiError, registerApi } from "../api/auth";
import { registerFields } from "../components/form/authFields";
import AuthForm from "../components/form/AuthForm";
import ErrorMessage from "../components/ErrorMessage";
function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const handleSubmit = async () => {
    setError("");
    setFieldErrors({})

    const errors: Partial<Record<"username" | "email" | "password", string>> = {}
    if (!form.username) errors.username = "Username is required."
    if (!form.email) errors.email = "Email is required."
    if (!form.password) errors.password = "Password is required."
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setIsLoading(true);

    try {
      await registerApi(form.username, form.email, form.password);
      const goToLogin = window.confirm(
        "Registration successful! \n\nDo you want to go to Login page?"
      )
      if (goToLogin) {
        navigate("/login")
      } else {
        navigate("/register")
      }
    } catch (err: unknown) {
      const apiErr = err as { status: number; data: { errors: Record<string, string | string[]> } }
      if (apiErr.status === 422 && apiErr.data?.errors) {
        const serverErrors: Partial<Record<"username" | "email" | "password", string>> = {}
        Object.entries(apiErr.data.errors).forEach(([field, errs]) => {
          const msg = Array.isArray(errs) ? errs.join(", ") : errs
          if (field === "username") serverErrors.username = `Username ${msg}`
          if (field === "email") serverErrors.email = `Email ${msg}`
          if (field === "password") serverErrors.password = `Password ${msg}`
        })
        if (Object.keys(serverErrors).length > 0) {
          setFieldErrors(serverErrors)
        } else {
          setError(parseApiError(err))
        }
      } else {
        setError(parseApiError(err))
      }
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

      <ErrorMessage message={error} />

      <AuthForm
        fields={registerFields}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        buttonText="Sign up"
        fieldErrors={fieldErrors}
      />

    </div>
  );
}

export default RegisterPage;