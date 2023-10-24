import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ScaleButton } from "./ScaleButton";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

export function ModalLink({
  icon = <FontAwesomeIcon icon={faAdd} />,
  onInit = () => {},
  hostResourceCleaner = () => {},
  fullscreen = false,
  submitButtonClassName = "",
  cancelButtonClassName = "",
  cancelText = "Close",
  anchorClassName = "flex gap-2 items-center box_shadow rounded px-4 py-2 text-amber-800 hover:text-black hover:bg-amber-700 hover:-translate-y-2 duration-200",
  modalContent,
  submitText,
  description,
  anchorText = "",
  disabled = false,
  submitData = () => {},
}) {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    hostResourceCleaner();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const styles = {
    backgroundColor: "rgba(255, 255, 255, .8)",
    border: "none",
  };

  useEffect(() => {
    Array.from(document.querySelectorAll(".modal-content")).forEach(
      (modalContent) => {
        Object.keys(styles).forEach((key) => {
          modalContent.style[key] = styles[key];
        });
      }
    );
  }, [show]);

  return (
    <div className="">
      <button
        type="button"
        onClick={() => {
          handleShow();
          onInit();
        }}
        className={`${anchorClassName}`}
      >
        {icon}
        <span>{anchorText}</span>
      </button>
      <Modal
        fullscreen={fullscreen}
        centered
        className="modal-special"
        style={styles}
        size="lg"
        backdrop="static"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header style={{ border: "none" }}>
          <span className="dancing px-4">{description}</span>
          <button
            className="h-8 w-8 rounded-full shadow-md shadow-black/50 hover:bg-amber-800 hover:text-white duration-300"
            style={{}} // Set the color to black
            onClick={handleClose}
          >
            <span>
              <FontAwesomeIcon icon={faClose} />
            </span>
          </button>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div>
            <div className="px-4 relative text-sm">{modalContent}</div>
            <div className="grid grid-cols-2 gap-4 px-4 py-4 border-gray-800/50">
              <ScaleButton
                as="button"
                onClick={handleClose}
                text={cancelText}
                className={`flex-grow hover:scale-100 hover:-translate-y-2 py-1 hover:bg-amber-800 hover:text-white duration-300 ${cancelButtonClassName}`}
              />
              <ScaleButton
                onClick={() => {
                  submitData();
                  handleClose();
                }}
                disabled={disabled}
                {...{
                  as: "submit",
                  text: submitText ? submitText : "Submit",
                  className: `flex-grow hover:scale-100 hover:-translate-y-2 py-1 hover:bg-amber-800 hover:text-white duration-300 ${submitButtonClassName}`,
                }}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
