import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginApi, parseApiError } from "../api/auth"
import { useAuth } from "../context/useAuth"
import AuthForm from "../components/form/AuthForm"
import { loginFields } from "../components/form/authFields"
import ErrorMessage from "../components/ErrorMessage"

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const handleSubmit = async () => {
    setError("")
    setFieldErrors({})

    // Validate từng field riêng
    const errors: Partial<Record<"email" | "password", string>> = {}
    if (!form.email) errors.email = "Email is required."
    if (!form.password) errors.password = "Password is required."
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsLoading(true)

    try {
      const res = await loginApi(form.email, form.password)
      login(res.user.token, res.user)
      navigate("/")
    } catch (err: unknown) {
      const apiErr = err as { status: number; data: { errors: Record<string, string | string[]> } }
      if (apiErr.status === 422 && apiErr.data?.errors) {
        const serverErrors: Partial<Record<"email" | "password", string>> = {}
        Object.entries(apiErr.data.errors).forEach(([field, errs]) => {
          const msg = Array.isArray(errs) ? errs.join(", ") : errs
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
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-2">
        Sign in
      </h1>

      <p className="text-center mb-6">
        <Link to="/register" className="text-green-500 hover:underline">
          Need an account?
        </Link>
      </p>

      <ErrorMessage message={error} />

      <AuthForm
        fields={loginFields}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        buttonText="Sign in"
        fieldErrors={fieldErrors}
      />
    </div>
  )
}

export default LoginPage
