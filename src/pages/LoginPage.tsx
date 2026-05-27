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

  const handleSubmit = async () => {
    setError("")

    if (!form.email || !form.password) {
      setError("Vui lòng nhập đầy đủ thông tin.")
      return
    }

    setIsLoading(true)

    try {
      const res = await loginApi(form.email, form.password)
      login(res.user.token, res.user)
      navigate("/")
    } catch (err: unknown) {
      setError(parseApiError(err))
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
      />
    </div>
  )
}

export default LoginPage
