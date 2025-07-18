/* Modal.jsx */
function Modal({ titulo, children, onClose }) {
  return (
    <div className="modal">
      <div className="modal-contenido">
        <h3>{titulo}</h3>
        {children}
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

export default Modal;
