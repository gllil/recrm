import { Col, Container, Row, Tab, Tabs, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ContactTable from "../components/ContactTable";
import { useContext, useState } from "react";
import { StoreContext } from "../store/StoreProvider";

const Dashboard = () => {
  const navigate = useNavigate();
  const { tabCount } = useContext(StoreContext);
  const [status, setStatus] = useState("Pending");

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setStatus(value);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Dashboard</h1>
        </Col>
      </Row>
      <Row>
        <Col className="py-5">
          <Button onClick={() => navigate("/add-contact")}>
            Add New Contact
          </Button>
        </Col>
      </Row>

      <Row>
        <Col className="d-md-none">
          <Form.Group>
            <Form.Select onChange={handleStatusChange}>
              <option value="Pending">{`Pending (${tabCount.pending})`}</option>
              <option value="Showing Homes">{`Showing Homes (${tabCount.showingHomes})`}</option>
              <option value="Writing Offers">{`Writing Offers (${tabCount.writingOffers})`}</option>
              <option value="Under Contract">{`Under Contract (${tabCount.underContract})`}</option>
              <option value="Closed">{`Closed (${tabCount.closed})`}</option>
              <option value="Lost">{`Lost (${tabCount.lost})`}</option>
            </Form.Select>
          </Form.Group>
          <ContactTable condition={status} />
        </Col>
        <Col className="d-none d-md-block">
          <Tabs defaultActiveKey="pending" fill>
            <Tab eventKey="pending" title={`Pending (${tabCount.pending})`}>
              <ContactTable condition={"Pending"} />
            </Tab>
            <Tab
              eventKey="showingHomes"
              title={`Showing Homes (${tabCount.showingHomes})`}
            >
              <ContactTable condition={"Showing Homes"} />
            </Tab>
            <Tab
              eventKey="writingOffers"
              title={`Writing Offers (${tabCount.writingOffers})`}
            >
              <ContactTable condition={"Writing Offers"} />
            </Tab>
            <Tab
              eventKey="underContract"
              title={`Under Contract (${tabCount.underContract})`}
            >
              <ContactTable condition={"Under Contract"} />
            </Tab>
            <Tab eventKey="closed" title={`Closed (${tabCount.closed})`}>
              <ContactTable condition={"Closed"} />
            </Tab>
            <Tab eventKey="lost" title={`Lost (${tabCount.lost})`}>
              <ContactTable condition={"Lost"} />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};
export default Dashboard;
