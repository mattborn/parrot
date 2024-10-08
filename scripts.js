const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const output = document.getElementById("output");

let recognition;
let isListening = false;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

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
  };
} else {
  console.error("Speech recognition not supported");
  startButton.disabled = true;
  stopButton.disabled = true;
  output.textContent = "Speech recognition is not supported in this browser.";
}

startButton.addEventListener("click", () => {
  if (!isListening) {
    recognition.start();
    isListening = true;
    startButton.disabled = true;
    stopButton.disabled = false;
  }
});

stopButton.addEventListener("click", () => {
  if (isListening) {
    recognition.stop();
    isListening = false;
    startButton.disabled = false;
    stopButton.disabled = true;
  }
});

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}
