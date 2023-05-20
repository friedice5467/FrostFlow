import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const LoadingModal = () => {
    return (
        <Modal show backdrop="static" keyboard={false} centered>
            <Modal.Body className="d-flex flex-column align-items-center justify-content-center">
                <Spinner animation="border" variant="primary" />
                <h5 className="mt-3">Loading...</h5>
            </Modal.Body>
        </Modal>
    );
};

export default LoadingModal;
