// // "use client"

// // import { useState } from "react"
// // import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
// // import { Link, useNavigate } from "react-router-dom"
// // import { useAuth } from "../contexts/AuthContext"
// // import { toast } from "react-toastify"

// // const Register = () => {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //     confirmPassword: "",
// //     role: "driver",
// //     phone: "",
// //   })
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState("")

// //   const { register } = useAuth()
// //   const navigate = useNavigate()

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     })
// //   }

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()
// //     setLoading(true)
// //     setError("")

// //     if (formData.password !== formData.confirmPassword) {
// //       setError("Passwords do not match")
// //       setLoading(false)
// //       return
// //     }

// //     const { confirmPassword, ...userData } = formData
// //     const result = await register(userData)

// //     if (result.success) {
// //       toast.success("Registration successful!")
// //       navigate("/dashboard")
// //     } else {
// //       setError(result.error)
// //     }

// //     setLoading(false)
// //   }

// //   return (
// //     <Container>
// //       <Row className="justify-content-center">
// //         <Col md={6} lg={5}>
// //           <Card className="mt-5">
// //             <Card.Body>
// //               <div className="text-center mb-4">
// //                 <i className="fas fa-truck fa-3x text-primary mb-3"></i>
// //                 <h2>Fleet Manager</h2>
// //                 <p className="text-muted">Create your account</p>
// //               </div>

// //               {error && <Alert variant="danger">{error}</Alert>}

// //               <Form onSubmit={handleSubmit}>
// //                 <Form.Group className="mb-3">
// //                   <Form.Label>Full Name</Form.Label>
// //                   <Form.Control
// //                     type="text"
// //                     name="name"
// //                     value={formData.name}
// //                     onChange={handleChange}
// //                     required
// //                     placeholder="Enter your full name"
// //                   />
// //                 </Form.Group>

// //                 <Form.Group className="mb-3">
// //                   <Form.Label>Email</Form.Label>
// //                   <Form.Control
// //                     type="email"
// //                     name="email"
// //                     value={formData.email}
// //                     onChange={handleChange}
// //                     required
// //                     placeholder="Enter your email"
// //                   />
// //                 </Form.Group>

// //                 <Form.Group className="mb-3">
// //                   <Form.Label>Role</Form.Label>
// //                   <Form.Select name="role" value={formData.role} onChange={handleChange} required>
// //                     <option value="driver">Driver</option>
// //                     <option value="owner">Owner</option>
// //                     <option value="admin">Admin</option>
// //                   </Form.Select>
// //                 </Form.Group>

// //                 <Form.Group className="mb-3">
// //                   <Form.Label>Password</Form.Label>
// //                   <Form.Control
// //                     type="password"
// //                     name="password"
// //                     value={formData.password}
// //                     onChange={handleChange}
// //                     required
// //                     placeholder="Enter your password"
// //                     minLength="6"
// //                   />
// //                 </Form.Group>

// //                 <Form.Group className="mb-3">
// //                   <Form.Label>Confirm Password</Form.Label>
// //                   <Form.Control
// //                     type="password"
// //                     name="confirmPassword"
// //                     value={formData.confirmPassword}
// //                     onChange={handleChange}
// //                     required
// //                     placeholder="Confirm your password"
// //                     minLength="6"
// //                   />
// //                 </Form.Group>

// //                <Form.Group className="mb-3">
// //                     <Form.Label>Phone Number</Form.Label>
// //                     <Form.Control
// //                         type="tel"                
// //                         name="phone"              
// //                         value={formData.phone}
// //                         onChange={handleChange}
// //                         required
// //                         placeholder="Enter phone number"
// //                         minLength="10"
// //                     />
// //                     </Form.Group>

// //                 <Button variant="primary" type="submit" className="w-100" disabled={loading}>
// //                   {loading ? (
// //                     <>
// //                       <span className="spinner-border spinner-border-sm me-2" role="status"></span>
// //                       Creating account...
// //                     </>
// //                   ) : (
// //                     "Create Account"
// //                   )}
// //                 </Button>
// //               </Form>

// //               <div className="text-center mt-3">
// //                 <p>
// //                   Already have an account? <Link to="/login">Sign in</Link>
// //                 </p>
// //               </div>
// //             </Card.Body>
// //           </Card>
// //         </Col>
// //       </Row>
// //     </Container>
// //   )
// // }

