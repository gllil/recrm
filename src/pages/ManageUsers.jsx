import { Col, Container, Row } from "react-bootstrap";
import UserTable from "../components/UserTable";

const ManageUsers = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Manage Users</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <UserTable />
        </Col>
      </Row>
    </Container>
  );
};
export default ManageUsers;
