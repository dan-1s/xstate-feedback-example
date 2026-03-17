import React from "react";
import * as css from "./Spinner.module.css";
import classes from "../../../utils/classes";

const icon = ({size = 65, className}) => (
  <svg className={classes(css.element, className)} width={size} height={size} viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
    <circle className={css.path} fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30" />
  </svg>
);

export default icon;
