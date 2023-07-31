import { toast } from "react-toastify";
export function validateLoginForm(
  emailInput,

  passwordInput
) {
  // Check email format using regular expression
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput)) {
    toast.error("Invalid email format.", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }

  // Check password minimum length
  if (passwordInput.length < 5) {
    toast.error("Password must be at least 5 characters long.", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
  return true;
}

export function validateSignupForm(
  usernameInput,
  mobileInput,
  emailInput,
  passwordInput
) {
  // Check email format using regular expression
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput)) {
    toast.error("Invalid email format.", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }

  // Check username constraints (e.g., alphanumeric characters only)
  var usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(usernameInput)) {
    toast.error("Username must contain only alphanumeric characters.", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }

  // Mobile number pattern (10 digits)
  var mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(mobileInput)) {
    toast.error("Invalid mobile number. It should be 10 digits.", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }

  // Check password minimum length
  if (passwordInput.length < 5) {
    toast.error("Password must be at least 5 characters long.", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
  return true; // If all validations pass, form will be submitted
}
