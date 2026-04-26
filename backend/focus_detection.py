import cv2

class FocusDetector:
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        self.cap = cv2.VideoCapture(0)

    def get_focus_status(self):
        ret, frame = self.cap.read()

        if not ret:
            return "Not Focused"

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)

        cv2.imshow("Focus Detection", frame)
        cv2.waitKey(1)

        return "Focused" if len(faces) > 0 else "Not Focused"

    def release(self):
        self.cap.release()
        cv2.destroyAllWindows()