import React from "react";
import * as css from "./State.module.css";

function State({ value, context }) {
  return (
    <section className={css.container}>
      <header className={css.header}>
        <h2>xstate</h2>
        <a href="https://xstate.js.org/viz/?gist=9e21664f13105e923c66bfb7872c87e3">open in visualizer</a>
      </header>

      <span className={css.title}>current state</span>
      <pre className={css.code}>{JSON.stringify(value)}</pre>

      <span className={css.title}>context</span>
      <pre className={css.code}>{JSON.stringify(context)}</pre>
    </section>
  );
}

export default State;
