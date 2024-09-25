import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Form as BootstrapForm,
  Button,
  Col,
  Container,
  ProgressBar,
  Row,
  Stack,
} from "react-bootstrap";
import { useState } from "react";
import { updateContact } from "../firebase/fs";

import { useNavigate, useParams } from "react-router-dom";
import { QueryClient, useMutation } from "@tanstack/react-query";
import useReactQuery from "../hooks/useReactQuery";
import BackButton from "../components/BackButton";
import { formatPhoneNumber } from "../utility/utility";

const EditContact = () => {
  let { contactId } = useParams();
  const { contact, users, user } = useReactQuery(contactId);
  const [formMessage, setFormMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationKey: ["contacts"],
    mutationFn: (contactData) => {
      updateContact(contactData)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err;
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  const handleProgress = (status) => {
    switch (status) {
      case "Pending":
        return 20;
      case "Showing Homes":
        return 40;
      case "Writing Offers":
        return 60;
      case "Under Contract":
        return 80;
      case "Closed":
        return 100;
      default:
        return 0;
    }
  };

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
    user: Yup.string().required("A user must be assigned"),
  });

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h2>View/Edit Contact</h2>
        </Col>
      </Row>

      {contact && (
        <Row>
          <Col>
            <Formik
              initialValues={{
                firstName: contact?.firstName,
                lastName: contact?.lastName,
                phone: contact?.phone,
                email: contact?.email,
                propertyAddress: contact?.propertyAddress,
                propertyType: contact?.propertyType,
                transactionType: contact?.transactionType,
                notes: contact?.notes,
                status: contact?.status,
                id: contactId,
                user: contact?.user,
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);
                mutation.mutateAsync(values, {
                  onSuccess: () => {
                    setSubmitting(false);
                    setFormMessage("Contact has been successfully updated");
                    setTimeout(() => {
                      navigate("/dashboard", { replace: true });
                    }, 2000);
                  },
                  onError: (error) => {
                    setSubmitting(false);
                    setErrorMessage(`Error Message: ${error.message}`);
                  },
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
                  {errorMessage && (
                    <div className="alert alert-danger">{errorMessage}</div>
                  )}
                  <Row>
                    <Col>
                      <ProgressBar
                        // animated={values?.status !== "Closed"}
                        striped={values.status !== "Closed"}
                        now={handleProgress(values.status)}
                        label={values.status}
                        variant="success"
                      />
                    </Col>
                  </Row>
                  {/* Status Dropdown */}
                  <BootstrapForm.Group controlId="formStatus">
                    <BootstrapForm.Label>Contact Status</BootstrapForm.Label>
                    <BootstrapForm.Control
                      as="select"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.status && !!errors.status}
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Showing Homes">Showing Homes</option>
                      <option value="Writing Offers">Writing Offers</option>
                      <option value="Under Contract">Under Contract</option>
                      <option value="Closed">Closed</option>
                    </BootstrapForm.Control>
                    <BootstrapForm.Control.Feedback type="invalid">
                      {errors.status}
                    </BootstrapForm.Control.Feedback>
                  </BootstrapForm.Group>
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
                  <BootstrapForm.Group controlId="formPropertyAddress">
                    <BootstrapForm.Label>Property Address</BootstrapForm.Label>

                    <BootstrapForm.Control
                      type="text"
                      name="propertyAddress"
                      placeholder="Enter the property address"
                      value={values.propertyAddress}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        touched.propertyAddress && !!errors.propertyAddress
                      }
                    />
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
                      <option value="Manufactured Home">
                        Manufactured Home
                      </option>
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
                  {user.isAdmin && (
                    <BootstrapForm.Group controlId="formAssignedUser">
                      <BootstrapForm.Label>Assigned User</BootstrapForm.Label>
                      <BootstrapForm.Select
                        value={values.user}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="user"
                        isInvalid={touched.user && !!errors.notes}
                      >
                        {users?.map((u) => (
                          <option
                            value={u.id}
                            key={u.id}
                          >{`${u.firstName} ${u.lastName}`}</option>
                        ))}
                      </BootstrapForm.Select>
                      <BootstrapForm.Control.Feedback type="invalid">
                        {errors.user}
                      </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>
                  )}
                  <Stack direction="horizontal" gap={3}>
                    <BackButton type="button" path={-1}>
                      Back
                    </BackButton>
                    <Button
                      className="my-2"
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Update"}
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default EditContact;
