import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Historial() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <h2>Historial de pedidos de {user.email}</h2>
      {user.pedidos.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <ul>
          {user.pedidos.map((p, i) => (
            <li key={i}>
              <strong>{p.fecha}:</strong> {p.descripcion}
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/")}>Volver</button>
    </div>
  );
}

export default Historial;