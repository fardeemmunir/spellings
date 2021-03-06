import React, { useState, useEffect, useRef, useContext } from "react";

import Sound from "./Player";

import styles from "./Form.module.css";
import StoreContext from "../store";

const Form = ({ word, next }) => {
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const inputEl = useRef(null);
  const { dispatch } = useContext(StoreContext);

  function handleSubmit(e) {
    e.preventDefault();
    setShowAnswer(true);

    const isCorrect = answer === word;

    if (isCorrect) {
      document.body.classList.add("right");
    } else {
      document.body.classList.add("wrong");
    }

    dispatch({
      type: "ADD_STAT",
      value: {
        word,
        isCorrect,
        speed: startTime !== 0 ? Date.now() - startTime : 5000,
        date: Date.now()
      }
    });
  }

  useEffect(() => {
    function bindKeys(e) {
      if (e.target === inputEl.current || !showAnswer) return;
      if (e.key === "n" || e.key === "ArrowRight") next();
    }

    window.addEventListener("keyup", bindKeys);

    return () => {
      window.removeEventListener("keyup", bindKeys);
    };
  }, [showAnswer, next]);

  useEffect(() => {
    setShowAnswer(false);
    setAnswer("");
    setStartTime(0);
    document.body.classList.remove("right");
    document.body.classList.remove("wrong");

    return () => {
      document.body.classList.remove("right");
      document.body.classList.remove("wrong");
    };
  }, [word]);

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Sound
          word={word}
          start={() => startTime === 0 && setStartTime(Date.now())}
        />

        <input
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className={styles.input}
          value={answer}
          onChange={e => setAnswer(e.target.value.trim().toLowerCase())}
          disabled={showAnswer}
          ref={inputEl}
        />
        <input type="submit" className={styles.btn} />
      </form>

      {showAnswer && (
        <section>
          <div className={styles.feedback}>
            <h2>
              {answer.toLowerCase() === word.toLowerCase() ? (
                "Correct!"
              ) : (
                <>
                  Wrong! <br /> Correct spelling: <b>{word}</b>
                </>
              )}
            </h2>
          </div>

          <div className={styles.feedbackBtnArea}>
            <button
              className={styles.btn}
              onClick={() => {
                setShowAnswer(false);
                next();
              }}
            >
              Next
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Form;
