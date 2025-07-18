import { useContext, useEffect, useState } from "react"; 
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Historial() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (!user) return;

    const historial = JSON.parse(localStorage.getItem("historial")) || {};
    const pedidosUsuario = historial[user.email] || [];
    setPedidos(pedidosUsuario);
  }, [user]);

  const totalVentas = pedidos.reduce((acc, pedido) => acc + pedido.subtotal, 0);

  return (
    <div className="historial-container">
      <h2>📜 Historial de pedidos de {user.email}</h2>

      {pedidos.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <>
          <div className="tarjeta-total">
            <h3>💰 Total acumulado de ventas</h3>
            <p><strong>S/ {totalVentas.toFixed(2)}</strong></p>
          </div>

          {pedidos.map((pedido, index) => (
            <div key={index} className="pedido">
              <h3>Pedido del {pedido.fecha}</h3>
              <ul>
                {pedido.items.map((item, i) => (
                  <li key={i}>
                    {item.nombre} x {item.cantidad} = S/{" "}
                    {(item.precio * item.cantidad).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Total: S/ {pedido.subtotal.toFixed(2)}</strong>
              </p>
            </div>
          ))}
        </>
      )}

      <button onClick={() => navigate("/")} className="volver-btn">
        Volver
      </button>
    </div>
  );
}

export default Historial;
