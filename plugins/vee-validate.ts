import { ValidationProvider, ValidationObserver } from "vee-validate";
import Vue from "vue";
import { required, email, max, min, confirmed,max_value, min_value } from "vee-validate/dist/rules";
import { extend } from "vee-validate";
import { hasNumber, hasSpecialCharacter, hasUppercase, hasLowerCase } from "./../utils/stringHelpers";

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);

extend("required", {
  ...required,
  message: "This field is required",
});

extend("max_value", {
  ...max_value,
  message: "This field must be {max} characters or less",
});

extend("min_value", {
  ...min_value,
  message: "The field field must be grater than {min}",
});

extend("max", {
  ...max,
  message: "This field must be {length} characters or less",
});

extend("min", {
  ...min,
  message: "This field must be {length} characters or more",
});

extend("email", {
  ...email,
  message: "This field must be a valid email",
});

extend("confirmed", {
  ...confirmed,
  message: "Passwords donot match",
});

extend("strong_password", {
  message: (filedname, input) => {
    const value = input._value_;
    if (!hasNumber(value)) {
      return `This field must contain atleast one number`;
    }

    if (!hasSpecialCharacter(value)) {
      return `This field must contain atleast one special character`;
    }
    if (!hasUppercase(value)) {
      return `This field must contain atleast one uppercase letter`;
    }

    if (!hasLowerCase(value)) {
      return `This field must contain atleast one lowercase letter`;
    }

    return "The password is too weak. Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and one special character";
  },
  validate: (value) => {
    // var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    // return strongRegex.test(value);
    // return hasNumber;
    const hasNumberBool = hasNumber(value);
    const hasSpecialCharacterBool = hasSpecialCharacter(value);
    const hasUppercaseBool = hasUppercase(value);
    const hasLowerCaseBool = hasLowerCase(value);
    
    return hasNumberBool && hasSpecialCharacterBool && hasUppercaseBool && hasLowerCaseBool;
  },
});
