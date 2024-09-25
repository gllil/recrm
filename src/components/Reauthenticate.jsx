/* eslint-disable react/prop-types */
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Alert, Form as BootstrapForm, Stack, Button } from "react-bootstrap";
import { reAuth } from "../firebase/auth";

import useReactQuery from "../hooks/useReactQuery";
const Reauthenticate = ({ setAuth }) => {
  const { user } = useReactQuery();
  const [errorMessage, setErrorMessage] = useState("");

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
  });
  return (
    <Formik
      initialValues={{
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={({ password }, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        reAuth(user, password)
          .then(() => {
            setSubmitting(false);
            setAuth(true);
            resetForm();
          })
          .catch((err) => {
            setErrorMessage(`Error: ${err.message}`);
            setSubmitting(false);
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
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Stack gap={3}>
            <BootstrapForm.Group controlId="formPassword">
              <BootstrapForm.Label>Enter Current Password</BootstrapForm.Label>
              <BootstrapForm.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.password && !!errors.password}
              />
              <BootstrapForm.Control.Feedback type="invalid">
                {errors.password}
              </BootstrapForm.Control.Feedback>
            </BootstrapForm.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              // className="mt-3"
            >
              {isSubmitting ? "Authenticating..." : "Submit"}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
export default Reauthenticate;
