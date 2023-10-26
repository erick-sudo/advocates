import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useSession } from "../hooks/useSession";
import { InputField } from "../common/InputField";
import { images } from "../../assets/images/images";
import { Loader } from "../common/Loader";
import { InputGroup, Form } from "react-bootstrap";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../context/AuthContext";

export function Login() {
  const [loginErrors, setLoginErrors] = useState();
  const [handleLogin] = useLogin();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    identity: "",
    password: "",
    grant: "user",
  });
  const navigate = useNavigate();
  const { darkMode } = useContext(AuthContext);

  const [handleSession] = useSession();

  useEffect(() => {
    handleSession();
  }, []);

  function handleChange(k, v) {
    setFormData({
      ...formData,
      [k]: v,
    });
  }

  function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    handleLogin({
      payload: formData,
      setLoading,
      errorCallback: setLoginErrors,
    });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="absolute inset-0 -z-10 opacity-20 blur-0"
        style={{
          background: `url(${images.gavel}) center no-repeat`,
          backgroundSize: "cover",
        }}
      ></div>
      <div
        className={`rounded-lg text-sm shadow-inner relative ${
          darkMode ? "shadow-black/50" : "shadow-black/75"
        } p-4`}
      >
        {loading && <Loader className="bg-white/50 z-50 rounded" />}
        <div className="py-2 px-4 sm:rounded-lg sm:px-10">
          <h2
            onClick={() => navigate("/")}
            className="cursor-pointer text-left flex gap-4 items-center justify-center mb-4 text-2xl font-bold"
          >
            <FontAwesomeIcon icon={faHome} />
            <span className="relative ">Login</span>
          </h2>

          <div className="flex items-center gap-2">
            <h4>Login as</h4>
            <div>
              <InputGroup>
                <InputGroup.Text className="bg-transparent border-none">
                  <Form.Check
                    name="grant"
                    checked={formData.grant === "client"}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    value="client"
                    className=""
                    type="radio"
                  />
                </InputGroup.Text>
                <InputGroup.Text className="text-sm bg-transparent border-none">
                  Client
                </InputGroup.Text>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text className="bg-transparent border-none">
                  <Form.Check
                    name="grant"
                    checked={formData.grant === "user"}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    value="user"
                    className=""
                    type="radio"
                  />
                </InputGroup.Text>
                <InputGroup.Text className="text-sm bg-transparent border-none">
                  Staff
                </InputGroup.Text>
              </InputGroup>
            </div>
          </div>

          <form className="grid p-2 gap-4 mt-4" onSubmit={handleSubmit}>
            <div>
              <InputField
                className="px-4"
                type="text"
                id="identity"
                placeholder="Username or Email"
                value={formData.identity}
                onChange={handleChange}
                required
                name="identity"
                colors={{
                  success: "border-dark text-dark font-bold",
                  initial: "border-secondary text-secondary font-bold",
                  error: "border-danger text-danger font-bold",
                }}
              />
              {loginErrors && loginErrors.status === 404 && (
                <div className="text-red-700 bg-black rounded text-sm my-1 text-center">
                  {loginErrors.error}
                </div>
              )}
            </div>
            <div>
              <InputField
                className="px-4"
                type="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                name="password"
                colors={{
                  success: "border-dark text-dark font-bold",
                  initial: "border-secondary text-secondary font-bold",
                  error: "border-danger text-danger font-bold",
                }}
              />
              {loginErrors && loginErrors.status === 401 && (
                <div className="text-red-700 bg-black rounded text-sm my-1 text-center">
                  {loginErrors.error}
                </div>
              )}
            </div>
            <div className="mt-4 grid font-bold rounded-md">
              <button
                className={`shadow-inner shadow-black/50 hover:-translate-y-2 duration-500 hover:shadow-xl hover:shadow-black/50 hover:bg-amber-600 hover:text-white rounded-lg block px-8 py-3`}
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
          <div className="text-center flex mx-auto w-max mt-6 items-center gap-4">
            <span>Not registered..?</span>
            <NavLink to="/signup" className="text-lg underline text-blue-600">
              Sign Up
            </NavLink>
          </div>
          {/* <div className="my-4 grid gap-4">
            <div className="text-lines">Login as</div>
            <div className="grid gap-4">
              <ScaleButton
                text="Google"
                className="w-full duration-300 hover:bg-amber-600 hover:text-white shadow-gray-800/50"
              />
              <ScaleButton
                text="Facebook"
                className="w-full duration-300 hover:bg-amber-600 hover:text-white shadow-gray-800/50"
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
