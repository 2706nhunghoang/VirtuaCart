import { useState } from "react";
import Button from "../components/Common/Button";
import Input from "../components/Common/Input";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const { login, loading } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(credentials);
    } catch (err) {
      setError(err?.message || err || "Login failed.");
    }
  };

  const inputErrorClass = error ? "input-error" : "";

  return (
    <section className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl items-center px-4 py-10">
      <div className="card self-center p-6 sm:p-8 cent m-auto">
        <div className="mb-6 space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Login
          </h2>
          <p className="text-sm text-muted dark:text-muted-dark">
            Enter your username and the demo password to continue.
          </p>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="label" htmlFor="username">Username</label>
            <Input
              id="username"
              name="username"
              className={inputErrorClass}
              placeholder="e.g. user123"
              value={credentials.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label" htmlFor="password">Password</label>
            <Input
              id="password"
              name="password"
              type="password"
              className={inputErrorClass}
              placeholder="Enter password"
              value={credentials.password}
              onChange={handleChange}
            />
          </div>

          {error ? (
            <p className="badge badge-danger justify-center">
              {typeof error === "object" ? error.message || JSON.stringify(error) : error}
            </p>
          ) : (
            <p className="text-sm text-muted dark:text-muted-dark">
              Demo credentials: <strong>user1 / user2 / user3</strong>, password{" "}
              <strong>123</strong>.
            </p>
          )}

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default Login;
