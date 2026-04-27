from flask import Flask, jsonify, request
from flask_cors import CORS
from focus_detection import FocusDetector
from planner import StudyPlanner

app = Flask(__name__)
CORS(app)

focus = FocusDetector()
planner = StudyPlanner()

# HOME
@app.route("/")
def home():
    return "Smart Study Planner API Running"

# STATUS
@app.route("/status")
def get_status():
    status = focus.get_focus_status()
    subject, remaining = planner.get_current_subject(status)

    return jsonify({
        "status": status,
        "subject": subject,
        "time_left": remaining,
        "message": "Pay Attention!" if status != "Focused" else f"Study {subject}",
        "day": planner.current_day,
        "total_days": planner.total_days,
        "day_completed": planner.day_completed,
        "days_left": planner.total_days - planner.current_day
    })

# PLAN
@app.route("/plan", methods=["POST"])
def create_plan():
    data = request.json

    subjects = data["subjects"]
    weak = data["weak"]
    days = data["days"]

    planner.set_subjects(subjects, weak, days)

    timetable = []
    for d in range(1, int(days) + 1):
        day_schedule = []
        for sub in subjects:
            if sub in weak:
                day_schedule.append(f"{sub}-120s")
            else:
                day_schedule.append(f"{sub}-60s")

        timetable.append({
            "day": d,
            "schedule": day_schedule
        })

    return jsonify(timetable)

# COMPLETE
@app.route("/complete", methods=["POST"])
def complete():
    planner.complete_current_subject()
    return jsonify({"message": "Subject completed"})

# NOT COMPLETE (EXTRA TIME)
@app.route("/not_complete", methods=["POST"])
def not_complete():
    data = request.json
    extra = int(data.get("extra_time", 0))

    planner.extend_current_subject(extra)
    return jsonify({"message": "Extended time"})

# NEXT DAY
@app.route("/next_day", methods=["POST"])
def next_day():
    planner.next_day()
    return jsonify({"message": "Moved to next day"})

if __name__ == "__main__":
    app.run(debug=True)