import { useEffect } from 'react';

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal__panel">
        <div className="modal__header">
          <h2>{title}</h2>
          <button className="icon-button" aria-label="Fechar" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