// // export default Register
// import axios from "axios";
// import { useState } from "react";

// function RegisterForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     role: "", // "admin", "owner", or "driver"
//     aadhar_number: "",
//     license_number: "",
//     ownedBy: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Copy form data except confirmPassword
//     const { confirmPassword, ...payload } = formData;

//     // Strip forbidden fields for non-drivers
//     if (payload.role !== "driver") {
//       delete payload.aadhar_number;
//       delete payload.license_number;
//       delete payload.ownedBy;
//     }

//     // Debug log to see exactly what we send
//     console.log("Sending payload to backend:", payload);

//     try {
//       const res = await axios.post(
//         "http://localhost:3000/api/auth/register",
//         payload,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       console.log("✅ Registration successful:", res.data);
//       // You can store token or redirect here
//     } catch (err) {
//       if (err.response) {
//         console.error("❌ Backend returned error:", err.response.data);
//       } else {
//         console.error("❌ Request failed:", err.message);
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* Name */}
//       <input
//         type="text"
//         placeholder="Name"
//         value={formData.name}
//         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//       />
//       {/* Email */}
//       <input
//         type="email"
//         placeholder="Email"
//         value={formData.email}
//         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//       />
//       {/* Phone */}
//       <input
//         type="text"
//         placeholder="Phone"
//         value={formData.phone}
//         onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//       />
//       {/* Password */}
//       <input
//         type="password"
//         placeholder="Password"
//         value={formData.password}
//         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//       />
//       {/* Confirm Password */}
//       <input
//         type="password"
//         placeholder="Confirm Password"
//         value={formData.confirmPassword}
//         onChange={(e) =>
//           setFormData({ ...formData, confirmPassword: e.target.value })
//         }
//       />
//       {/* Role */}
//       <select
//         value={formData.role}
//         onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//       >
//         <option value="">Select Role</option>
//         <option value="admin">Admin</option>
//         <option value="owner">Owner</option>
//         <option value="driver">Driver</option>
//       </select>

//       {/* Driver-only fields */}
//       {formData.role === "driver" && (
//         <>
//           <input
//             type="text"
//             placeholder="Aadhar Number"
//             value={formData.aadhar_number}
//             onChange={(e) =>
//               setFormData({ ...formData, aadhar_number: e.target.value })
//             }
//           />
//           <input
//             type="text"
//             placeholder="License Number"
//             value={formData.license_number}
//             onChange={(e) =>
//               setFormData({ ...formData, license_number: e.target.value })
//             }
//           />
//           <input
//             type="text"
//             placeholder="Owned By (Owner ID)"
//             value={formData.ownedBy}
//             onChange={(e) =>
//               setFormData({ ...formData, ownedBy: e.target.value })
//             }
//           />
//         </>
//       )}

//       <button type="submit">Register</button>
//     </form>
//   );
// }

// export default RegisterForm;
"use client"

import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "driver",
    aadhar_number: "",
    license_number: "",
    ownedBy: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Prepare payload
    const { confirmPassword, ...payload } = formData;

    if (payload.role !== "driver") {
      delete payload.aadhar_number;
      delete payload.license_number;
      delete payload.ownedBy;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Registration successful!");
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      if (err.response) {
        setError(err.response.data);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="mt-5">
            <Card.Body>
              <div className="text-center mb-4">
                <i className="fas fa-truck fa-3x text-primary mb-3"></i>
                <h2>Fleet Manager</h2>
                <p className="text-muted">Create your account</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="driver">Driver</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>

                {formData.role === "driver" && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Aadhar Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="aadhar_number"
                        value={formData.aadhar_number}
                        onChange={handleChange}
                        placeholder="Enter Aadhar number"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>License Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="license_number"
                        value={formData.license_number}
                        onChange={handleChange}
                        placeholder="Enter License number"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Owned By (Owner ID)</Form.Label>
                      <Form.Control
                        type="text"
                        name="ownedBy"
                        value={formData.ownedBy}
                        onChange={handleChange}
                        placeholder="Enter Owner ID"
                      />
                    </Form.Group>
                  </>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                    minLength="10"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    minLength="6"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    minLength="6"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p>
                  Already have an account? <Link to="/login">Sign in</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
