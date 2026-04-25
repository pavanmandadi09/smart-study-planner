from focus_detection import FocusDetector
from planner import StudyPlanner
import time

focus = FocusDetector()
planner = StudyPlanner()

try:
    while True:
        status = focus.get_focus_status()
        subject = planner.get_current_subject()

        if status == "Focused":
            message = f"Study: {subject}"
        else:
            message = "Pay Attention!"

        print(f"{message}")

        time.sleep(1)

except KeyboardInterrupt:
    focus.release()