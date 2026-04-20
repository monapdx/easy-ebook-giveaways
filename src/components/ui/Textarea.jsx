export default function Textarea({ label, ...props }) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      <textarea className="textarea" {...props} />
    </label>
  );
}
