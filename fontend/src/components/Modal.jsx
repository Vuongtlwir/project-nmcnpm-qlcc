export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{title}</h2>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        <div className="modal-footer">
          <button
            className="modal-cancel-btn"
            onClick={onClose}
          >
            {cancelText}
          </button>

          <button
            className="modal-confirm-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Đang xử lý..."
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}