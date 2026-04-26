import { Link } from 'react-router-dom';

export default function AuthorContactConsentBlock({ checked, onChange, name = 'consentAuthorShare' }) {
  return (
    <div className="stack" style={{ gap: 10 }}>
      <label className="checkbox-row">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} />
        <span>
          I agree to receive this ebook and understand that my email address will be shared with
          the author/creator, who may contact me directly.
        </span>
      </label>
      <p className="muted" style={{ margin: 0, fontSize: '0.92rem', paddingLeft: 28 }}>
        See our{' '}
        <Link to="/privacy">Privacy Policy</Link> for more information on how your data is used.
      </p>
    </div>
  );
}
