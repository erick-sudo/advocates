import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { ScaleButton } from "./ScaleButton";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";

export function ModalLink({
  disableAnchor = false,
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
  const { darkMode } = useContext(AuthContext);

  const handleClose = () => {
    hostResourceCleaner();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const styles = {
    backgroundColor: darkMode ? "" : "rgba(255, 255, 255, .8)",
    border: "none",
  };

  useEffect(() => {
    Array.from(document.querySelectorAll(".modal-special")).forEach(
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
        disabled={disableAnchor}
        type="button"
        onClick={() => {
          handleShow();
          onInit();
        }}
        className={`disabled:cursor-not-allowed ${anchorClassName}`}
      >
        {icon}
        <span>{anchorText}</span>
      </button>
      <Modal
        fullscreen={fullscreen}
        centered
        data-bs-theme={darkMode ? "dark" : "light"}
        contentClassName={darkMode ? "bg-dark" : "bg-light"}
        style={styles}
        size="lg"
        backdrop="static"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header
          className={`${darkMode ? "text-bg-dark" : "text-bg-light"}`}
          style={{ border: "none" }}
        >
          <span className={`dancing px-4`}>{description}</span>
          <button
            className={`rounded-full w-8 h-8 border-none shadow-md shadow-black hover:bg-amber-800 duration-300 ${
              darkMode
                ? "text-white shadow-md shadow-black"
                : "text-stone-950 hover:text-white"
            }`}
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
            <div
              className={`px-4 relative ${
                darkMode ? "text-bg-dark" : "text-bg-light"
              } text-sm`}
            >
              {modalContent}
            </div>
            <div className="grid grid-cols-2 gap-4 px-4 py-4 border-gray-800/50">
              <ScaleButton
                as="button"
                onClick={handleClose}
                text={cancelText}
                className={`flex-grow hover:scale-100 hover:-translate-y-2 py-1 hover:bg-amber-800 hover:text-white duration-300 ${
                  darkMode
                    ? "shadow-md shadow-gray-500/50 text-white"
                    : "shadow-md shadow-gray-500/50"
                } ${cancelButtonClassName}`}
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
                  className: `flex-grow hover:scale-100 hover:-translate-y-2 py-1 hover:bg-amber-800 hover:text-white duration-300 ${
                    darkMode
                      ? "shadow-md shadow-gray-500/50 text-white"
                      : "shadow-md shadow-gray-500/50"
                  } ${submitButtonClassName} `,
                }}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
