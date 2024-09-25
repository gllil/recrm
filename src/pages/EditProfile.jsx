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

import { newUser } from "../firebase/fs";

import CrmModal from "../components/CrmModal";
import UpdatePassword from "../components/UpdatePassword";
import Reauthenticate from "../components/Reauthenticate";
import useReactQuery from "../hooks/useReactQuery";
import { useQueryClient } from "@tanstack/react-query";

const EditProfile = () => {
  const { user } = useReactQuery();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [currentPasswordAuth, setCurrentPasswordAuth] = useState(false);
  const queryClient = useQueryClient();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    companyName: Yup.string().required("Company Name is required"),
  });

  return (
    <Container className="vh-100">
      <Row className="align-middle py-5 my-auto">
        <Col sm={12} md={6} className="mx-auto">
          <Row className="py-3">
            <Col>
              <h1>Edit Profile</h1>
            </Col>
          </Row>
          {user && (
            <Formik
              initialValues={user}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                const { firstName, lastName, email } = values;
                setSubmitting(true);

                // Handle login logic here

                newUser(
                  {
                    firstName,
                    lastName,
                    email,
                  },
                  user?.id
                )
                  .then(() => {
                    setSubmitting(false);

                    queryClient.invalidateQueries();
                    setSuccessMessage("Profile has been updated successfully");
                    setTimeout(() => {
                      setSuccessMessage("");
                    }, 2000);
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
                        disabled
                      />
                      <BootstrapForm.Control.Feedback type="invalid">
                        {errors.email}
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
      <Row className="align-middle py-5 my-auto">
        <Col sm={12} md={6} className="mx-auto">
          <h3>Edit Password</h3>
          <Button onClick={() => setOpen(true)}>Update Password</Button>
          <CrmModal
            setShow={setOpen}
            heading={"Update Password"}
            show={open}
            body={
              currentPasswordAuth ? (
                <UpdatePassword setShow={setOpen} />
              ) : (
                <Reauthenticate setAuth={setCurrentPasswordAuth} />
              )
            }
            hideButton={true}
          />
        </Col>
      </Row>
    </Container>
  );
};
export default EditProfile;
