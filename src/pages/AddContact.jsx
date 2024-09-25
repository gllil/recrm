import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Form as BootstrapForm,
  Button,
  Col,
  Container,
  ListGroup,
  Row,
} from "react-bootstrap";
import { useContext, useState } from "react";
import { newContact, useUser } from "../firebase/fs";
import { AuthContext } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { geoapify } from "../utility/addressAutocomplete/geoapify";
import { formatPhoneNumber } from "../utility/utility";

const AddContact = () => {
  const queryClient = useQueryClient();
  const [formMessage, setFormMessage] = useState("");
  const [addressResults, setAddressResults] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data: user } = useUser(currentUser?.uid);
  const navigate = useNavigate();

  console.log(addressResults);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    phone: Yup.string()
      .matches(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone number is not valid")
      .min(10, "Phone number must be at least 10 digits long"),
    email: Yup.string().email("Invalid email address"),
    propertyAddress: Yup.string(),
    propertyType: Yup.string().required("Property Type is required"),
    transactionType: Yup.string().required("Transaction Type is required"),
    notes: Yup.string().max(1000, "Notes cannot exceed 1000 characters"),
    status: Yup.string(),
  });

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h2>Add New Contact</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              phone: "",
              email: "",
              propertyAddress: "",
              propertyType: "",
              transactionType: "",
              notes: "",
              status: "Pending",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(true);

              newContact({ ...values, user: user.id, account: user.accountId })
                .then(() => {
                  setSubmitting(false);
                  queryClient.invalidateQueries();
                  resetForm();
                  navigate("/dashboard");
                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  setFormMessage(
                    `Error Code: ${errorCode}, Error Message: ${errorMessage}`
                  );
                });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                {formMessage && (
                  <div className="alert alert-success">{formMessage}</div>
                )}

                {/* First Name and Last Name */}
                <Row>
                  <Col md={6}>
                    <BootstrapForm.Group controlId="formFirstName">
                      <BootstrapForm.Label>First Name</BootstrapForm.Label>
                      <BootstrapForm.Control
                        type="text"
                        name="firstName"
                        placeholder="Contact first name"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.firstName && !!errors.firstName}
                      />
                      <BootstrapForm.Control.Feedback type="invalid">
                        {errors.firstName}
                      </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>
                  </Col>
                  <Col md={6}>
                    <BootstrapForm.Group controlId="formLastName">
                      <BootstrapForm.Label>Last Name</BootstrapForm.Label>
                      <BootstrapForm.Control
                        type="text"
                        name="lastName"
                        placeholder="Contact last name"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.lastName && !!errors.lastName}
                      />
                      <BootstrapForm.Control.Feedback type="invalid">
                        {errors.lastName}
                      </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>
                  </Col>
                </Row>

                {/* Phone and Email */}
                <Row>
                  <Col md={6}>
                    <BootstrapForm.Group controlId="formPhone">
                      <BootstrapForm.Label>Phone</BootstrapForm.Label>
                      <BootstrapForm.Control
                        type="text"
                        name="phone"
                        placeholder="Contact phone number"
                        value={values.phone}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          setFieldValue("phone", formatted);
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.phone && !!errors.phone}
                      />
                      <BootstrapForm.Control.Feedback type="invalid">
                        {errors.phone}
                      </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>
                  </Col>
                  <Col md={6}>
                    <BootstrapForm.Group controlId="formEmail">
                      <BootstrapForm.Label>Email</BootstrapForm.Label>
                      <BootstrapForm.Control
                        type="email"
                        name="email"
                        placeholder="Contact email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.email && !!errors.email}
                      />
                      <BootstrapForm.Control.Feedback type="invalid">
                        {errors.email}
                      </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>
                  </Col>
                </Row>

                {/* Property Address */}
                {/* <BootstrapForm.Group controlId="formPropertyAddress">
                  <BootstrapForm.Label>Property Address</BootstrapForm.Label>

                  <BootstrapForm.Control
                    type="text"
                    name="propertyAddress"
                    placeholder="Enter the property address"
                    // value={values.propertyAddress}
                    onChange={(e) => {
                      geoapify(e, setAddressResults)
                      setFieldValue("propertyAddress")
                    }}
                    onBlur={handleBlur}
                    isInvalid={
                      touched.propertyAddress && !!errors.propertyAddress
                    }
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    {errors.propertyAddress}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group> */}
                {/* Property Address */}
                <BootstrapForm.Group controlId="formPropertyAddress">
                  <BootstrapForm.Label>Property Address</BootstrapForm.Label>

                  <BootstrapForm.Control
                    type="text"
                    name="propertyAddress"
                    placeholder="Enter the property address"
                    value={values.propertyAddress}
                    onChange={(e) => {
                      geoapify(e, setAddressResults);
                      setFieldValue("propertyAddress", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInvalid={
                      touched.propertyAddress && !!errors.propertyAddress
                    }
                  />
                  {addressResults && (
                    <ListGroup>
                      {addressResults?.features?.map((address, i) => (
                        <ListGroup.Item
                          key={i}
                          action
                          onClick={() => {
                            setFieldValue(
                              "propertyAddress",
                              address.properties.formatted
                            );
                            setAddressResults(null);
                          }}
                        >
                          {address.properties.formatted}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}

                  <BootstrapForm.Control.Feedback type="invalid">
                    {errors.propertyAddress}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                {/* Property Type Dropdown */}
                <BootstrapForm.Group controlId="formPropertyType">
                  <BootstrapForm.Label>Property Type</BootstrapForm.Label>
                  <BootstrapForm.Control
                    as="select"
                    name="propertyType"
                    value={values.propertyType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.propertyType && !!errors.propertyType}
                  >
                    <option value="">Select Property Type</option>
                    <option value="Single Family">Single Family</option>
                    <option value="Townhome">Townhome</option>
                    <option value="Condo">Condo</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Land">Land</option>
                    <option value="Mobile Home">Mobile Home</option>
                    <option value="Manufactured Home">Manufactured Home</option>
                    <option value="Villa">Villa</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Multi-Family">Multi-Family</option>
                  </BootstrapForm.Control>
                  <BootstrapForm.Control.Feedback type="invalid">
                    {errors.propertyType}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                {/* Transaction Type Dropdown */}
                <BootstrapForm.Group controlId="formTransactionType">
                  <BootstrapForm.Label>Transaction Type</BootstrapForm.Label>
                  <BootstrapForm.Control
                    as="select"
                    name="transactionType"
                    value={values.transactionType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      touched.transactionType && !!errors.transactionType
                    }
                  >
                    <option value="">Select Transaction Type</option>
                    <option value="Purchase">Purchase</option>
                    <option value="Listing">Listing</option>
                    <option value="Lease">Lease</option>
                  </BootstrapForm.Control>
                  <BootstrapForm.Control.Feedback type="invalid">
                    {errors.transactionType}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                {/* Notes */}
                <BootstrapForm.Group controlId="formNotes">
                  <BootstrapForm.Label>Notes</BootstrapForm.Label>
                  <BootstrapForm.Control
                    as="textarea"
                    rows={4}
                    name="notes"
                    placeholder="Enter any notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.notes && !!errors.notes}
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    {errors.notes}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                {/* Status Dropdown */}
                <BootstrapForm.Group controlId="formStatus">
                  <BootstrapForm.Control
                    as="select"
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.status && !!errors.status}
                    hidden
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Showing Homes">Showing Homes</option>
                    <option value="Listed">Listed</option>
                    <option value="Writing Offers">Writing Offers</option>
                    <option value="Under Contract">Under Contract</option>
                    <option value="Closed">Closed</option>
                  </BootstrapForm.Control>
                  <BootstrapForm.Control.Feedback type="invalid">
                    {errors.status}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                <Button
                  className="my-2"
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default AddContact;
