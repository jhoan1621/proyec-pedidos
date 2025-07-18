import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Pedidos() {
  const [pedido, setPedido] = useState("");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const guardarPedido = () => {
    const users = JSON.parse(localStorage.getItem("users"));
    const updatedUsers = users.map((u) => {
      if (u.email === user.email) {
        const nuevoPedido = { fecha: new Date().toLocaleString(), descripcion: pedido };
        u.pedidos.push(nuevoPedido);
        localStorage.setItem("user", JSON.stringify(u));
        return u;
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setPedido("");
    alert("Pedido registrado!");
  };

  return (
    <div>
      <h2>Hola, {user.email}</h2>
      <textarea value={pedido} onChange={(e) => setPedido(e.target.value)} placeholder="Escribe tu pedido..." />
      <button onClick={guardarPedido}>Guardar pedido</button>
      <button onClick={() => navigate("/historial")}>Ver historial</button>
      <button onClick={() => { logout(); navigate("/login"); }}>Cerrar sesión</button>
    </div>
  );
}

export default Pedidos;