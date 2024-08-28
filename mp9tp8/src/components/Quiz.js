import React, { useState, useEffect, useRef } from "react";
import useSound from "use-sound";
import play from "../sounds/play.mp3";
import correct from "../sounds/correct.mp3";
import wrong from "../sounds/wrong.mp3";
import Timer from "./Timer";

const Quiz = ({ data, questionNumber, setQuestionNumber, setTimeOut }) => {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [className, setClassName] = useState("answer");
  const [letsPlay] = useSound(play);
  const [correctAnswer] = useSound(correct);
  const [wrongAnswer] = useSound(wrong);
  const [showNextButton, setShowNextButton] = useState(false);
  const [show5050Button, setShow5050Button] = useState(true);
  const [showPhoneButton, setPhoneButton] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  const timerIdRef = useRef(null);

  useEffect(() => {
    setQuestion(data[questionNumber - 1]);
    setShowAnswers(false);
    setSelectedAnswer(null); // Reset selected answer when the question changes
  }, [data, questionNumber]);

  useEffect(() => {
    if (showAnswers) {
      letsPlay();
      startTimer();
    }
  }, [letsPlay, showAnswers]);

  const delay = (duration, callBack) => {
    setTimeout(() => {
      callBack();
    }, duration);
  };

  const startTimer = () => {
    timerIdRef.current = setTimeout(() => {
      handleTimerExpiration();
    }, 30000);
    return () => clearTimeout(timerIdRef.current);
  };

  const handlePhone = () => {
    setPhoneButton(false);
  };

  const handleTimerExpiration = () => {
    if (!selectedAnswer && !showNextButton) {
      setClassName("answer");
      setSelectedAnswer(null);
      setTimeOut(true);
    }
  };

  const handleCorrectAnswer = () => {
    correctAnswer();
    setShowNextButton(true);
  };

  const handleNext = () => {
    setShowNextButton(false);
    setQuestionNumber((prev) => prev + 1);
    setSelectedAnswer(null);
    setClassName("answer");
    setTimeOut(false);
    setShow5050Button(true);
  };

  const handle5050 = () => {
    if (!show5050Button) return;

    const correctAnswerIndex = question.answers.findIndex(
      (answer) => answer.correct
    );
    const randomIndexes = [];
    while (randomIndexes.length < 2) {
      const randomIndex = Math.floor(Math.random() * question.answers.length);
      if (
        randomIndex !== correctAnswerIndex &&
        !randomIndexes.includes(randomIndex)
      ) {
        randomIndexes.push(randomIndex);
      }
    }

    const updatedAnswers = question.answers.map((answer, index) => {
      if (index === correctAnswerIndex) return answer;
      if (randomIndexes.includes(index)) return null;
      return answer;
    });

    const filteredAnswers = updatedAnswers.filter((answer) => answer !== null);

    setQuestion({
      ...question,
      answers: filteredAnswers,
    });

    setShow5050Button(false);
  };

  const handleClick = (item) => {
    setSelectedAnswer(item);

    if (item.correct) {
      setClassName("answer correct");
      handleCorrectAnswer();
    } else {
      setClassName("answer wrong");
      wrongAnswer();
      delay(2000, () => {
        setClassName("answer");
        setSelectedAnswer(null); // Allow the user to select another option
      });
    }
  };

  const handleShowAnswers = () => {
    setShowAnswers(true);
    startTimer();
  };

  return (
    <div className="quiz">
      {showAnswers && (
        <div className="timer">
          <Timer setTimeOut={setTimeOut} questionNumber={questionNumber} />
        </div>
      )}
      <div className="question">{question?.question}</div>
      <div className="answers">
        {showAnswers &&
          question?.answers.map((item) => (
            <div
              key={item.id}
              className={selectedAnswer === item ? className : "answer"}
              onClick={() => handleClick(item)}
            >
              {item.text}
            </div>
          ))}
      </div>
      <div className="button-container">
        {!showAnswers && (
          <button className="show-answers-button" onClick={handleShowAnswers}>
            Show Answers
          </button>
        )}
        {show5050Button && showAnswers && (
          <button className="fifty-button" onClick={handle5050}>
            50-50
          </button>
        )}
        {showNextButton && (
          <button className="next-button" onClick={handleNext}>
            Next
          </button>
        )}
        {showPhoneButton && showAnswers && (
          <button className="phone-button" onClick={handlePhone}>
            Phone your friend
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
