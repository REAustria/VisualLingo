//const URL = "https://teachablemachine.withgoogle.com/models/LDyyvxYvk/";
const URL = "https://teachablemachine.withgoogle.com/models/tlion5YE2/";
let model, webcam, ctx, labelContainer, maxPredictions;


let extensionEnabled = true;

// Retrieve the extension status from storage
chrome.storage.local.get('extensionEnabled', ({ extensionEnabled: storedExtensionEnabled }) => {
  if (storedExtensionEnabled !== undefined) {
    extensionEnabled = storedExtensionEnabled;
  } else {
    extensionEnabled = false
  }
  updateCore();
});




// // Function to handle changes in the extension status
// function handleExtensionStatusChange(changes) {
//   if (changes.extensionEnabled) {
//     extensionEnabled = changes.extensionEnabled.newValue;
//     updateCore();
//   }
// }

// Add an event listener for changes in chrome.storage.local
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.extensionEnabled) {
    extensionEnabled = changes.extensionEnabled.newValue;
    // Perform actions based on the new value of extensionEnable
    updateCore();
  }
});


function updateCore() {
  // Implement the logic to enable or disable the functionality based on the extensionEnabled value
  if (extensionEnabled) {
    // Enable the functionality
    console.log('Enabling core.js functionality...');
    init(true);
  } else {
    // Disable the functionality
    console.log('Disabling core.js functionality...');
    init(false);
  }
}
var speaker = new SpeechSynthesisUtterance();

function speakTheWord(word, probability) {
  speaker.rate = 0.5
  speaker.voice
  if (probability >= 1) {
    console.log("Speaking the " + word);
    speaker.text = word;
    window.speechSynthesis.speak(speaker);
    speaker.onend = (event) => {
      window.speechSynthesis.cancel();
    }
  }
}

// Use a flag to track if the audio is playing
var isAudioPlaying = false;

function playSound(audio) {
  audio.play();

  // Add a listener to check when the audio is finished playing
  audio.addEventListener('ended', function () {
    isAudioPlaying = false; // Reset the flag when the audio finishes playing
    console.log('Audio has finished playing.');
  });

  isAudioPlaying = true; // Set the flag when the audio starts playing
}

// You might also want to add a pause function if needed
function pauseSound(audio) {
  if (isAudioPlaying) {
    audio.pause();
    console.log('Audio paused.');
    isAudioPlaying = false;
  } else {
    console.log('No audio is currently playing.');
  }
}

function playTheWord(word, probability) {
  if (probability >= 1) {
    console.log("Playing the " + word);
    if (!isAudioPlaying) {
      playSound(audio);
    }
  }
}


const webcamContainer = document.createElement("div");
webcamContainer.id = "webcam-container";
document.body.appendChild(webcamContainer);

async function init(isEnable) {

  const size = 200;
  const flip = true; // whether to flip the webcam
  webcam = new tmPose.Webcam(size, size, flip); // width, height, flip

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmPose.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  if (isEnable) {
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append/get elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    console.log('Initializing hand detection feature...')
  } else {
    console.log('Disabling hand detection feature...')
    window.requestAnimationFrame(loop);
  }

}

async function loop(timestamp) {
  webcam.update(); // update the webcam frame
  if (extensionEnabled) {
    debounce(await predict(), 10000);
  }
  window.requestAnimationFrame(loop);
}



const debounce = (func, delay) => {
  let debounceTimer
  return function () {
    const context = this
    const args = arguments
    clearTimeout(debounceTimer)
    debounceTimer
      = setTimeout(() => func.apply(context, args), delay)
  }
}

/// Handler of current Audio
let audio


async function predict() {
  const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
  const prediction = await model.predict(posenetOutput);
  var predictionsArray = prediction.map(function (o, i) {
    return { probability: o.probability.toFixed(2), event: o.className }
  })

  var i;
  var minProbability = predictionsArray[0].probability
  var maxProbability = predictionsArray[0].probability
  var event = predictionsArray[0].className;
  var value;
  for (i = 1; i < predictionsArray.length; i++) {
    value = predictionsArray[i].probability
    if (value < minProbability) minProbability = value;
    if (value > maxProbability) maxProbability = value;
  }
  const index = predictionsArray.findIndex((list) => {
    return list.probability == maxProbability;
  })
  event = predictionsArray[index].event;


  if ('speechSynthesis' in window) {
    // Speech Synthesis supported 🎉
    if (event === "Default") {
      // let word = "Default";
      // // console.log("Probability of " + word + " = " + maxProbability);
      // // debounce(speakTheWord("", maxProbability), 3000);
    } else if (event === "Saan") {
      audio = new Audio(chrome.runtime.getURL("src/words/saan.mp3"));
      let word = "Saan";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else if (event === "Tayo") {
      audio = new Audio(chrome.runtime.getURL("src/words/tayo.mp3"));
      let word = "Tayo";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else if (event === "Mamaya") {
      audio = new Audio(chrome.runtime.getURL("src/words/Mamaya.mp3"));
      let word = "Mamaya";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else if (event === "Magkita") {
      audio = new Audio(chrome.runtime.getURL("src/words/magkita.mp3"));
      let word = "Magkita";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else if (event === "Ikaw") {
      audio = new Audio(chrome.runtime.getURL("src/words/ikaw.mp3"));
      let word = "Ikaw";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else if (event === "Bahala") {
      audio = new Audio(chrome.runtime.getURL("src/words/bahala.mp3"));
      let word = "Bahala";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else if (event === "Magandang Tanghali") {
      audio = new Audio(chrome.runtime.getURL("src/words/magandang_tanghali.mp3"));
      let word = "Magandang Tanghali";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else if (event === "Pupunta") {
      audio = new Audio(chrome.runtime.getURL("src/words/pupunta.mp3"));
      let word = "Pupunta";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else if (event === "Kumusta") {
      audio = new Audio(chrome.runtime.getURL("src/words/opus format/kumusta.opus"));
      let word = "Kumusta";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else {
      // No word matched 😣
      // Don't play anything
    }
  }
}

