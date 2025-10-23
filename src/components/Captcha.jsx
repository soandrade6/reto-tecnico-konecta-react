import { useEffect } from "react";

const Captcha = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`;
    document.body.appendChild(script);
  }, []);
  return null;
};

export default Captcha;
