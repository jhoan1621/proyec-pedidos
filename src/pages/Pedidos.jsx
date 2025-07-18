/* Pedidos.jsx */

import { useState } from "react";
import { menu } from "../data/menu";
import Modal from "../components/Modal";

function Pedidos() {
  const [carrito, setCarrito] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [detallePedido, setDetallePedido] = useState(null);
  const [verDetalle, setVerDetalle] = useState(false);
  const [productoDetalle, setProductoDetalle] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  const limpiarFiltros = () => {
    setBusqueda("");
    setPrecioMin("");
    setPrecioMax("");
  };

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
    setCarrito([]);
  };

  const productosFiltrados = menu.filter((item) => {
    const nombreCoincide = item.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const precioValido =
      (!precioMin || item.precio >= parseFloat(precioMin)) &&
      (!precioMax || item.precio <= parseFloat(precioMax));
    return nombreCoincide && precioValido;
  });

  return (
    <div className="pedidos-container">
      <h2>🍔 Menú de Hamburguesas</h2>

      {/* 🔍 Filtros */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar hamburguesa..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="busqueda-input"
        />
        <input
          type="number"
          placeholder="Precio mínimo"
          value={precioMin}
          onChange={(e) => setPrecioMin(e.target.value)}
          className="precio-input"
        />
        <input
          type="number"
          placeholder="Precio máximo"
          value={precioMax}
          onChange={(e) => setPrecioMax(e.target.value)}
          className="precio-input"
        />
        <button onClick={limpiarFiltros} className="limpiar-btn">
          Limpiar filtros
        </button>
      </div>

      {/* Productos */}
      <div className="productos">
        {productosFiltrados.length === 0 ? (
          <p>No hay hamburguesas que coincidan con el filtro.</p>
        ) : (
          productosFiltrados.map((item) => (
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
          ))
        )}
      </div>

      {/* Carrito */}
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
                  <div className="cantidad">
                    <button onClick={() => reducirCantidad(item.id)}>-</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => agregarAlCarrito(item)}>+</button>
                  </div>
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

      {/* Modal de pedido */}
      {mostrarModal && detallePedido && (
        <Modal
          titulo="✅ Pedido Finalizado"
          onClose={() => setMostrarModal(false)}
        >
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
        </Modal>
      )}

      {/* Modal de detalle */}
      {verDetalle && productoDetalle && (
        <Modal
          titulo={productoDetalle.nombre}
          onClose={() => setVerDetalle(false)}
        >
          <p>
            <strong>Ingredientes:</strong>
          </p>
          <ul>
            {productoDetalle.ingredientes.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  );
}

export default Pedidos;
