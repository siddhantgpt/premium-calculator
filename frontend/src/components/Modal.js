import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Modal = (props) => {
    const {icon, message, closeable, onConfirm, onCancel} = props;

    const handleConfirm = () => {
        if (onConfirm) {
          onConfirm();
        }
    };
    
    const handleCancel = () => {
        if (onCancel) {
          onCancel();
        }
    };

    return (
        <><div className="modal-container"></div>
            <div className="modal">
                <FontAwesomeIcon icon={icon}
                    className="modal-icon"
                    size="10x"
                />
                <div className="modal-message">{message}</div>
                <div className="modal-button-container">
                    <button 
                        className="modal-button"
                        onClick={handleConfirm}
                    >
                        Ok
                    </button>
                    {closeable &&
                    <button 
                        className="modal-button"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>}
                </div>
            </div>
        </>
    );
};
export default Modal;
