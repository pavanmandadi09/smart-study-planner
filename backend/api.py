from flask import Flask, jsonify, request
from flask_cors import CORS
from focus_detection import FocusDetector
from planner import StudyPlanner

app = Flask(__name__)
CORS(app)

focus = FocusDetector()
planner = StudyPlanner()

focus_time = 0


#  Home route
@app.route("/")
def home():
    return "Smart Study Planner API Running"


#  Live status (already working)
@app.route("/status")
def get_status():
    global focus_time

    status = focus.get_focus_status()
    subject, remaining = planner.get_current_subject()

    if status == "Focused":
        focus_time += 2

    if status == "Focused":
        message = f"Study {subject}"
    else:
        message = "Pay Attention!"

    return jsonify({
        "status": status,
        "subject": subject,
        "time_left": remaining,
        "message": message,
        "focus_time": focus_time
    })


# Generate Study Plan (AI Logic)
@app.route("/plan", methods=["POST"])
def generate_plan():
    data = request.json

    subjects = [s.strip() for s in data["subjects"]]
    weak = [w.strip() for w in data["weak"]]
    days = int(data["days"])

    plan = []

    for day in range(1, days + 1):
        day_plan = []

        for sub in subjects:
            if sub in weak:
                day_plan.append(f"{sub} - 2 hrs")
            else:
                day_plan.append(f"{sub} - 1 hr")

        plan.append({
            "day": day,
            "schedule": day_plan
        })

    return jsonify(plan)


if __name__ == "__main__":
    app.run(debug=True)