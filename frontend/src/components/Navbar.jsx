import { useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar({ user, setUser, currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login'); // Redirect directly to login on logout
    setIsOpen(false);
  };

  const resolvedProfile = user?.user ? user.user : user;
  const isAdmin = resolvedProfile?.role === 'admin';

  // 🔥 DYNAMIC NAVIGATION: Only show app paths if user session context exists
  const navLinks = user ? ['home', 'about', 'payments'] : [];

  return (
    <nav className="w-full bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* BRAND LOGO */}
          <Link 
            to={user ? "/" : "/login"} 
            onClick={() => setCurrentPage?.('home')} 
            className="flex items-center gap-3 font-black tracking-tighter text-xl text-slate-900"
          >
            <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 100 100" fill="currentColor">
              <path d="M20 55 L55 15 L55 45 L80 45 L45 85 L45 55 Z" />
            </svg>
            <span>
              4 <span className="text-emerald-500">FITNEZZ</span>
            </span>
          </Link>

          {/* DESKTOP ROUTING LINKS LAYER */}
          <div className="hidden md:flex items-center gap-8">
            {/* Iterates only if user session is active */}
            {navLinks.map((page) => (
              <Link
                key={page}
                to={page === 'home' ? '/' : `/${page}`}
                onClick={() => setCurrentPage?.(page)}
                className={`text-xs font-bold uppercase tracking-wider transition-colors py-2 relative ${
                  currentPage === page ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {page}
                {currentPage === page && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full" />
                )}
              </Link>
            ))}

            {user && (
              <>
                {!isAdmin && (
                  <Link
                    to="/performance-dashboard"
                    onClick={() => setCurrentPage?.('performance-dashboard')}
                    className={`text-xs font-bold uppercase tracking-wider transition-colors py-2 relative ${
                      currentPage === 'performance-dashboard' ? 'text-teal-600' : 'text-slate-500 hover:text-teal-600'
                    }`}
                  >
                    Performance
                    {currentPage === 'performance-dashboard' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-full" />
                    )}
                  </Link>
                )}
                <Link
                  to={isAdmin ? "/admin-dashboard" : "/profile"}
                  onClick={() => setCurrentPage?.(isAdmin ? 'admin-dashboard' : 'profile')}
                  className={`text-xs font-bold uppercase tracking-wider transition-colors py-2 relative ${
                    currentPage === 'profile' || currentPage === 'admin-dashboard' ? 'text-cyan-600' : 'text-slate-500 hover:text-cyan-600'
                  }`}
                >
                  {isAdmin ? "Admin Panel" : "Dashboard"}
                  {(currentPage === 'profile' || currentPage === 'admin-dashboard') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-600 rounded-full" />
                  )}
                </Link>
              </>
            )}

            {/* USER ROUTING LOGIC GATE */}
            <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
              {user ? (
                <>
                  {/* WELCOME BADGE STYLE */}
                  <span className="text-xs font-bold text-pink-500 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-200 tracking-wider">
                    WELCOME 4 FITNEZZ // MEMBER
                  </span>

                  <span className="text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 font-medium">
                    Signed in as: <strong className="text-emerald-600 font-bold">{resolvedProfile?.username || 'User'}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="bg-red-50 border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 text-red-500 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-lg transition-all"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    to="/login"
                    onClick={() => setCurrentPage?.('login')}
                    className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup"
                    onClick={() => setCurrentPage?.('signup')}
                    className="bg-emerald-500 text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-emerald-400 transition-all shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE BURGER TRIGGER */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE POP-OUT DRAWER */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-4 shadow-lg">
          <div className="space-y-2">
            {navLinks.map((page) => (
              <Link 
                key={page} 
                to={page === 'home' ? '/' : `/${page}`}
                onClick={() => { 
                  setCurrentPage?.(page); 
                  setIsOpen(false); 
                }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase transition-colors ${
                  currentPage === page ? 'bg-slate-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50/50'
                }`}
              >
                {page}
              </Link>
            ))}

            {/* SYNCHRONIZED PERFORMANCE ROUTE FOR MOBILE LAYOUT */}
            {user && !isAdmin && (
              <Link
                to="/performance-dashboard"
                onClick={() => {
                  setCurrentPage?.('performance-dashboard');
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase transition-colors ${
                  currentPage === 'performance-dashboard' ? 'bg-slate-50 text-teal-600' : 'text-slate-500 hover:bg-slate-50/50'
                }`}
              >
                Performance
              </Link>
            )}

            {user && (
              <Link 
                to={isAdmin ? "/admin-dashboard" : "/profile"}
                onClick={() => { 
                  setCurrentPage?.(isAdmin ? 'admin-dashboard' : 'profile'); 
                  setIsOpen(false); 
                }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase transition-colors ${
                  currentPage === 'profile' || currentPage === 'admin-dashboard' ? 'bg-slate-50 text-cyan-600' : 'text-slate-500 hover:bg-slate-50/50'
                }`}
              >
                {isAdmin ? "Admin Panel" : "Dashboard"}
              </Link>
            )}
          </div>

          {/* USER CONTROL PANEL (MOBILE) */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            {user ? (
              <div className="flex flex-col gap-3">
                <span className="text-center text-xs font-bold text-pink-500 bg-pink-50 px-3 py-2 rounded-xl border border-pink-100 tracking-wider">
                  WELCOME PORTAL // MEMBER
                </span>
                <span className="text-center text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-600 font-medium">
                  Signed in as: <strong className="text-emerald-600 font-bold">{resolvedProfile?.username || 'User'}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-center bg-red-50 border border-red-200 hover:bg-red-500 hover:text-white text-red-500 text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-all"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-emerald-500 text-white text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}