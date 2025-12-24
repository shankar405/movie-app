import { BrowserRouter, Routes, Route } from "react-router-dom";
import Movies from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import  { AuthRoute,AdminRoute } from "./components/AdminRoute";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <AuthRoute>
            <Movies />
          </AuthRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default App;
