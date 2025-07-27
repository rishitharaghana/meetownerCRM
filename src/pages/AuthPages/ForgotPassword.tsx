import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router"; // Updated import for react-router-dom
import { EyeCloseIcon, EyeIcon } from "../../icons"; // Adjust path as needed
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { AppDispatch, RootState } from "../../store/store";
import { checkMobileExists, resetPassword } from "../../store/slices/authSlice";
import AuthLayout from "./AuthPageLayout";

interface ForgotPasswordFormData {
  mobile: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, mobileExists } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    mobile: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    mobile: "",
    newPassword: "",
    confirmPassword: "",
    general: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);

  // Handle errors from Redux
  useEffect(() => {
    if (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        general: error,
      }));
    }
  }, [error]);

  // Update mobile verification status
  useEffect(() => {
    setIsMobileVerified(mobileExists);
    if (!mobileExists) {
      setFormData((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
      setErrors({ mobile: "", newPassword: "", confirmPassword: "", general: "" });
    }
  }, [mobileExists]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Optimize state update to prevent unnecessary rerenders
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "mobile" ? value.replace(/\D/g, "") : value,
    }));

    // Update errors only when necessary
    if (errors[name] || errors.general) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
        general: "",
      }));
    }
  };

  const isValidMobile = (mobile: string) => {
    return /^[6-9]\d{9}$/.test(mobile);
  };

  const isValidPassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(password);
  };

  const handleMobileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = { mobile: "", newPassword: "", confirmPassword: "", general: "" };
    let hasError = false;

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      hasError = true;
    } else if (!isValidMobile(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Dispatch action to check if mobile exists
    await dispatch(checkMobileExists(formData.mobile));
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = { mobile: "", newPassword: "", confirmPassword: "", general: "" };
    let hasError = false;

    // Validate new password
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      hasError = true;
    } else if (!isValidPassword(formData.newPassword)) {
      newErrors.newPassword =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
      hasError = true;
    }

    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
      hasError = true;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Dispatch action to reset password
    const resultAction = await dispatch(
      resetPassword({ mobile: formData.mobile, newPassword: formData.newPassword })
    );
    if (resetPassword.fulfilled.match(resultAction)) {
      setFormData({ mobile: "", newPassword: "", confirmPassword: "" });
      setIsMobileVerified(false);
      navigate("/signin");
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-bold text-2xl text-blue-900">Forgot Password</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isMobileVerified
                  ? "Enter your new password"
                  : "Enter your mobile number to reset your password"}
              </p>
            </div>

            <form
              onSubmit={isMobileVerified ? handlePasswordSubmit : handleMobileSubmit}
              autoComplete="off"
            >
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-800 dark:text-white">
                    Mobile Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="tel"
                    name="mobile"
                    placeholder="Enter Mobile number"
                    value={formData.mobile}
                    maxLength={10}
                    onChange={handleInputChange}
                    disabled={isMobileVerified}
                    className="w-full px-4 py-2 mt-1 border rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7700ff]"
                  />
                  {errors.mobile && (
                    <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>
                  )}
                </div>

                {isMobileVerified && (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-gray-800 dark:text-white">
                        New Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Enter new password"
                          className="w-full px-4 py-2 pr-10 mt-1 border rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7700ff]"
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-300 size-5" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-300 size-5" />
                          )}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character
                      </p>
                      {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-800 dark:text-white">
                        Confirm Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm new password"
                          className="w-full px-4 py-2 pr-10 mt-1 border rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7700ff]"
                        />
                        <span
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                        >
                          {showConfirmPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-300 size-5" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-300 size-5" />
                          )}
                        </span>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <Button
                    className="w-full px-5 py-3 font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-md text-sm shadow-md"
                    size="sm"
                    disabled={loading}
                  >
                    {loading
                      ? isMobileVerified
                        ? "Resetting Password..."
                        : "Verifying Mobile..."
                      : isMobileVerified
                      ? "Reset Password"
                      : "Verify Mobile"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-4 text-center">
              <Link
                to="/signin"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Back to Sign In
              </Link>
            </div>

            {errors.general && (
              <p className="mt-4 text-sm text-red-500 text-center">{errors.general}</p>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}