export default function Input({ label, ...props }) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      <input className="input" {...props} />
    </label>
  );
}
