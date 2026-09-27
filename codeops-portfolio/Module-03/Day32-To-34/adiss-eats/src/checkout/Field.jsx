import PropTypes from "prop-types";

function Field({ id, label, as = "input", error, touched, children, ...inputProps }) {
  const showError = Boolean(touched && error);
  const Tag = as;

  return (
    <div className="checkout__field">
      <label htmlFor={id} className="checkout__label">{label}</label>
      <Tag
        id={id}
        className="checkout__input"
        aria-invalid={showError}
        aria-describedby={showError ? `${id}-error` : undefined}
        {...inputProps}
      >
        {children}
      </Tag>
      {showError && (
        <p id={`${id}-error`} role="alert" className="checkout__field-error">
          {error}
        </p>
      )}
    </div>
  );
}

Field.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  as: PropTypes.oneOf(["input", "select", "textarea"]),
  error: PropTypes.string,
  touched: PropTypes.bool,
  children: PropTypes.node,
};

export default Field;