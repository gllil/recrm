/* eslint-disable react/prop-types */
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Alert, Form as BootstrapForm, Stack, Button } from "react-bootstrap";
import { passwordChange } from "../firebase/auth";

const UpdatePassword = ({ setShow, setAuth }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validationSchema = Yup.object({
    // email: Yup.string().email("Invalid email address")
    // .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });
  return (
    <Formik
      initialValues={{
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={({ password }, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        passwordChange(password)
          .then(() => {
            setSubmitting(false);
            resetForm();
            setSuccessMessage("Password has been updated");
            setTimeout(() => {
              setShow(false);
              setAuth(false);
            }, 1000);
          })
          .catch((err) => {
            setErrorMessage(`Error: ${err.message}`);
            setSubmitting(false);
            resetForm();
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
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Stack gap={3}>
            <BootstrapForm.Group controlId="formPassword">
              <BootstrapForm.Label>New Password</BootstrapForm.Label>
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

            <BootstrapForm.Group controlId="formConfirmPassword">
              <BootstrapForm.Label>Confirm Password</BootstrapForm.Label>
              <BootstrapForm.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.confirmPassword && !!errors.confirmPassword}
              />
              <BootstrapForm.Control.Feedback type="invalid">
                {errors.confirmPassword}
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
  );
};
export default UpdatePassword;
