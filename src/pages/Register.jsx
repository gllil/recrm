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
import { createUser } from "../firebase/auth";
import {
  checkForDuplicateAccounts,
  newAccount,
  newUser,
  useAccounts,
} from "../firebase/fs";
import { useNavigate } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";
import { formatPhoneNumber } from "../utility/utility";
const Register = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [existingCompany, setExistingCompany] = useState(null);
  const [showBrokerageSelect, setShowBrokerageSelect] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const navigate = useNavigate();

  const handleExistingTeamChange = (e) => {
    const value = e.target?.value;

    if (value === "true") {
      setShowBrokerageSelect(true);
    } else {
      setShowBrokerageSelect(false);
      setShowForm(true);
      setExistingCompany(null);
    }
  };

  const { data: accounts } = useAccounts();

  const companyOptions = accounts?.filter(
    (account) =>
      companySearch.length > 2 &&
      account.companyName.toLowerCase().indexOf(companySearch.toLowerCase()) !==
        -1
  );
  const handleCompanySelect = () => {
    setExistingCompany(companyOptions[0]);
    if (companyOptions.length) {
      setShowForm(true);
    } else {
      setShowForm(false);
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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),

    companyName: Yup.string().required("Company Name is required"),
    officeStreetAddress: Yup.string().required(
      "Company Office Address is required"
    ),
    officeSuite: Yup.string(),
    officeCity: Yup.string().required("Office City is required"),
    officeState: Yup.string().required("Office State is required"),
    officeZipCode: Yup.string().required("Office Zip Code is required"),
    officePhone: Yup.string().matches(
      /^\(\d{3}\) \d{3}-\d{4}$/,
      "Phone number is not valid"
    ),
    website: Yup.string(),
    isAdmin: Yup.boolean(),
  });

  return (
    <Container className="vh-100">
      <Row className="align-middle py-5 my-auto">
        <Col sm={12} md={6} className="mx-auto">
          <Row className="py-3">
            <Col>
              <h1>Register</h1>
            </Col>
          </Row>
          <BootstrapForm.Group>
            <BootstrapForm.Label>
              Are you joining an existing team?
            </BootstrapForm.Label>
            <BootstrapForm.Select onChange={handleExistingTeamChange}>
              <option value={null}>Choose One</option>
              <option value={true}>Yes</option>
              <option value={false}>No, Create a new team</option>
            </BootstrapForm.Select>
          </BootstrapForm.Group>
          {showBrokerageSelect && (
            <BootstrapForm.Group>
              <BootstrapForm.Label>
                Select the Brokerage you are with?
              </BootstrapForm.Label>
              <Typeahead
                id="companyName"
                onChange={handleCompanySelect}
                labelKey={(option) =>
                  `${option.companyName} - ${option.officeCity}, ${option.officeState}`
                }
                onInputChange={(text) => setCompanySearch(text)}
                options={companyOptions}
                placeholder="Type in name of Brokerage"
              />
              {/* <BootstrapForm.Select onChange={handleCompanySelect}>
                <option>Select a Brokerage</option>
                {accounts?.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.companyName}
                  </option>
                ))}
              </BootstrapForm.Select> */}
            </BootstrapForm.Group>
          )}
          {showForm && (
            <Formik
              initialValues={
                existingCompany
                  ? {
                      email: "",
                      phone: "",
                      password: "",
                      confirmPassword: "",
                      firstName: "",
                      lastName: "",
                      companyName: existingCompany.companyName || "",
                      officeStreetAddress:
                        existingCompany.officeStreetAddress || "",
                      officeSuite: existingCompany.officeSuite || "",
                      officeCity: existingCompany.officeCity || "",
                      officeState: existingCompany.officeState || "",
                      officeZipCode: existingCompany.officeZipCode || "",
                      officePhone: existingCompany.officePhone || "",
                      website: existingCompany.website || "",
                      isAdmin: false,
                      id: existingCompany.id || "",
                    }
                  : {
                      isAdmin: true,
                      email: "",
                      phone: "",
                      password: "",
                      confirmPassword: "",
                      firstName: "",
                      lastName: "",
                      companyName: "",
                      officeStreetAddress: "",
                      officeSuite: "",
                      officeCity: "",
                      officeState: "",
                      officeZipCode: "",
                      officePhone: "",
                      website: "",
                    }
              }
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                const {
                  firstName,
                  lastName,
                  email,
                  companyName,
                  officeStreetAddress,
                  officeSuite,
                  officeCity,
                  officePhone,
                  officeState,
                  officeZipCode,
                  website,
                  isAdmin,
                } = values;
                setSubmitting(true);
                const accountDups = await checkForDuplicateAccounts(
                  companyName
                );
                if (!accountDups && !existingCompany) {
                  setErrorMessage(
                    "Team already exist. Please join existing team"
                  );
                  setSubmitting(false);
                  return;
                }

                // Handle login logic here
                createUser(values.email, values.password)
                  .then(async (userCred) => {
                    try {
                      const accountRef =
                        existingCompany ||
                        (await newAccount({
                          companyName,
                          officeStreetAddress,
                          officeSuite,
                          officeCity,
                          officeState,
                          officeZipCode,
                          officePhone,
                          website,
                        }));

                      newUser(
                        {
                          firstName,
                          lastName,
                          email,
                          companyName: companyName,
                          accountId: accountRef.id,
                          isAdmin,
                        },
                        userCred.user.uid
                      )
                        .then(() => {
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

                      // .catch((error) => {
                      //   const errorCode = error.code;
                      //   const errorMessage = error.message;
                      //   setSubmitting(false);
                      //   setErrorMessage(
                      //     `Error Code: ${errorCode}, Error Message: ${errorMessage}`
                      //   );
                      // });
                    } catch (e) {
                      setSubmitting(false);
                      setErrorMessage(
                        `Error Code: ${e.code}, Error Message: ${e.message}`
                      );
                    }
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
                setFieldValue,
              }) => (
                <Form onSubmit={handleSubmit}>
                  {errorMessage && (
                    <Alert variant="danger">{errorMessage}</Alert>
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
                    <BootstrapForm.Group controlId="formCompanyName">
                      <BootstrapForm.Label>Brokerage Name</BootstrapForm.Label>
                      <BootstrapForm.Control
                        type="text"
                        name="companyName"
                        placeholder="Enter your Brokerage Name"
                        value={values.companyName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.companyName && !!errors.companyName}
                        disabled={showBrokerageSelect}
                      />
                      <BootstrapForm.Control.Feedback type="invalid">
                        {errors.companyName}
                      </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>
                    <BootstrapForm.Group controlId="formOfficeStreetAddress">
                      <BootstrapForm.Label>
                        Office Street Address
                      </BootstrapForm.Label>
                      <BootstrapForm.Control
                        type="text"
                        name="officeStreetAddress"
                        placeholder="Enter your Office Street Address"
                        value={values.officeStreetAddress}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.officeStreetAddress &&
                          !!errors.officeStreetAddress
                        }
                        disabled={showBrokerageSelect}
                      />
                      <BootstrapForm.Control.Feedback type="invalid">
                        {errors.officeStreetAddress}
                      </BootstrapForm.Control.Feedback>
                    </BootstrapForm.Group>

                    <Row>
                      <Col sm={12} md={6}>
                        <BootstrapForm.Group controlId="formOfficeSuite">
                          <BootstrapForm.Label>
                            Office Suite
                          </BootstrapForm.Label>
                          <BootstrapForm.Control
                            type="text"
                            name="officeSuite"
                            placeholder="Enter your Office Suite"
                            value={values.officeSuite}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.officeSuite && !!errors.officeSuite
                            }
                            disabled={showBrokerageSelect}
                          />
                          <BootstrapForm.Control.Feedback type="invalid">
                            {errors.officeSuite}
                          </BootstrapForm.Control.Feedback>
                        </BootstrapForm.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <BootstrapForm.Group controlId="formOfficeCity">
                          <BootstrapForm.Label>Office City</BootstrapForm.Label>
                          <BootstrapForm.Control
                            type="text"
                            name="officeCity"
                            placeholder="Enter your City"
                            value={values.officeCity}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.officeCity && !!errors.officeCity
                            }
                            disabled={showBrokerageSelect}
                          />
                          <BootstrapForm.Control.Feedback type="invalid">
                            {errors.officeCity}
                          </BootstrapForm.Control.Feedback>
                        </BootstrapForm.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={6}>
                        <BootstrapForm.Group controlId="formOfficeState">
                          <BootstrapForm.Label>
                            Office State
                          </BootstrapForm.Label>
                          <BootstrapForm.Select
                            type="text"
                            name="officeState"
                            placeholder="Select the State"
                            value={values.officeState}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.officeState && !!errors.officeState
                            }
                            disabled={showBrokerageSelect}
                          >
                            <option>Select a State</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="DC">District Of Columbia</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                          </BootstrapForm.Select>
                          <BootstrapForm.Control.Feedback type="invalid">
                            {errors.officeState}
                          </BootstrapForm.Control.Feedback>
                        </BootstrapForm.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <BootstrapForm.Group controlId="formOfficeZipCode">
                          <BootstrapForm.Label>
                            Office Zip Code
                          </BootstrapForm.Label>
                          <BootstrapForm.Control
                            type="text"
                            name="officeZipCode"
                            placeholder="Enter your Office Zip Code"
                            value={values.officeZipCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.officeZipCode && !!errors.officeZipCode
                            }
                            disabled={showBrokerageSelect}
                          />
                          <BootstrapForm.Control.Feedback type="invalid">
                            {errors.officeZipCode}
                          </BootstrapForm.Control.Feedback>
                        </BootstrapForm.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={6}>
                        <BootstrapForm.Group controlId="formOfficePhone">
                          <BootstrapForm.Label>
                            Office Phone
                          </BootstrapForm.Label>
                          <BootstrapForm.Control
                            type="text"
                            name="officePhone"
                            placeholder="Enter your Office Phone"
                            value={values.officePhone}
                            onChange={(e) => {
                              const formatted = formatPhoneNumber(
                                e.target.value
                              );
                              setFieldValue("officePhone", formatted);
                            }}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.officePhone && !!errors.officePhone
                            }
                            disabled={showBrokerageSelect}
                          />
                          <BootstrapForm.Control.Feedback type="invalid">
                            {errors.officePhone}
                          </BootstrapForm.Control.Feedback>
                        </BootstrapForm.Group>
                      </Col>
                      <Col sm={12} md={6}>
                        <BootstrapForm.Group controlId="formWebsite">
                          <BootstrapForm.Label>Website</BootstrapForm.Label>
                          <BootstrapForm.Control
                            type="text"
                            name="website"
                            placeholder="Enter your Website"
                            value={values.website}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.website && !!errors.website}
                            disabled={showBrokerageSelect}
                          />
                          <BootstrapForm.Control.Feedback type="invalid">
                            {errors.website}
                          </BootstrapForm.Control.Feedback>
                        </BootstrapForm.Group>
                      </Col>
                    </Row>

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

                    <BootstrapForm.Group controlId="formConfirmPassword">
                      <BootstrapForm.Label>
                        Confirm Password
                      </BootstrapForm.Label>
                      <BootstrapForm.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.confirmPassword && !!errors.confirmPassword
                        }
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
                      {isSubmitting ? "Registering..." : "Submit"}
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          )}
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <a href="/">Already a User? Login</a>
        </Col>
      </Row>
    </Container>
  );
};
export default Register;
