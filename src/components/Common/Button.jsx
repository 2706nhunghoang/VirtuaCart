function Button({ children, className = "", variant = "primary", ...props }) {
  const baseClass = variant ? `btn-${variant}` : "";
  return (
    <button
      className={`${baseClass} ${className}`.trim()}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
