import time

class StudyPlanner:
    def __init__(self):
        self.subjects = ["DSA", "OS", "DBMS"]
        self.duration = 20  # seconds
        self.current_index = 0
        self.start_time = time.time()

    def get_current_subject(self):
        elapsed = time.time() - self.start_time

        # ✅ First handle subject switching
        if elapsed >= self.duration:
            self.current_index = (self.current_index + 1) % len(self.subjects)
            self.start_time = time.time()
            elapsed = 0  # reset elapsed after switching

        remaining = int(self.duration - elapsed)

        return self.subjects[self.current_index], remaining