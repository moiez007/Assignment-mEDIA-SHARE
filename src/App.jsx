import { NavLink, Route, Routes, Navigate } from "react-router-dom";
import ImageDetailPage from "./pages/ImageDetailPage";
import AuthPage from "./pages/AuthPage";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchNotifications } from "./services/notificationService";
import Button from "./components/Button";
import LandingPage from "./pages/LandingPage";
import CreatorDashboard from "./pages/CreatorDashboard";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser || storedUser === "undefined" || storedUser === "null") {
        return null;
      }
      return JSON.parse(storedUser);
    } catch (error) {
      localStorage.removeItem("user");
      return null;
    }
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotif, setLoadingNotif] = useState(false);

  useEffect(() => {
    function syncAuthState() {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser || storedUser === "undefined" || storedUser === "null") {
          setUser(null);
          return;
        }
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    }

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("auth-change", syncAuthState);
    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("auth-change", syncAuthState);
    };
  }, []);

  // ✅ Load notifications when panel opens
  useEffect(() => {
    if (!showNotifications) return;

    async function loadNotifications() {
      setLoadingNotif(true);
      try {
        const data = await fetchNotifications();
        setNotifications(data || []);
      } catch (err) {
        console.error("Failed to load notifications");
      } finally {
        setLoadingNotif(false);
      }
    }

    loadNotifications();
  }, [showNotifications]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <h1>Lumen Gallery</h1>
          <p>Photo sharing platform</p>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Explore
          </NavLink>

          {user?.role === "creator" && (
            <NavLink
              to="/creator"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Creator
            </NavLink>
          )}

          {!user ? (
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Login
            </NavLink>
          ) : (
            <button
              className="nav-link"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
                window.dispatchEvent(new Event("auth-change"));
              }}
            >
              Logout
            </button>
          )}
        </nav>
      </aside>

      <main className="main-panel">
        {/* ✅ TOP BAR */}
        <div className="top-bar">
          {user && (
            <div className="align-center border">
              <div className="notification-wrapper">
                <Button
                  className="notification-btn flex items-center justify-center gap-2"
                  onClick={() => setShowNotifications((prev) => !prev)}
                >
                  <span className="notif-text">Notifications</span>
                  <Bell size={18} className=" flex-shrink-0" />

                  {/* dynamic count */}
                  {notifications.length > 0 && (
                    <span className="badge">{notifications.length}</span>
                  )}
                </Button>

                {showNotifications && (
                  <div className="notification-panel">
                    <p className="notif-title">Notifications</p>

                    {loadingNotif ? (
                      <p className="notif-item">Loading...</p>
                    ) : notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n.id || n._id} className="notif-item">
                          {n.message || n.text || "New notification"}
                        </div>
                      ))
                    ) : (
                      <p className="notif-item">No notifications</p>
                    )}

                    <button
                      className="close-btn"
                      onClick={() => setShowNotifications(false)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
                
                  <div>
              <h2 className="user-name">{user.username || "User"}</h2>
              </div>
            </div>
          )}
        </div>

        <Routes>
          <Route
            path="/"
            element={user ? <LandingPage /> : <Navigate to="/auth" replace />}
          />
          <Route path="/images/:imageId" element={<ImageDetailPage />} />
          <Route
            path="/creator"
            element={
              user?.role === "creator" ? (
                <CreatorDashboard />
              ) : (
                <Navigate to={user ? "/" : "/auth"} replace />
              )
            }
          />
          <Route
            path="/auth"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <AuthPage
                  onAuthSuccess={(nextUser) => {
                    setUser(nextUser);
                    window.dispatchEvent(new Event("auth-change"));
                  }}
                />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
