import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

import {  useNavigate } from "react-router";


export default function SignInForm() {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    mobile: "",
    password: "",
    general: "", // Add a general error field for server/network errors
  });

  
  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear errors when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
      general: "",
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Local validation
    let newErrors = { mobile: "", password: "", general: "" };
    let hasError = false;

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      hasError = true;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }
    navigate('/');

   
  };

  
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your mobile number and password to sign in!
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Mobile Number <span className="text-error-500">*</span>
                </Label>
                <Input
                  name="mobile"
                  placeholder="Enter Mobile number"
                  value={formData.mobile}
                  onChange={handleInputChange}
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-error-500">{errors.mobile}</p>
                )}
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-error-500">{errors.password}</p>
                )}
              </div>
              <div>
                <Button className="w-full" size="sm" >
                 Sign in
                </Button>
              </div>
            </div>
          </form>
          {/* Display general errors (e.g., network, server issues) */}
          {errors.general && (
            <p className="mt-4 text-sm text-error-500 text-center">{errors.general}</p>
          )}
        </div>
      </div>
    </div>
  );
}