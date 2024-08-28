import "./styles.css";
import { useState, useEffect } from "react";
import { MDBRow, MDBCol, MDBListGroup, MDBBtn } from "mdb-react-ui-kit";
import Quiz from "./components/Quiz";
import { prizeMoney } from "./data";
import Start from "./components/Start";
// Mapping of data file imports
const dataFiles = {
  1: () => import('./data1'),
  2: () => import('./data2'),
  3: () => import('./data3'),
  4: () => import('./data4'),
  5: () => import('./data5'),
  6: () => import('./data6'),
  7: () => import('./data7'),
  8: () => import('./data8'),
  9: () => import('./data9'),
  10: () => import('./data10'),
};
function App() {
  const [name, setName] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeOut, setTimeOut] = useState(false);
  const [loadedData, setLoadedData] = useState(null);

  const [earned, setEarned] = useState("₹ 0");
  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10

    dataFiles[randomNumber]()
      .then((module) => {
        setLoadedData(module.data);
      })
      .catch((error) => {
        console.error("Error loading data file:", error);
      });
  }, []);
  useEffect(() => {
    questionNumber > 1 &&
      setEarned(
        prizeMoney.find((item) => item.id === questionNumber - 1).amount
      );
  }, [questionNumber]);

  return (
    <div className="App">
      {!name ? (
        <Start setName={setName} setTimeOut={setTimeOut} />
      ) : (
        <MDBRow>
          <MDBCol md="9">
            <div className="main">
              {(
                <>
                  <div style={{ height: "50%" }}>
                    <Quiz
                      data={loadedData}
                      questionNumber={questionNumber}
                      setQuestionNumber={setQuestionNumber}
                      setTimeOut={setTimeOut}
                    />
                  </div>
                </>
              )}
            </div>
          </MDBCol>
          <MDBCol md="3" className="money">
            <MDBListGroup className="money-list">
              <MDBRow>
                <span className="mb-2">
                {/* <MDBBtn
                    style={{ float: "right" }}
                    className="mx-2"
                    color="light"
                    onClick={() => setShowTimer(false)}
                  >
                    Stop Timer
                  </MDBBtn> */}
                  {/* <MDBBtn
                    style={{ float: "right" }}
                    onClick={() => {
                      setName(null);
                      setQuestionNumber(1);
                      setEarned("₹ 0");
                    }}
                  >
                    Exit
                  </MDBBtn> */}
                </span>
                <MDBCol md="6">Name: {name}</MDBCol>
                <MDBCol md="6">Total Earned: {earned}</MDBCol>
              </MDBRow>
              <hr />
              {prizeMoney.map((item) => (
                <>
                  <li
                    className={
                      questionNumber === item.id ? "item active" : "item"
                    }
                  >
                    <h5 className="amount">{item.amount}</h5>
                  </li>
                </>
              ))}
            </MDBListGroup>
          </MDBCol>
        </MDBRow>
      )}
    </div>
  );
}

export default App;
