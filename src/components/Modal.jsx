export default function Modal({
  title,
  children,
  onClose
}) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHead}>
          <span style={styles.modalTitle}>
            {title}
          </span>

          <button
            onClick={onClose}
            style={styles.closeBtn}
          >
            ✕
          </button>
        </div>

        <div style={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  )
}