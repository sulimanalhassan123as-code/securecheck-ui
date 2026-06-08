import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://securecheck-api.onrender.com/api";

export default function Welcome() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [purpose, setPurpose] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/system`)
      .catch(() => {});
  }, []);

  const continueToPlatform = () => {
    if (!name || !level || !purpose) {
      alert("Please complete all fields");
      return;
    }

    localStorage.setItem(
      "cyberzero_name",
      name
    );

    localStorage.setItem(
      "cyberzero_level",
      level
    );

    localStorage.setItem(
      "cyberzero_purpose",
      purpose
    );

    localStorage.setItem(
      "cyberzero_onboarded",
      "true"
    );

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#050b1a] text-white flex items-center justify-center p-6">

      <div className="w-full max-w-2xl bg-[#111827] border border-cyan-900 rounded-3xl p-8">

        <h1 className="text-4xl font-bold mb-2">
          Welcome to Cyber-Zero
        </h1>

        <p className="text-gray-400 mb-8">
          Preparing intelligence systems...
        </p>

        <div className="space-y-6">

          <div>
            <label className="block mb-2 text-sm text-cyan-400">
              Your Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
              className="w-full bg-[#050b1a] border border-gray-700 rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-cyan-400">
              Experience Level
            </label>

            <select
              value={level}
              onChange={(e) =>
                setLevel(e.target.value)
              }
              className="w-full bg-[#050b1a] border border-gray-700 rounded-xl p-4"
            >
              <option value="">
                Select level
              </option>

              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-cyan-400">
              Purpose
            </label>

            <select
              value={purpose}
              onChange={(e) =>
                setPurpose(e.target.value)
              }
              className="w-full bg-[#050b1a] border border-gray-700 rounded-xl p-4"
            >
              <option value="">
                Select purpose
              </option>

              <option value="Developer">
                Developer
              </option>

              <option value="Student">
                Student
              </option>

              <option value="Researcher">
                Researcher
              </option>

              <option value="Business">
                Business
              </option>
            </select>
          </div>

          <button
            onClick={continueToPlatform}
            className="w-full bg-cyan-600 hover:bg-cyan-500 rounded-xl py-4 font-bold"
          >
            Enter Cyber-Zero
          </button>

        </div>

      </div>

    </div>
  );
}
