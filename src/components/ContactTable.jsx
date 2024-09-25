/* eslint-disable react/prop-types */

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

const ContactTable = ({ condition }) => {
  const { contacts, user, users } = useReactQuery();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value.substr(0, 20));
  };

  const getUserName = (userId, userList) => {
    const filteredUser = userList?.filter((user) => user.id === userId);

    return `${filteredUser[0]?.firstName} ${filteredUser[0]?.lastName}`;
  };

  const contactsByStatus = contacts?.filter((val) => val.status === condition);
  const searchFilter = contactsByStatus?.filter(
    (cont) =>
      cont.firstName.toLowerCase().indexOf(search?.toLowerCase()) !== -1 ||
      cont.lastName.toLowerCase().indexOf(search?.toLowerCase()) !== -1 ||
      cont.propertyAddress.toLowerCase().indexOf(search?.toLowerCase()) !== -1
  );

  return (
    <Container>
      <Row>
        <Col>
          <FloatingLabel label="Search for Contact">
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
        <Col>
          <Stack gap={3} className="d-md-none">
            {searchFilter?.map((contact, i) => (
              <Card key={i} className="p-4">
                <Card.Title>
                  <a href={`/edit-contact/${contact.id}`}>
                    {contact.firstName + " " + contact.lastName}
                  </a>
                </Card.Title>
                <Card.Subtitle>{contact.transactionType}</Card.Subtitle>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>{contact.propertyAddress}</ListGroup.Item>
                    <ListGroup.Item>{contact.phone}</ListGroup.Item>
                    <ListGroup.Item>{contact.email}</ListGroup.Item>
                    <ListGroup.Item>{contact.propertyType}</ListGroup.Item>
                    <ListGroup.Item>{contact.status}</ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            ))}
          </Stack>
          <Table className="d-none d-md-block">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Property</th>
                <th>Property Type</th>
                <th>Transaction Type</th>
                <th>Status</th>
                {user?.isAdmin && <th>Team Member</th>}
              </tr>
            </thead>
            <tbody>
              {searchFilter?.map((contact, i) => (
                <tr key={i}>
                  <td>
                    <a href={`/edit-contact/${contact.id}`}>
                      {contact.firstName + " " + contact.lastName}
                    </a>
                  </td>
                  <td>{contact.phone}</td>
                  <td>{contact.email}</td>
                  <td>{contact.propertyAddress}</td>
                  <td>{contact.propertyType}</td>
                  <td>{contact.transactionType}</td>
                  <td>{contact.status}</td>
                  {user?.isAdmin && (
                    <td>{getUserName(contact?.user, users)}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};
export default ContactTable;
