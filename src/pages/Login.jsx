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
import { useContext, useState } from "react";
import { signIn, passwordReset } from "../firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import CrmModal from "../components/CrmModal";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordValue, setForgotPasswordValue] = useState(null);
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState(null);
  const [modalError, setModalError] = useState("");

  const { userLoggedIn } = useContext(AuthContext);

  const handleForgetPassword = (e) => {
    const { value } = e.target;
    setForgotPasswordValue(value);
  };

  const handleSubmitForgotPassword = (email) => {
    if (
      email.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
      )
    ) {
      passwordReset(email)
        .then(() => {
          setModalMessage("Password Reset Email Sent");
          setTimeout(() => {
            setModalMessage(null);
            setShowForgotPassword(false);
          }, 2000);
        })
        .catch((error) => {
          setModalError(error.message);
          setTimeout(() => {
            setModalError(null);
            setShowForgotPassword(false);
          }, 2000);
        });
    } else {
      setModalError("Not an email");
      setTimeout(() => {
        setModalError(null);
      }, 2000);
    }
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
  });
  return (
    <Container className="vh-100">
      {userLoggedIn && <Navigate to={"/dashboard"} replace />}
      <Row className="align-middle py-5 my-auto">
        <Col sm={12} md={6} className="mx-auto">
          <Row className="py-3">
            <Col>
              <h1>Login</h1>
            </Col>
          </Row>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              // Handle login logic here

              signIn(values.email, values.password)
                .then(() => {
                  // Signed in
                  // ...
                  setSubmitting(false);
                  resetForm();
                  navigate("/dashboard");
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
              <Form noValidate onSubmit={handleSubmit}>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Stack gap={3}>
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

                  <BootstrapForm.Group controlId="formPassword">
                    <BootstrapForm.Label>Password</BootstrapForm.Label>
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
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <a href="/register">New User? Register Here</a>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Button variant="link" onClick={() => setShowForgotPassword(true)}>
            Forgot Password
          </Button>
        </Col>
      </Row>
      <CrmModal
        heading={"Forgot Password"}
        body={
          <BootstrapForm>
            <BootstrapForm.Group>
              <BootstrapForm.Label>Enter your Email</BootstrapForm.Label>
              <BootstrapForm.Control
                onChange={handleForgetPassword}
                name="email"
                type="email"
                required
              />
            </BootstrapForm.Group>
          </BootstrapForm>
        }
        error={modalError}
        message={modalMessage}
        show={showForgotPassword}
        setShow={setShowForgotPassword}
        buttonLabel={"Submit"}
        onClick={() => handleSubmitForgotPassword(forgotPasswordValue)}
      />
    </Container>
  );
};
export default Login;
