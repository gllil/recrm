import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Navigation from "./components/Navigation";
import { Container, Row } from "react-bootstrap";
import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./auth/AuthProvider";
// import { QueryClient, QueryClientProvider } from "react-query";
import AddContact from "./pages/AddContact";
import EditContact from "./pages/EditContact";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { StoreProvider } from "./store/StoreProvider";
import EditUser from "./pages/EditUser";
import Contacts from "./pages/Contacts";
import EditAccount from "./pages/EditAccount";
import EditProfile from "./pages/EditProfile";
import ManageUsers from "./pages/ManageUsers";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StoreProvider>
            <Container fluid>
              <Row>
                {/* <Col sm={2}>
                <Navigation />
              </Col>
              <Col sm={10}> */}
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route element={<ProtectedRoute />}>
                    <Route element={<Dashboard />} path="/dashboard" />
                    <Route element={<AddContact />} path="/add-contact" />
                    <Route
                      element={<EditContact />}
                      path="/edit-contact/:contactId"
                    />
                    <Route element={<EditProfile />} path="/edit-profile" />
                    <Route element={<Contacts />} path="/contacts" />
                    <Route element={<EditAccount />} path="/edit-account" />
                    <Route element={<EditUser />} path="/edit-user/:userId" />
                    <Route element={<ManageUsers />} path="/manage-users" />
                  </Route>
                </Routes>
                {/* </Col> */}
              </Row>
            </Container>
          </StoreProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
