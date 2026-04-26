import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://127.0.0.1:5000/status")
        .then(res => res.json())
        .then(data => setData(data));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Smart Study Planner</h1>
      <h2>Status: {data.status}</h2>
      <h2>Subject: {data.subject}</h2>
      <h2>Time Left: {data.time_left}s</h2>
      <h2>{data.message}</h2>
    </div>
  );
}

export default App;