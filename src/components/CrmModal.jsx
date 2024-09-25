/* eslint-disable react/prop-types */
import { Modal, Button, Alert, Container, Row } from "react-bootstrap";

const CrmModal = ({
  heading,
  body,
  buttonLabel,
  show,
  setShow,
  onClick,
  message,
  error,
  hideButton,
}) => {
  const handleClose = () => setShow(false);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Container>
          <Row>
            {(message || error) && (
              <Alert variant={message ? "sucess" : "warning"}>
                {message}
                {error}
              </Alert>
            )}
          </Row>
          <Row>
            <Modal.Title>{heading}</Modal.Title>
          </Row>
        </Container>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onClick} hidden={hideButton}>
          {buttonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default CrmModal;
