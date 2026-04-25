from planner import StudyPlanner
import time

planner = StudyPlanner()

while True:
    subject = planner.get_current_subject()
    print("Study:", subject)
    time.sleep(2)