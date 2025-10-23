import { useEffect, forwardRef, useImperativeHandle } from "react";

const Captcha = forwardRef((props, ref) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);


  useImperativeHandle(ref, () => ({
    reset: () => {
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
    },
  }));

  return (
    <div
      className="g-recaptcha"
      data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
    ></div>
  );
});

export default Captcha;
