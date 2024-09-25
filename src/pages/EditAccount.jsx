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

import { updateAccount } from "../firebase/fs";

import { useQueryClient } from "@tanstack/react-query";
import useReactQuery from "../hooks/useReactQuery";
import { formatPhoneNumber } from "../utility/utility";

const EditAccount = () => {
  const { account } = useReactQuery();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const queryClient = useQueryClient();

  // Validation schema using Yup
  const validationSchema = Yup.object({
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
  });

  return (
    <Container className="vh-100">
      <Row className="align-middle py-5 my-auto">
        <Col sm={12} md={6} className="mx-auto">
          <Row className="py-3">
            <Col>
              <h1>Edit Account</h1>
            </Col>
          </Row>

          {account ? (
            <Formik
              initialValues={account}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                updateAccount(values)
                  .then(() => {
                    setSubmitting(false);
                    setSuccessMessage("Account Updated Successfully");
                    queryClient.invalidateQueries({ queryKey: ["accounts"] });
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
                setFieldValue,
              }) => (
                <Form onSubmit={handleSubmit}>
                  {errorMessage && (
                    <Alert variant="danger">{errorMessage}</Alert>
                  )}
                  {successMessage && (
                    <Alert variant="success">{successMessage}</Alert>
                  )}
                  <Stack gap={3}>
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
                          />
                          <BootstrapForm.Control.Feedback type="invalid">
                            {errors.website}
                          </BootstrapForm.Control.Feedback>
                        </BootstrapForm.Group>
                      </Col>
                    </Row>

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
          ) : (
            "Loading..."
          )}
        </Col>
      </Row>
    </Container>
  );
};
export default EditAccount;
