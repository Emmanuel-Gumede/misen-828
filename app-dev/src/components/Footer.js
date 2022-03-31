import "../styles/Footer.css";

const Footer = () => {
  return (
    <section className="app-footer">
      <div className="footer-container">
        <Developer />
        <Contact />
      </div>
    </section>
  );
};

export default Footer;

const Developer = () => {
  return (
    <div>
      <h2>Developed by:</h2>
      <p>Emmanuel Gumede</p>
      <p>Full-Stack Web Developer</p>
      <p>South Africa</p>
    </div>
  );
};

const Contact = () => {
  return (
    <div>
      <h2>Contact:</h2>
      <p>
        <span>E-Mail:</span>misen-dev@gmail.com
      </p>
    </div>
  );
};
