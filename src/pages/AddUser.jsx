import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Form as BootstrapForm,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Stack,
} from "react-bootstrap";
import { useState } from "react";

import { newUser, useUser } from "../firebase/fs";
import { useParams } from "react-router-dom";

import BackButton from "../components/BackButton";

const AddUser = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  let { userId } = useParams();

  const { data: user, isLoading } = useUser(userId);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    companyName: Yup.string().required("Company Name is required"),
    isAdmin: Yup.boolean(),
  });

  return (
    <Container className="vh-100">
      <Row className="align-middle py-5 my-auto">
        <Row className="my-5">
          <Col>
            <BackButton path="/manage-users">Back</BackButton>
          </Col>
        </Row>
        <Col sm={12} md={6} className="mx-auto">
          <Row className="py-3">
            <Col>
              <h1>Edit User</h1>
            </Col>
          </Row>

          {isLoading ? (
            "Loading..."
          ) : (
            <Formik
              initialValues={user}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                const { firstName, lastName, email, isAdmin } = values;
                // Handle login logic here

                newUser({ firstName, lastName, email, isAdmin }, userId)
                  .then(() => {
                    setSubmitting(false);
                    setSuccessMessage("User has been updated successfully");
                    setTimeout(() => {
                      setSuccessMessage(null);
                    }, 1000);
                  })
                  .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setSubmitting(false);
                    setErrorMessage(
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
              }) => (
                <Form onSubmit={handleSubmit}>
                  {errorMessage && (
                    <Alert variant="danger">{errorMessage}</Alert>
                  )}
                  {successMessage && (
                    <Alert variant="success">{successMessage}</Alert>
                  )}
                  <Stack gap={3}>
                    <Row>
                      <Col sm={12} md={6}>
                        <BootstrapForm.Group controlId="formFirstName">
                          <BootstrapForm.Label>First Name</BootstrapForm.Label>
                          <BootstrapForm.Control
                            type="text"
                            name="firstName"
                            placeholder="Enter your First Name"
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
                      <Col sm={12} md={6}>
                        <BootstrapForm.Group controlId="formLastName">
                          <BootstrapForm.Label>Last Name</BootstrapForm.Label>
                          <BootstrapForm.Control
                            type="text"
                            name="lastName"
                            placeholder="Enter your Last Name"
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

                    <BootstrapForm.Group controlId="formEmail">
                      <BootstrapForm.Label>Email address</BootstrapForm.Label>
                      <BootstrapForm.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.email && !!errors.email}
                      />
                      <BootstrapForm.Control.Feedback type="invalid">
                        {errors.email}
                      </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>
                    <BootstrapForm.Group controlId="formIsAdmin">
                      <BootstrapForm.Check
                        name="isAdmin"
                        checked={values.isAdmin}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.isAdmin && !!errors.isAdmin}
                        label="Administrator"
                      />
                      <BootstrapForm.Control.Feedback type="invalid">
                        {errors.isAdmin}
                      </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                      // className="mt-3"
                    >
                      {isSubmitting ? "Updating..." : "Update"}
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          )}
        </Col>
      </Row>
    </Container>
  );
};
export default AddUser;
