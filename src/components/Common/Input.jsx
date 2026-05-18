function Input({ className = "", ...props }) {
  return <input className={`input-base ${className}`.trim()} {...props} />;
}

export default Input;
