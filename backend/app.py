from focus_detection import FocusDetector
from planner import StudyPlanner
import time

focus = FocusDetector()
planner = StudyPlanner()

try:
    while True:
        status = focus.get_focus_status()
        subject, remaining = planner.get_current_subject()

        if status == "Focused":
            message = f"Study: {subject} | Time left: {remaining}s"
        else:
            message = "Pay Attention!"

        print(f"[{status}] -> {message}")
        time.sleep(2)

except KeyboardInterrupt:
    focus.release()