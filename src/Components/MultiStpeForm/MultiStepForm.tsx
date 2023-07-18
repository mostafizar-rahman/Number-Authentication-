import React, { useState } from "react";
import "./MultiStepForm.scss";
import { FaCheck } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OtpInput from "react-otp-input";
// import  {auth}  from "../../Firebase/firebase.config";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  getAuth,
} from "firebase/auth";
import { app } from "../../Firebase/firebase.config";

const auth = getAuth(app);
const MultistepForm = () => {
  const [step, setstep] = useState(1);
  const [number, setNumber] = useState<any>();
  const [loading, setLoading] = useState(false);
  // const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const onCaptchVerify = () => {
   
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response: any) => {},
          "expired-callback": () => {},
        }
      );
    }
  };
  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier =( window as any).recaptchaVerifier;

    const formatPh = "+" + number;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        (window as any).confirmationResult = confirmationResult;
        setLoading(false);
        setstep(step + 1);
        // toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    (window as any).confirmationResult
      .confirm(otp)
      .then(async (res : any) => {
        console.log(res);
        // setUser(res.user);
        setstep(step + 1);
        setLoading(false);
      })
      .catch((err:any) => {
        console.log(err);
        setLoading(false);
      });
  }

  // ---------- Handle Next step
  const handleNextstep = () => {
    setstep(step + 1);
  };

  const handlePrevious = () => {
    setstep((step) => step - 1);
  };

  // ----------- Handle Information
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    setFormData({ ...formData, [name]: value });
  };

  // --------- Submit Form
  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  // ---------- Which step you went to show
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <div style={{ marginBottom: "15px" }}>
              <PhoneInput
                inputStyle={{
                  width: "100%",
                  height: "40px",
                  borderColor: "#6521db",
                  borderWidth: "1px",
                }}
                buttonStyle={{
                  height: "40px",
                  borderColor: "#6521db",
                  borderWidth: "1px",
                }}
                country={"bd"}
                value={number}
                onChange={setNumber}
              />
            </div>
            <button onClick={onSignup} type="submit" className="step_button">
              Send OTP
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <div>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span style={{ marginLeft: "15px" }}> </span>}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  height: "40px",
                  width: "100%",
                  marginBottom: "15px",
                  borderColor: "#6521db",
                  borderWidth: "1px",
                  outline: "none",
                  borderRadius: "5px",
                }}
              />
            </div>
            <button
              onClick={onOTPVerify}
              type="submit"
              className="step_button"
            >
              Submit OTP
            </button>
            <button
              onClick={handlePrevious}
              type="submit"
              className="step_button_previous"
            >
              Previews
            </button>
          </div>
        );
      case 3:
        return (
          <div>
            <input
              onChange={handleInputChange}
              type="text"
              name="firstName"
              value={formData.firstName}
              placeholder="First Name"
              className="step_input_filed"
            />
            <input
              onChange={handleInputChange}
              type="text"
              name="lastName"
              value={formData.lastName}
              placeholder="First Name"
              className="step_input_filed"
            />

            <input
              onChange={handleInputChange}
              type="password"
              name="password"
              value={formData.password}
              placeholder="PassWord"
              className="step_input_filed"
            />

            <input
              onChange={handleInputChange}
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              className="step_input_filed"
            />

            <button type="submit" className="step_button">
              Login
            </button>
            <button
              onClick={handlePrevious}
              type="submit"
              className="step_button_previous"
            >
              Previews
            </button>
          </div>
        );
      default:
        break;
    }
  };

  return (
    <div className="step_container">
      <h3 className="title">Registion</h3>
      <div className="flex_between step_wapper">
        <div className="flex_between step_group">
          <button className="step_number">{step > 1 ? <FaCheck /> : 1}</button>
          <p className="step_name">Number</p>
        </div>
        <div className="flex_between step_group">
          <button className="step_number">{step > 2 ? <FaCheck /> : 2}</button>
          <p className="step_name">OTP</p>
        </div>
        <div className="flex_between step_group">
          <button className="step_number">3</button>
          <p className="step_name">Information</p>
        </div>
      </div>
      <form className="step_form" onSubmit={handleForm}>
        {renderStep()}
      </form>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default MultistepForm;
