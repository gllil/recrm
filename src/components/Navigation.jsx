// import { Accordion, Col, Container, ListGroup, Row } from "react-bootstrap";
// import { logOut } from "../firebase/auth";
// import { useQueryClient } from "@tanstack/react-query";
// import { NavLink } from "react-router-dom";
// import useReactQuery from "../hooks/useReactQuery";

// // eslint-disable-next-line react/prop-types
// const Navigation = ({ children }) => {
//   const { user } = useReactQuery();
//   const queryClient = useQueryClient();
//   const handleSignOut = () => {
//     logOut();
//     queryClient.removeQueries();
//   };

//   return (
//     <Container fluid>
//       <Row>
//         <Col xs={2} className="p-0 vh-100 border-end">
//           <ListGroup as="ul" variant="flush">
//             <ListGroup.Item>
//               <h2>Real Estate CRM</h2>
//             </ListGroup.Item>
//             <ListGroup.Item>
//               <NavLink
//                 className="link-secondary link-underline link-underline-opacity-0"
//                 to="/dashboard"
//               >
//                 Dashboard
//               </NavLink>
//             </ListGroup.Item>
//             <ListGroup.Item>
//               <NavLink
//                 className="link-secondary link-underline link-underline-opacity-0"
//                 to="/contacts"
//               >
//                 Contacts
//               </NavLink>
//             </ListGroup.Item>

//             <ListGroup.Item className="text-start container-fluid p-0 m-0">
//               <Accordion flush>
//                 <Accordion.Item eventKey="0" className="m-0 p-0">
//                   <Accordion.Header className="text-start text-secondary m-0 p-0">
//                     Settings
//                   </Accordion.Header>
//                   <Accordion.Body className="p-0 m-0">
//                     <ListGroup variant="flush">
//                       <ListGroup.Item className="text-center">
//                         <NavLink
//                           className="link-secondary link-underline link-underline-opacity-0"
//                           to="/edit-profile"
//                         >
//                           Profile
//                         </NavLink>
//                       </ListGroup.Item>
//                       {user?.isAdmin && (
//                         <ListGroup.Item className="text-center">
//                           <NavLink
//                             className="link-secondary link-underline link-underline-opacity-0"
//                             to="/edit-account"
//                           >
//                             Account
//                           </NavLink>
//                         </ListGroup.Item>
//                       )}
//                       {user?.isAdmin && (
//                         <ListGroup.Item className="text-center">
//                           <NavLink
//                             className="link-secondary link-underline link-underline-opacity-0"
//                             to="/manage-users"
//                           >
//                             Users
//                           </NavLink>
//                         </ListGroup.Item>
//                       )}
//                     </ListGroup>
//                   </Accordion.Body>
//                 </Accordion.Item>
//               </Accordion>
//             </ListGroup.Item>

//             <ListGroup.Item
//               as="button"
//               onClick={handleSignOut}
//               className="text-start"
//             >
//               Logout
//             </ListGroup.Item>
//           </ListGroup>
//         </Col>
//         <Col xs={10} className="p-5">
//           {children}
//         </Col>
//       </Row>
//     </Container>
//   );
// };
// export default Navigation;

import {
  Accordion,
  Col,
  Container,
  ListGroup,
  Row,
  Offcanvas,
  NavbarToggle,
} from "react-bootstrap";
import { useState } from "react";
import { logOut } from "../firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import useReactQuery from "../hooks/useReactQuery";

// eslint-disable-next-line react/prop-types
const Navigation = ({ children }) => {
  const { user } = useReactQuery();
  const queryClient = useQueryClient();
  const [show, setShow] = useState(false);

  const handleSignOut = () => {
    logOut();
    queryClient.removeQueries();
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Button to toggle Offcanvas for mobile */}
      <NavbarToggle
        variant="primary"
        className="d-md-none text-start p-3 position-fixed" // Only visible on mobile
        onClick={handleShow}
      >
        <i className="fa-solid fa-bars fa-xl"></i>
      </NavbarToggle>

      {/* Offcanvas for mobile */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        className="d-md-none"
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Real Estate CRM</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup as="ul" variant="flush">
            <ListGroup.Item>
              <NavLink to="/dashboard" onClick={handleClose}>
                Dashboard
              </NavLink>
            </ListGroup.Item>
            <ListGroup.Item>
              <NavLink to="/contacts" onClick={handleClose}>
                Contacts
              </NavLink>
            </ListGroup.Item>

            <ListGroup.Item>
              <Accordion flush className="custom-accordion">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Settings</Accordion.Header>
                  <Accordion.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <NavLink onClick={handleClose} to="/edit-profile">
                          Profile
                        </NavLink>
                      </ListGroup.Item>
                      {user?.isAdmin && (
                        <>
                          <ListGroup.Item>
                            <NavLink onClick={handleClose} to="/edit-account">
                              Account
                            </NavLink>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <NavLink onClick={handleClose} to="/manage-users">
                              Users
                            </NavLink>
                          </ListGroup.Item>
                        </>
                      )}
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </ListGroup.Item>
            <ListGroup.Item as="button" onClick={handleSignOut}>
              Logout
            </ListGroup.Item>
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Permanent sidebar for desktop */}
      <Container fluid>
        <Row className="pb-5">
          <Col xs={2} className="p-0 vh-100 border-end d-none d-md-block">
            <ListGroup as="ul" variant="flush">
              <ListGroup.Item>
                <h2>Real Estate CRM</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </ListGroup.Item>
              <ListGroup.Item>
                <NavLink to="/contacts">Contacts</NavLink>
              </ListGroup.Item>

              <ListGroup.Item>
                <Accordion flush className="custom-accordion">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Settings</Accordion.Header>
                    <Accordion.Body>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <NavLink to="/edit-profile">Profile</NavLink>
                        </ListGroup.Item>
                        {user?.isAdmin && (
                          <>
                            <ListGroup.Item>
                              <NavLink to="/edit-account">Account</NavLink>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <NavLink to="/manage-users">Users</NavLink>
                            </ListGroup.Item>
                          </>
                        )}
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </ListGroup.Item>
              <ListGroup.Item as="button" onClick={handleSignOut}>
                Logout
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col xs={12} md={10} className="p-5">
            {children}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Navigation;
