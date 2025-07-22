import React, { useState } from "react";
import api from "../src/utils/api/axiosConfig";
const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "32px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    fontFamily: "Segoe UI, Arial, sans-serif",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "8px",
    color: "#1a237e",
    textAlign: "center",
  },
  subheading: {
    fontSize: "1.1rem",
    marginBottom: "24px",
    color: "#333",
    textAlign: "center",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "500",
    color: "#222",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "18px",
    border: "1px solid #bdbdbd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    minHeight: "80px",
    border: "1px solid #bdbdbd",
    borderRadius: "4px",
    fontSize: "1rem",
    marginBottom: "18px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontWeight: "600",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  buttonHover: {
    background: "#1565c0",
  },
  error: {
    color: "#d32f2f",
    marginBottom: "12px",
    fontSize: "0.97rem",
  },
  contactInfo: {
    marginTop: "32px",
    padding: "18px 0 0 0",
    borderTop: "1px solid #e0e0e0",
    color: "#555",
    fontSize: "0.98rem",
    textAlign: "center",
  },
};

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "",phone:"", message: ""});
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validateEmail = (email) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitted(true);
    api.post('/feedback/create', form)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
    setForm({ name: "", email: "",phone:"", message: "" });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Contact Us</h2>
      <div style={styles.subheading}>
        Have questions or need support? Fill out the form below and our team will get back to you soon.
      </div>
      {error && <div style={styles.error}>{error}</div>}
      {submitted && (
        <div style={{ color: "#388e3c", marginBottom: 16, textAlign: "center" }}>
          Thank you for contacting us! We’ll respond as soon as possible.
        </div>
      )}
      <form onSubmit={handleSubmit} autoComplete="off">
        <label style={styles.label} htmlFor="name">Name</label>
        <input
          style={styles.input}
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
        />
        <label style={styles.label} htmlFor="email">Email</label>
        <input
          style={styles.input}
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        <label style={styles.label} htmlFor="phone">Phone</label>
        <input
          style={styles.input}
          type="phone"
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="1234567890"
        />
        <label style={styles.label} htmlFor="message">Message</label>
        <textarea
          style={styles.textarea}
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Type your message here..."
        />
        <button
          style={styles.button}
          type="submit"
        >
          Send Message
        </button>
      </form>
      <div style={styles.contactInfo}>
        <div><strong>Email:</strong> support@motocredit.com</div>
        <div><strong>Phone:</strong> +91 9876543210</div>
        <div><strong>Address:</strong> 123 City Road, City, Country</div>
      </div>
    </div>
  );
}

export default ContactPage;
