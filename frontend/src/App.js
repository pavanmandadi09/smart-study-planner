import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState({});
  const [subjects, setSubjects] = useState("");
  const [weakSubjects, setWeakSubjects] = useState("");
  const [days, setDays] = useState("");
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:5000/status")
        .then(res => res.json())
        .then(data => setData(data))
        .catch(() => console.log("Backend not running"));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  //  Generate Plan Function
  const generatePlan = () => {
    fetch("http://127.0.0.1:5000/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        subjects: subjects.split(","),
        weak: weakSubjects.split(","),
        days: days
      })
    })
      .then(res => res.json())
      .then(data => setTimetable(data));
  };

  return (
    <div style={{
      textAlign: "center",
      marginTop: "30px",
      fontFamily: "Arial",
      backgroundColor: "#121212",
      color: "white",
      minHeight: "100vh"
    }}>
      <h1>📚 Smart Study Planner</h1>

      {/*  INPUT SECTION */}
      <div style={{ marginBottom: "30px" }}>
        <input
          placeholder="Subjects (e.g. DSA, OS, DBMS)"
          onChange={(e) => setSubjects(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Weak Subjects (e.g. DSA)"
          onChange={(e) => setWeakSubjects(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Days Left"
          onChange={(e) => setDays(e.target.value)}
        />
        <br /><br />

        <button onClick={generatePlan}>
          Generate Study Plan
        </button>
      </div>

      {/*  LIVE AI CARD */}
      <div style={{
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#1e1e1e",
        width: "300px",
        margin: "auto"
      }}>
        <h2>Status: {data.status}</h2>
        <h2>Subject: {data.subject}</h2>
        <h2>Time Left: {data.time_left}s</h2>
        <h2>Total Focus Time: {data.focus_time}s</h2>

        {/* Progress Bar */}
        <div style={{
          width: "100%",
          margin: "10px 0",
          background: "#444",
          borderRadius: "10px"
        }}>
          <div style={{
            width: `${data.time_left ? (data.time_left / 20) * 100 : 0}%`,
            height: "10px",
            background: "lightgreen",
            borderRadius: "10px"
          }}></div>
        </div>

        <h2 style={{
          color: data.status === "Focused" ? "lightgreen" : "red"
        }}>
          {data.message}
        </h2>
      </div>

      {/*  STUDY PLAN DISPLAY */}
      <div style={{ marginTop: "40px" }}>
        <h2>📅 Generated Study Plan</h2>

        {timetable.map((day, index) => (
          <div key={index} style={{
            background: "#1e1e1e",
            margin: "10px auto",
            padding: "10px",
            width: "300px",
            borderRadius: "10px"
          }}>
            <h3>Day {day.day}</h3>
            <ul>
              {day.schedule.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;