import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = function Modal({ children, open }) {
  console.log(open);
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);
  return createPortal(
    <dialog className="modal" ref={dialog}>
      {open ? children : null}
    </dialog>,
    document.getElementById("modal")
  );
};

export default Modal;
