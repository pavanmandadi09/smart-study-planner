import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState({});
  const [subjects, setSubjects] = useState("");
  const [weakSubjects, setWeakSubjects] = useState("");
  const [days, setDays] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [started, setStarted] = useState(false);
  const [askExtra, setAskExtra] = useState(false);
  const [extraTime, setExtraTime] = useState("");

  const cellStyle = {
    border: "1px solid #444",
    padding: "10px",
    color: "white"
  };

  // RESET askExtra when subject changes
  useEffect(() => {
    setAskExtra(false);
    setExtraTime("");
  }, [data.subject]);

  // FETCH STATUS
  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      fetch("http://127.0.0.1:5000/status")
        .then(res => res.json())
        .then(data => setData(data))
        .catch(() => console.log("Backend not running"));
    }, 2000);

    return () => clearInterval(interval);
  }, [started]);

  // GENERATE PLAN
  const generatePlan = () => {
    fetch("http://127.0.0.1:5000/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        subjects: subjects.split(",").map(s => s.trim()),
        weak: weakSubjects.split(",").map(s => s.trim()),
        days: days
      })
    })
      .then(res => res.json())
      .then(data => {
        setTimetable(data);
        setStarted(true);
      });
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

      {/* INPUT */}
      <div style={{ marginBottom: "30px" }}>
        <input placeholder="Subjects" onChange={(e) => setSubjects(e.target.value)} />
        <br /><br />
        <input placeholder="Weak Subjects" onChange={(e) => setWeakSubjects(e.target.value)} />
        <br /><br />
        <input placeholder="Days Left" onChange={(e) => setDays(e.target.value)} />
        <br /><br />
        <button onClick={generatePlan}>Generate Plan</button>
      </div>

      {started && (
        <>
          {/* LIVE CARD */}
          <div style={{
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#1e1e1e",
            width: "320px",
            margin: "auto"
          }}>
            <h3>Day {data.day} / {data.total_days}</h3>
            <h3>Days Left: {data.days_left}</h3>

            <h2>Status: {data.status}</h2>
            <h2>Subject: {data.subject}</h2>
            <h2>Time Left: {data.time_left}s</h2>

            <h2 style={{
              color: data.status === "Focused" ? "lightgreen" : "red"
            }}>
              {data.message}
            </h2>
          </div>

          {/* EARLY COMPLETE */}
          {data.time_left > 0 && !data.day_completed && (
            <div style={{ marginTop: "10px" }}>
              <button
                style={{
                  padding: "8px",
                  backgroundColor: "#00c853",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
                onClick={() => {
                  fetch("http://127.0.0.1:5000/complete", { method: "POST" });
                }}
              >
                ✅ Mark as Completed
              </button>
            </div>
          )}

          {/* ASK */}
          {data.time_left === 0 && !askExtra && !data.day_completed && (
            <div style={{ marginTop: "20px" }}>
              <h3>Did you complete?</h3>

              <button onClick={() => {
                fetch("http://127.0.0.1:5000/complete", { method: "POST" });
              }}>
                ✅ Completed
              </button>

              <button onClick={() => setAskExtra(true)}>
                ❌ Not Completed
              </button>
            </div>
          )}

          {/* EXTRA TIME */}
          {askExtra && (
            <div style={{ marginTop: "15px" }}>
              <input
                type="number"
                placeholder="Extra time"
                value={extraTime}
                onChange={(e) => setExtraTime(e.target.value)}
              />

              <button
                disabled={!extraTime || extraTime <= 0}
                onClick={() => {
                  fetch("http://127.0.0.1:5000/not_complete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      extra_time: parseInt(extraTime)
                    })
                  });

                  setAskExtra(false);
                  setExtraTime("");
                }}
              >
                Submit
              </button>
            </div>
          )}

          {/* NEXT DAY */}
          {data.day_completed && data.days_left > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h2>✅ Day Completed</h2>
              <h3>See you tomorrow 👋</h3>

              <button
                onClick={() => {
                  fetch("http://127.0.0.1:5000/next_day", { method: "POST" });
                }}
              >
                ▶ Next Day
              </button>
            </div>
          )}

          {/* FINAL */}
          {data.day_completed && data.days_left === 0 && (
            <h2 style={{ marginTop: "20px" }}>
              🎉 All the best for your exams!
            </h2>
          )}

          {/* TABLE */}
          <div style={{ marginTop: "40px" }}>
            <h2>📅 Study Plan</h2>

            <table style={{
              width: "80%",
              margin: "auto",
              borderCollapse: "collapse",
              backgroundColor: "#1e1e1e"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#333" }}>
                  <th style={cellStyle}>Day</th>
                  <th style={cellStyle}>Subject</th>
                  <th style={cellStyle}>Duration</th>
                </tr>
              </thead>

              <tbody>
                {timetable.map((day, index) =>
                  day.schedule.map((item, i) => {
                    const parts = item.split("-");
                    return (
                      <tr key={`${index}-${i}`}>
                        <td style={cellStyle}>{day.day}</td>
                        <td style={cellStyle}>{parts[0]}</td>
                        <td style={cellStyle}>{parts[1]}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default App;