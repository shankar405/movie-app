import { BrowserRouter, Routes, Route } from "react-router-dom";
import Movies from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import  { AuthRoute,AdminRoute } from "./components/AdminRoute";

const App = () => (
 <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated routes */}
      <Route
        path="/movies"
        element={
          <AuthRoute>
            <Movies />
          </AuthRoute>
        }
      />

      {/* Admin-only route */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
