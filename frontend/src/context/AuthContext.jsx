import { useCallback, useEffect, useMemo, useState } from "react";
import AuthContext from "./authContextStore";
import { apiRequest } from "@/lib/api";

const TOKEN_KEY = "crowdcare_token";
const EVENT_KEY = "crowdcare_selected_event";

const readStoredEvent = () => {
  try {
    return JSON.parse(localStorage.getItem(EVENT_KEY)) || null;
  } catch {
    localStorage.removeItem(EVENT_KEY);
    return null;
  }
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [selectedEvent, setSelectedEvent] = useState(readStoredEvent);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EVENT_KEY);
    setToken(null);
    setUser(null);
    setSelectedEvent(null);
  }, []);

  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (!storedToken) {
      setLoading(false);
      return null;
    }

    setLoading(true);

    try {
      const data = await apiRequest("/auth/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setToken(storedToken);
      setUser(data.user);

      if (data.user.eventId) {
        const cachedEvent = readStoredEvent();

        if (cachedEvent?._id === data.user.eventId) {
          setSelectedEvent(cachedEvent);
        } else {
          const eventData = await apiRequest(`/events/${data.user.eventId}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          localStorage.setItem(EVENT_KEY, JSON.stringify(eventData.event));
          setSelectedEvent(eventData.event);
        }
      } else {
        localStorage.removeItem(EVENT_KEY);
        setSelectedEvent(null);
      }

      return data.user;
    } catch (error) {
      logout();
      throw error;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadUser().catch(() => {});
  }, [loadUser]);

  const persistSession = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);

    const cachedEvent = readStoredEvent();
    if (!data.user.eventId || cachedEvent?._id !== data.user.eventId) {
      localStorage.removeItem(EVENT_KEY);
      setSelectedEvent(null);
    }

    return data.user;
  }, []);

  const login = useCallback(
    async (credentials) => {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      return persistSession(data);
    },
    [persistSession],
  );

  const register = useCallback(
    async (details) => {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(details),
      });
      return persistSession(data);
    },
    [persistSession],
  );

  const selectEvent = useCallback(
    async (eventId) => {
      const data = await apiRequest("/auth/select-event", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ eventId }),
      });

      localStorage.setItem(EVENT_KEY, JSON.stringify(data.event));
      setSelectedEvent(data.event);
      setUser(data.user);
      return data.event;
    },
    [token],
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      loading,
      selectedEvent,
      login,
      logout,
      register,
      selectEvent,
      loadUser,
    }),
    [
      loadUser,
      loading,
      login,
      logout,
      register,
      selectEvent,
      selectedEvent,
      token,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
