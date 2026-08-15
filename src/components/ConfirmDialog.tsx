interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Đồng ý',
  cancelLabel = 'Hủy',
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onCancel} role="presentation">
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="kicker">Xác nhận</p>
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message" className="lead">
          {message}
        </p>
        <div className="confirm-actions">
          <button className="btn ghost" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={danger ? 'btn copper' : 'btn primary'}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
