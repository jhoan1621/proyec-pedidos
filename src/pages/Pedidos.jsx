import { useState } from "react";
import { menu } from "../data/menu";

function Pedidos() {
  const [carrito, setCarrito] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [detallePedido, setDetallePedido] = useState(null);
  const [verDetalle, setVerDetalle] = useState(false);
  const [productoDetalle, setProductoDetalle] = useState(null);
  const tipos = [...new Set(menu.map(item => item.tipo))];

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((item) => item.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const reducirCantidad = (id) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const calcularTotal = () => {
    const subtotal = carrito.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    const igv = subtotal * 0.18;
    return { subtotal, igv, total: subtotal + igv };
  };

  const { subtotal, igv, total } = calcularTotal();

  const finalizarPedido = () => {
    const nuevoPedido = {
      fecha: new Date().toLocaleString(),
      items: carrito,
      subtotal,
      igv,
      total,
    };

    const usuarioActual = JSON.parse(localStorage.getItem("user"));
    if (!usuarioActual) return;

    const historial = JSON.parse(localStorage.getItem("historial")) || {};
    const pedidosUsuario = historial[usuarioActual.email] || [];
    pedidosUsuario.push(nuevoPedido);
    historial[usuarioActual.email] = pedidosUsuario;

    localStorage.setItem("historial", JSON.stringify(historial));
    setDetallePedido(nuevoPedido);
    setMostrarModal(true);
    setCarrito([]); // vacía el carrito a
  };

  return (
    <div className="pedidos-container">
      <h2>Menús disponibles:</h2>
      <div className="pedidos-container">
    {tipos.map((tipo) => (
      <div key={tipo}>
        <h2 className="titulo-tipo">🍽️ {tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h2>
        <div className="productos">
          {menu
            .filter((item) => item.tipo === tipo)
            .map((item) => (
              <div key={item.id} className="producto">
                <div className="producto-img-container">
                  <img src={item.imagen} alt={item.nombre} />
                </div>
                <h3>{item.nombre}</h3>
                <p>Precio: S/ {item.precio.toFixed(2)}</p>
                <button
                  onClick={() => {
                    setProductoDetalle(item);
                    setVerDetalle(true);
                  }}
                >
                  Ver detalles
                </button>
                <button onClick={() => agregarAlCarrito(item)}>
                  Agregar al carrito
                </button>
              </div>
            ))}
        </div>
      </div>
    ))}
  </div>

      <h2>🛒 Carrito</h2>
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <div className="carrito">
          <ul>
            {carrito.map((item) => (
              <li key={item.id}>
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="carrito-img"
                />
                <div className="carrito-info">
                  <strong>{item.nombre}</strong>
                  <br />
                  <button onClick={() => reducirCantidad(item.id)}>-</button>
                  <span> {item.cantidad} </span>
                  <button onClick={() => agregarAlCarrito(item)}>+</button>
                  <br />
                  Total: S/ {(item.precio * item.cantidad).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
          <p>
            <strong>Subtotal:</strong> S/ {subtotal.toFixed(2)}
          </p>
          <p>
            <strong>IGV (18%):</strong> S/ {igv.toFixed(2)}
          </p>
          <p>
            <strong>Total a pagar:</strong> S/ {total.toFixed(2)}
          </p>

          <button onClick={finalizarPedido} className="finalizar-btn">
            🧾 Finalizar pedido
          </button>
        </div>
      )}

      {/* Modal de confirmación */}
      {mostrarModal && detallePedido && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>✅ Pedido Finalizado</h3>
            <p>
              <strong>Fecha:</strong> {detallePedido.fecha}
            </p>
            <ul>
              {detallePedido.items.map((item) => (
                <li key={item.id}>
                  {item.nombre} x {item.cantidad} = S/{" "}
                  {(item.precio * item.cantidad).toFixed(2)}
                </li>
              ))}
            </ul>
            <p>
              <strong>Subtotal:</strong> S/ {detallePedido.subtotal.toFixed(2)}
            </p>
            <p>
              <strong>IGV:</strong> S/ {detallePedido.igv.toFixed(2)}
            </p>
            <p>
              <strong>Total:</strong> S/ {detallePedido.total.toFixed(2)}
            </p>
            <button onClick={() => setMostrarModal(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal de ingredientes */}
      {verDetalle && productoDetalle && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>{productoDetalle.nombre}</h3>
            <p>
              <strong>Ingredientes:</strong>
            </p>
            <ul>
              {productoDetalle.ingredientes.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
            <button onClick={() => setVerDetalle(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pedidos;
