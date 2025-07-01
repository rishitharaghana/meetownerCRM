import { useEffect, useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useNavigate } from "react-router";

const userTypes = [
  { value: "builder", label: "Builder" },
  { value: "channel_partner", label: "Channel Partner" },
  { value: "tele_callers", label: "Tele Caller" },
  { value: "sales_manager", label: "Sales Manager" },
  { value: "receptionsit", label: "Receptionist" },
  { value: "marketing_executors", label: "Marketing Executor" },
];

export default function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
    userType: "",
  });

  const [errors, setErrors] = useState({
    mobile: "",
    password: "",
    userType: "",
    general: "",
  });

  useEffect(() => {
    localStorage.removeItem("userData");
    setFormData({ mobile: "", password: "", userType: "" });
    setErrors({ mobile: "", password: "", userType: "", general: "" });
    setFormKey(Date.now());
  }, []);

  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "mobile" ? value.replace(/\D/g, "") : value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
      general: "",
    }));
  };

  const isValidMobile = (mobile: string) => {
    return /^[6-9]\d{9}$/.test(mobile);
  };

const handleSubmit = (e: { preventDefault: () => void }) => {
  e.preventDefault();

  let newErrors = { mobile: "", password: "", userType: "", general: "" };
  let hasError = false;

  if (!formData.mobile.trim()) {
    newErrors.mobile = "Mobile number is required";
    hasError = true;
  } else if (!isValidMobile(formData.mobile)) {
    newErrors.mobile = "Enter a valid 10-digit mobile number";
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

  const newUser = {
    mobile: formData.mobile,
    userType: formData.userType,
  };

  try {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "{}");

    if (!existingUsers[formData.userType]) {
      existingUsers[formData.userType] = [];
    }

    const alreadyExists = existingUsers[formData.userType].some(
      (user: any) => user.mobile === newUser.mobile
    );

    if (!alreadyExists) {
      existingUsers[formData.userType].push(newUser);
    }

    localStorage.setItem("users", JSON.stringify(existingUsers)); // ✅ Keep this
    // localStorage.setItem("userData", JSON.stringify(newUser)); ❌ Remove this line
  } catch (err) {
    console.error("Error saving user:", err);
  }

  setFormData({ mobile: "", password: "", userType: "tele_callers" }); // Or your default type
  setFormKey(Date.now());
  navigate("/");
};



  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-bold text-2xl text-[#7700ff]">Sign In</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter your mobile number, password, and select user type to sign in!
            </p>

          
          </div>

          <form key={formKey} onSubmit={handleSubmit} autoComplete="off">
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-800 dark:text-white">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="tel"
                  name="mobile"
                  autoComplete="off"
                  placeholder="Enter Mobile number"
                  value={formData.mobile}
                  maxLength={10}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 mt-1 border rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7700ff]"
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-800 dark:text-white">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
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
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <Button
                  className="w-full px-5 py-3 font-semibold text-white bg-[#7700ff] hover:bg-purple-800 rounded-md text-sm shadow-md"
                  size="sm"
                >
                  Sign in
                </Button>
              </div>
            </div>
          </form>

          {errors.general && (
            <p className="mt-4 text-sm text-red-500 text-center">{errors.general}</p>
          )}
        </div>
      </div>
    </div>
  );
}
