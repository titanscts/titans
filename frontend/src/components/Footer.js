import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={`bg-dark pt-3 mt-20 ${classes.footer}`}>
      <p>© 2022 Copyright: Titans</p>
    </div>
  );
};

export default Footer;
