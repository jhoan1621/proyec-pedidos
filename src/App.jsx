/* app.jsx */
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pedidos from "./pages/Pedidos";
import Historial from "./pages/Historial";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import "./index.css";

function App() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1>PedidoApp</h1>
        <div className="nav-links">
          {user && <Link to="/">Pedidos</Link>}
          {user && <Link to="/historial">Historial</Link>}
          {user ? (
            <button onClick={logout}>Cerrar sesión</button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Registro</Link>
            </>
          )}
        </div>
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/" element={user ? <Pedidos /> : <Navigate to="/login" state={{ from: location }} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/historial" element={user ? <Historial /> : <Navigate to="/login" state={{ from: location }} />} />
        </Routes>
      </div>

      <footer className="footer">
        <p>© 2025 PedidoApp - Todos los derechos reservados.</p>
        <p>Desarrollado por Jhoan Games YT</p>
        <img src="https://via.placeholder.com/150x50?text=Logo" alt="Logo" />
      </footer>
    </div>
  );
}

export default App;