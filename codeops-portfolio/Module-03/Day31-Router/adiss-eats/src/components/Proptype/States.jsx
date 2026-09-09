import { useState } from "react";
 
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
 
function isValidPhone(phone) {
  return /^(?:\+2519|09)\d{8}$/.test(phone);
}
 
function OrderForm() {
  const [form, setForm] = useState({
    name:  "",
    email: "",
    phone: "",
  });
 
  const [touched, setTouched] = useState({
    name:  false,
    email: false,
    phone: false,
  });
 
  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }
 
  function handleBlur(e) {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  }
 
  const emailValid = isValidEmail(form.email);
  const phoneValid = isValidPhone(form.phone);
  const formValid  = form.name.trim() !== "" && emailValid && phoneValid;
 
  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true });
    if (!formValid) return;
    alert(
      `Order placed!\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}`
    );
    setForm({ name: "", email: "", phone: "" });
    setTouched({ name: false, email: false, phone: false });
  }
 
  return (
    <div>
      <h2>Delivery Details</h2>
 
      <form onSubmit={handleSubmit} noValidate>
 
        <div>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Almaz Tadesse"
          />
          {touched.name && form.name.trim() === "" && (
            <p>Name is required.</p>
          )}
        </div>
 
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="almaz@example.com"
          />
          {touched.email && !form.email && (
            <p>Email is required.</p>
          )}
          {touched.email && form.email && !emailValid && (
            <p>Enter a valid email address.</p>
          )}
        </div>
 
        <div>
          <label htmlFor="phone">TeleBirr Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="09XXXXXXXX or +2519XXXXXXXX"
          />
          {touched.phone && !form.phone && (
            <p>Phone number is required.</p>
          )}
          {touched.phone && form.phone && !phoneValid && (
            <p>Use format 09XXXXXXXX or +2519XXXXXXXX.</p>
          )}
        </div>
 
        <button type="submit" disabled={!formValid}>
          {formValid ? "Place Order" : "Complete form to order"}
        </button>
 
      </form>
    </div>
  );
}
 
export default OrderForm;