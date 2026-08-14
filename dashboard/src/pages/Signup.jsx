import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Video, Sun, Moon } from 'lucide-react';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/auth`, { withCredentials: true }).then(res => {
      navigate('/dashboard', { replace: true });
    }).catch(err => {
      console.log(err);
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/register`, { name, gmail: email, password }, { withCredentials: true });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#202124] transition-colors duration-300 p-4 font-sans relative">
      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-[#00796b] flex items-center justify-center text-white">
            <Video size={18} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] bg-clip-text text-transparent">
            MeetAssist
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="rounded-full p-2.5 bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-[#2d2e30] border border-[#dadce0] dark:border-[#3c4043] p-10 rounded-3xl shadow-xl animate-fade-in-up mt-16 sm:mt-0">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Join us and start managing</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-medium" htmlFor="name">
              Full Name
            </label>
            <input
              className="bg-[#f8f9fa] dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] p-3 rounded-xl text-slate-900 dark:text-[#e8eaed] placeholder-slate-400 focus:outline-none focus:border-[#00796b] focus:ring-2 focus:ring-[#00796b]/25 transition-all text-sm"
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              className="bg-[#f8f9fa] dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] p-3 rounded-xl text-slate-900 dark:text-[#e8eaed] placeholder-slate-400 focus:outline-none focus:border-[#00796b] focus:ring-2 focus:ring-[#00796b]/25 transition-all text-sm"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              className="bg-[#f8f9fa] dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] p-3 rounded-xl text-slate-900 dark:text-[#e8eaed] placeholder-slate-400 focus:outline-none focus:border-[#00796b] focus:ring-2 focus:ring-[#00796b]/25 transition-all text-sm"
              type="password"
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#00796b] hover:bg-[#00695c] text-white border-none py-3.5 px-4 rounded-xl font-semibold cursor-pointer transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-teal-500/10"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing Up...
              </>
            ) : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6 text-slate-500 dark:text-slate-400 text-sm">
          <p>Already have an account? <Link to="/login" className="text-[#00796b] dark:text-[#80cbc4] font-semibold hover:underline transition-colors">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
