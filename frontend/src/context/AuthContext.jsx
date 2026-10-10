import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

// create the context
const AuthContext = createContext(null);

// provider component — wraps the whole app
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);              // logged-in user (null = not logged in)
    const [loading, setLoading] = useState(true);        // true while checking auth on first load

    // set role class on <body> so CSS variables change per role
    useEffect(() => {
        if (user) {
            document.body.className = `role-${user.role}`;   // e.g. "role-doctor", "role-patient"
        } else {
            document.body.className = "";                    // no role → default green theme
        }
    }, [user]);                                          // reruns whenever user changes

    // runs once when app loads — check if user is already logged in
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get("/auth/profile");   // ask backend if cookie is valid
                setUser(response.data.user);              // user is logged in
            } catch {
                setUser(null);                            // not logged in (no valid cookie)
            } finally {
                setLoading(false);                        // done checking either way
            }
        };

        checkAuth();
    }, []);                                              // empty deps → runs once on mount

    // login function — called from Login page
    const login = async (email, password) => {
        await api.post("/auth/login", { email, password });   // posts credentials, sets cookie

        // fetch full profile after login
        const profileResponse = await api.get("/auth/profile");   // gets full user object
        setUser(profileResponse.data.user);              // save user in context

        return profileResponse.data.user;                // return so Login can redirect by role
    };

    // logout function — called from LogoutButton
    const logout = async () => {
        await api.post("/auth/logout");                  // backend clears the cookie
        setUser(null);                                   // clear user state
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);

    // safety check — throws a clear error if used outside AuthProvider
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;                                      // return the context value
}