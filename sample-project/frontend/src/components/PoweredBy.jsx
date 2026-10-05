// Mandatory on the login page and in the back-office: "Powered by" on one line, the ENSO logo below.
export default function PoweredBy({ variant = 'dark' }) {
  return (
    <a className={`powered-by powered-by--${variant}`} href="https://enso-origins.com" target="_blank" rel="noreferrer">
      <span>Powered by</span>
      <img src={variant === 'light' ? '/enso/enso-white.png' : '/enso/enso-black.png'} alt="ENSO Origins" />
    </a>
  );
}
