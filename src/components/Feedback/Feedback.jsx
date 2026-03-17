import React from "react";
import { useMachine } from "@xstate/react";
import classes from "../../utils/classes";
import * as css from "./Feedback.module.css";
import feedbackMachine, { TOGGLE, SUBMIT, USER_INPUT, RETRY, SELECT_MOOD, moods } from "./machine/feedbackMachine";

import State from "./State/State";
import Moods from "./Moods";
import { IconSpinner, IconError, IconCheck } from "./Icons";

const stateToString = (state, delimiter = " ") => {
  if (!state || typeof state === "string") {
    return state;
  }

  return JSON.stringify(state).replace(/[{}"]/g, "").replace(/[:]/g, delimiter);
};

const Feedback = () => {
  const [state, send] = useMachine(feedbackMachine);
  const prev = state.history ? state.history : { matches: () => false, value: "" };

  const dataState = stateToString(state.value);
  const prevDataState = stateToString(prev.value);

  const matches = {
    steps:
      state.matches("opening") ||
      state.matches("opened.stepOne") ||
      state.matches("opened.stepTransition") ||
      state.matches("opened.stepTwo") ||
      (state.matches("closing") &&
        (prev.matches("opened.stepOne") || prev.matches("opened.stepTwo") || prev.matches("opening"))),

    submitting: state.matches("opened.submitting") || (state.matches("closing") && prev.matches("opened.submitting")),

    success: state.matches("opened.success") || (state.matches("closing") && prev.matches("opened.success")),

    failure: state.matches("opened.failure") || (state.matches("closing") && prev.matches("opened.failure")),
  };

  const [match] = Object.entries(matches).find(([_key, val]) => val === true) || [];

  const selectMood = (mood) => () => send(SELECT_MOOD, { value: mood });
  const userInput = (e) => send(USER_INPUT, { value: e.target.value });
  const toggle = () => send(TOGGLE);
  const submit = () => send(SUBMIT);
  const retry = () => send(RETRY);

  return (
    <>
      <State value={state.value} context={state.context} />

      <button onClick={toggle} className={classes(css.btn, css.btnToggle)}>
        Feedback
      </button>

      <section className={css.container} data-state={dataState} data-prev-state={prevDataState}>
        <h2>{state.context.title}</h2>

        {
          {
            steps: (
              <>
                <Moods
                  state={state}
                  className={css.moods}
                  dataState={dataState}
                  onSelectGood={selectMood(moods.good)}
                  onSelectOkay={selectMood(moods.okay)}
                  onSelectBad={selectMood(moods.bad)}
                />

                <textarea
                  onChange={userInput}
                  className={css.text}
                  data-state={dataState}
                  value={state.context.userInput}
                  placeholder={"Write more here if you want ..."}
                />

                <button className={classes(css.btn, css.btnSubmit)} onClick={submit}>
                  Submit
                </button>
              </>
            ),
            submitting: <IconSpinner className={css.spinner} />,
            success: <IconCheck className={css.success} />,
            failure: (
              <>
                <IconError className={css.failure} />
                <button className={classes(css.btn, css.btnRetry)} onClick={retry}>
                  Retry
                </button>
              </>
            ),
          }[match]
        }

        <button className={classes(css.btn, css.btnCancel)} onClick={toggle}>
          Close
        </button>
      </section>
    </>
  );
};

export default Feedback;
