class StudyPlanner:
    def __init__(self):
        self.subjects = []
        self.index = 0
        self.durations = {}
        self.time_left = 0

        self.current_day = 1
        self.total_days = 0
        self.day_completed = False

    def set_subjects(self, subjects, weak, days):
        self.subjects = [s.strip() for s in subjects if s.strip()]
        self.index = 0

        self.current_day = 1
        self.total_days = int(days)
        self.day_completed = False

        self.durations = {}

        for sub in self.subjects:
            if sub in weak:
                self.durations[sub] = 120   # weak subject
            else:
                self.durations[sub] = 60

        if self.subjects:
            self.time_left = self.durations[self.subjects[0]] + 2

    def get_current_subject(self, status):
        if not self.subjects:
            return "No Subject", 0

        current = self.subjects[self.index]

        # 🛑 STOP if day completed
        if self.day_completed:
            return current, 0

        # NORMAL TIMER
        if status == "Focused" and self.time_left > 0:
            self.time_left -= 2

        if self.time_left <= 0:
            self.time_left = 0

        return current, self.time_left

    def complete_current_subject(self):
        if not self.subjects:
            return

        # 🛑 LAST SUBJECT → END DAY
        if self.index == len(self.subjects) - 1:
            self.day_completed = True
            self.time_left = 0   # stop timer
            return

        # NEXT SUBJECT
        self.index += 1
        current = self.subjects[self.index]

        self.time_left = self.durations[current] + 2

    def extend_current_subject(self, extra_time):
        if not self.subjects:
            return

        current = self.subjects[self.index]
        self.durations[current] += extra_time + 2
        self.time_left += extra_time

    def next_day(self):
        if self.current_day < self.total_days:
            self.current_day += 1
            self.index = 0
            self.day_completed = False

            if self.subjects:
                current = self.subjects[self.index]

                self.time_left = self.durations[current] + 2