import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setUser } from "../store/slices/userSlice";
import { RootState } from "../store";

export default function Auth() {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const apiUrl = useSelector((state: RootState) => state.config.apiUrl);
  const location = useLocation();
  const [view, setView] = useState(
    location.pathname.includes("login") ? "login" : "register"
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setError("");
    setSuccess(false);
    setLoading(false);
  }, [view]);

  useEffect(() => {
    const currentView = location.pathname.includes("login")
      ? "login"
      : "register";
    setView(currentView);
  }, [location.pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { username, email, password });
    try {
      setLoading(true);
      if (view === "register") {
        const registerResponse = await fetch(`${apiUrl}/users/register`, {
          method: "POST",
          headers: { "content-type": "Application/json" },
          body: JSON.stringify({ username, email, password }),
        });
        const registerData = await registerResponse.json();

        console.log("registerData", registerData);
        if (registerResponse.ok) {
          setSuccess(registerData.message);
        }
      } else {
        const loginResponse = await fetch(`${apiUrl}/users/login`, {
          method: "POST",
          headers: { "content-type": "Application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
        const loginData = await loginResponse.json();
        console.log("login", loginData);
        if (loginResponse.ok) {
          setSuccess(true);
          dispatch(setUser(loginData.data));
          navigate("/");
        } else {
          throw new Error(loginData.message);
        }
      }
    } catch (error: any) {
      setSuccess(false);
      setError(error?.message || "There was an error submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {view === "login" ? "Sign In" : "Create Account"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {view === "login"
              ? "Sign in to access your account"
              : "Register to create a new account"}
          </p>
          <p>isAuthenticated: {isAuthenticated.toString()}</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {view === "register" && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                min={3}
                value={username}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Username"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Email address"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              min={8}
              value={password}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Password"
            />
          </div>

          {success && (
            <p className="bg-green-100 rounded text-green-500 text-sm p-2 px-3">
              You have successfully{" "}
              {view === "login" ? "logged in" : "registered"}!
            </p>
          )}
          {error && (
            <p className="bg-red-100 rounded text-red-500 text-sm p-2 px-3">
              {error}
            </p>
          )}

          <div>
            {view == "register" && (
              <button
                type="submit"
                className="w-full cursor-pointer px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                {loading ? "Loading" : "Register"}
              </button>
            )}
            {view == "login" && (
              <button
                type="submit"
                className="w-full cursor-pointer px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                {loading ? "Loading" : "Login"}
              </button>
            )}
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {view === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <Link
              to={location.pathname.includes("login") ? "/register" : "/login"}
              className="font-medium cursor-pointer text-gray-700 hover:text-black"
            >
              {view === "login" ? "Register" : "Login"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
