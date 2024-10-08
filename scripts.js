const output = document.getElementById("output");
const status = document.getElementById("status");

let recognition;

function initializeSpeechRecognition() {
  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      status.textContent = "Listening...";
    };

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      output.textContent = transcript;

      if (result.isFinal) {
        speakText(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      status.textContent = "Error occurred. Please refresh the page.";
    };

    recognition.onend = () => {
      // Restart recognition if it ends
      recognition.start();
    };

    // Start recognition
    recognition.start();
  } else {
    console.error("Speech recognition not supported");
    status.textContent = "Speech recognition is not supported in this browser.";
  }
}

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

// Initialize speech recognition when the page loads
document.addEventListener("DOMContentLoaded", initializeSpeechRecognition);

// Handle visibility change to restart recognition when the tab becomes active
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    if (recognition) {
      recognition.start();
    }
  } else {
    if (recognition) {
      recognition.stop();
    }
  }
});
