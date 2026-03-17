import React from "react";
import * as css from "./Moods.module.css";
import { moods } from "./machine/feedbackMachine";
import classes from "../../utils/classes";

import { IconHappy, IconOkay, IconSad } from "./Icons";

function Moods({ state, dataState, onSelectGood, onSelectOkay, onSelectBad, className }) {
  return (
    <div className={classes(css.moods, className)}>
      <button
        className={css.btn}
        data-state={dataState}
        data-position="left"
        data-selected={state.context.selectedMood === moods.good}
        onClick={onSelectGood}
      >
        <span>Good</span>
        <IconHappy />
      </button>

      <button
        className={css.btn}
        data-state={dataState}
        data-position="middle"
        data-selected={state.context.selectedMood === moods.okay}
        onClick={onSelectOkay}
      >
        <span>Okay</span>
        <IconOkay />
      </button>

      <button
        className={css.btn}
        data-state={dataState}
        data-position="right"
        data-selected={state.context.selectedMood === moods.bad}
        onClick={onSelectBad}
      >
        <span>Bad</span>
        <IconSad />
      </button>
    </div>
  );
}

export default Moods;
