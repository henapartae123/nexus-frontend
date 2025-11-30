import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/common/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "./store/api/graphqlApi";
import { useEffect } from "react";
import { setUser, selectIsAuthenticated } from "./store/slices/authSlice";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import UserProfilePage from "./pages/UserProfilePage";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { data: meData } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (meData?.me) {
      dispatch(setUser(meData.me));
    }
  }, [meData, dispatch]);

  return (
    <BrowserRouter>
      <div className="app">
        {isAuthenticated && <Navbar />}

        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/feed" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
