from flask import Flask, jsonify
from flask_cors import CORS  
from focus_detection import FocusDetector
from planner import StudyPlanner


app = Flask(__name__)
CORS(app) 

focus = FocusDetector()
planner = StudyPlanner()

@app.route("/status")
def get_status():
    status = focus.get_focus_status()
    subject, remaining = planner.get_current_subject()

    if status == "Focused":
        message = f"Study {subject}"
    else:
        message = "Pay Attention!"

    return jsonify({
        "status": status,
        "subject": subject,
        "time_left": remaining,
        "message": message
    })


if __name__ == "__main__":
    app.run(debug=True)


@app.route("/")
def home():
    return "Smart Study Planner API Running"
