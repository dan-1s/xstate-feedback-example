import { Machine, assign } from "xstate";

const fakeApiRequest = ({ delay, succeed }) => {
  if (!succeed) {
    succeed = Math.random() > 0.3;
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => (succeed ? resolve("Success") : reject("Oops")), delay);
  });
};

const fakeAnimation = (delay) => (_context, _event) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Animation");
    }, delay);
  });

export const TOGGLE = "TOGGLE";
export const SELECT_MOOD = "SELECT_MOOD";
export const USER_INPUT = "USER_INPUT";
export const RETRY = "RETRY";
export const SUBMIT = "SUBMIT";

export const moods = {
  good: "good",
  okay: "okay",
  bad: "bad",
};

const values = {
  title: "How was your experience?",
  selectedGood: "Happy you like it!",
  selectedOkay: "What can we do better?",
  selectedBad: "We're sorry, could you tell us more?",
  onSuccessTitle: "Thanks for your response!",
  onFailureTitle: "Something went wrong.",
};

const action = {
  reset: "reset",
  selectMood: "selectMood",
  adjustTitleToMood: "adjustTitleToMood",
  getUserInput: "getUserInput",
  setFailureTitle: "setFailureTitle",
  setSuccessTitle: "setSuccessTitle",
};

const feedbackMachine = Machine(
  {
    id: "feedback",
    initial: "closed",
    context: {
      title: values.title,
      selectedMood: null,
      userInput: "",
    },
    states: {
      closed: {
        entry: action.reset,
        on: {
          [TOGGLE]: "opening",
        },
      },
      opening: {
        on: {
          [TOGGLE]: "closing",
        },
        invoke: {
          id: "openAnimation",
          src: fakeAnimation(500),
          onDone: "opened",
          onError: "closed",
        },
      },
      closing: {
        on: {
          [TOGGLE]: "opening",
        },
        invoke: {
          id: "closeAnimation",
          src: fakeAnimation(500),
          onDone: "closed",
          onError: "closed",
        },
      },
      opened: {
        initial: "stepOne",
        on: {
          [TOGGLE]: "#feedback.closing",
        },
        states: {
          stepOne: {
            on: {
              [SELECT_MOOD]: {
                target: "stepTransition",
                actions: action.selectMood,
              },
            },
          },
          stepTransition: {
            entry: action.adjustTitleToMood,
            invoke: {
              id: "stepAnimation",
              src: fakeAnimation(500),
              onDone: "stepTwo",
              onError: "stepOne",
            },
          },
          stepTwo: {
            on: {
              [USER_INPUT]: {
                target: "stepTwo",
                actions: action.getUserInput,
              },
              [SUBMIT]: "submitting",
            },
          },
          submitting: {
            invoke: {
              id: "submitForm",
              src: () => fakeApiRequest({ delay: 2000 }),
              onDone: "success",
              onError: "failure",
            },
          },
          failure: {
            entry: action.setFailureTitle,
            on: {
              [RETRY]: "submitting",
            },
          },
          success: {
            entry: action.setSuccessTitle,
            after: {
              3500: "#feedback.closing",
            },
          },
        },
      },
    },
  },
  {
    actions: {
      [action.reset]: assign({
        title: values.title,
        selectedMood: null,
        userInput: "",
      }),
      [action.selectMood]: assign((context, { value }) => {
        return {
          ...context,
          selectedMood: value,
        };
      }),
      [action.adjustTitleToMood]: assign({
        title: (context) => {
          switch (context.selectedMood) {
            case moods.good:
              return values.selectedGood;
            case moods.okay:
              return values.selectedOkay;
            case moods.bad:
              return values.selectedBad;
            default:
              return "Tell us more";
          }
        },
      }),
      [action.getUserInput]: assign((context, { value }) => {
        return {
          ...context,
          userInput: value,
        };
      }),
      [action.setFailureTitle]: assign({
        title: values.onFailureTitle,
      }),
      [action.setSuccessTitle]: assign({
        title: values.onSuccessTitle,
      }),
    },
  }
);

export default feedbackMachine;
