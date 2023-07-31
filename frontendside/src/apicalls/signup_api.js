import axios from "axios";
import { toast } from "react-toastify";

export const RegisterUser = (e, name, password, email, mobileNumber) => {
  e.preventDefault();
  return axios({
    method: "post",
    url: "https://project-listing-api.vercel.app/signup",
    data: {
      name: name,
      email: email,
      mobile: mobileNumber,
      password: password,
    },
  })
    .then((msg) => {
      //   console.log(msg.data);
      const userD = {
        user: msg.data.user,
        authToken: msg.data.token,
      };
      localStorage.setItem("userData", JSON.stringify(userD));
      return true;
    })
    .catch((err) => {
      toast.error(err.response.data.message);

      return false;
    });
  //   console.log(resp);
};
