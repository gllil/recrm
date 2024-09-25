import { useState } from "react";

import {
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  ListGroup,
  Row,
  Stack,
  Table,
} from "react-bootstrap";

import useReactQuery from "../hooks/useReactQuery";

const UserTable = () => {
  //   const { docs } = useFirestore("users");
  const { users } = useReactQuery();

  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value.substr(0, 20));
  };

  const searchFilter = users?.filter(
    (cont) =>
      cont.firstName?.toLowerCase().indexOf(search?.toLowerCase()) !== -1 ||
      cont.lastName?.toLowerCase().indexOf(search?.toLowerCase()) !== -1
  );

  return (
    <Container>
      <Row>
        <Col>
          <FloatingLabel label="Search for User">
            <Form.Control
              type="text"
              value={search}
              placeholder="Search for name or address"
              onChange={handleSearch}
              className="seachInputField my-2"
            />
          </FloatingLabel>
        </Col>
      </Row>
      <Row>
        <Col className="d-md-none">
          <Stack gap={3}>
            {searchFilter?.map((contact, i) => (
              <Card key={i} className="p-2">
                <Card.Title>
                  <a href={`/edit-user/${contact.id}`}>
                    {contact.firstName + " " + contact.lastName}
                  </a>
                </Card.Title>

                <Card.Body>
                  <ListGroup flush>
                    <ListGroup.Item>{contact.email}</ListGroup.Item>
                    <ListGroup.Item>{`Admin: ${
                      contact.isAdmin ? "Yes" : "No"
                    }`}</ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            ))}
          </Stack>
        </Col>
        <Col className="d-none d-md-block">
          <Table>
            <thead>
              <tr>
                <th>Name</th>

                <th>Email</th>
                <th>Administrator</th>
              </tr>
            </thead>
            <tbody>
              {users ? (
                searchFilter?.map((contact, i) => (
                  <tr key={i}>
                    <td>
                      <a href={`/edit-user/${contact.id}`}>
                        {contact.firstName + " " + contact.lastName}
                      </a>
                    </td>

                    <td>{contact.email}</td>
                    <td>{contact.isAdmin ? "Yes" : "No"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>Loading...</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};
export default UserTable;
