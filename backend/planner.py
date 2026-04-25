import time

class StudyPlanner:
    def __init__(self):
        self.subjects = ["DSA", "OS", "DBMS"]
        self.durations = [30, 30, 30]  # seconds (use minutes later)
        self.current_index = 0
        self.start_time = time.time()

    def get_current_subject(self):
        elapsed = time.time() - self.start_time

        if elapsed > self.durations[self.current_index]:
            self.current_index = (self.current_index + 1) % len(self.subjects)
            self.start_time = time.time()

        return self.subjects[self.current_index]