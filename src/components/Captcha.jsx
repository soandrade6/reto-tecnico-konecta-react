import { useEffect } from "react";

const Captcha = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="g-recaptcha"
      data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
    ></div>
  );
};

export default Captcha;
