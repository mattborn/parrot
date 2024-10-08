const activityLog = document.getElementById("activityLog");
const listeningIndicator = document.getElementById("listeningIndicator");

let recognition;
let lastErrorTime = 0;
const errorCooldown = 5000; // 5 seconds cooldown between error messages
let isRecognitionActive = false;

function addLogEntry(text, type = "status") {
  const entry = document.createElement("div");
  entry.classList.add("log-entry", type);
  entry.textContent = text;
  activityLog.appendChild(entry);
  activityLog.scrollTop = activityLog.scrollHeight;
}

function handleError(error) {
  const now = Date.now();
  if (error === "no-speech") {
    // Silently restart recognition for no-speech error
    restartRecognition();
  } else if (now - lastErrorTime > errorCooldown) {
    console.error("Speech recognition error:", error);
    addLogEntry(`Error: ${error}. Please refresh the page if this persists.`);
    lastErrorTime = now;

    if (error === "not-allowed") {
      listeningIndicator.style.display = "none";
      stopRecognition();
    } else {
      restartRecognition();
    }
  }
}

function stopRecognition() {
  if (isRecognitionActive) {
    isRecognitionActive = false;
    recognition.stop();
    addLogEntry("Listening stopped");
  }
}

function startRecognition() {
  if (!isRecognitionActive) {
    try {
      isRecognitionActive = true;
      recognition.start();
      addLogEntry("Listening started");
    } catch (e) {
      console.error("Failed to start recognition:", e);
      isRecognitionActive = false;
      addLogEntry("Failed to start listening");
    }
  }
}

function restartRecognition() {
  stopRecognition();
  setTimeout(startRecognition, 1000);
}

function initializeSpeechRecognition() {
  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      listeningIndicator.style.display = "block";
      isRecognitionActive = true;
    };

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;

      if (result.isFinal) {
        addLogEntry(transcript, "transcript");
        speakText(transcript);
      }
    };

    recognition.onerror = (event) => handleError(event.error);

    recognition.onend = () => {
      isRecognitionActive = false;
      // Attempt to restart recognition unless it was stopped due to a critical error
      if (listeningIndicator.style.display !== "none") {
        restartRecognition();
      }
    };

    // Start recognition
    startRecognition();
  } else {
    console.error("Speech recognition not supported");
    addLogEntry("Speech recognition is not supported in this browser.");
    listeningIndicator.style.display = "none";
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
    if (recognition && listeningIndicator.style.display !== "none") {
      restartRecognition();
    }
  } else {
    if (recognition) {
      stopRecognition();
    }
  }
});
