const URL = "https://teachablemachine.withgoogle.com/models/1QwFHEeHy/";
const mpHands = new Hands();

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
    /*} else if (event === "Saan") {
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
      let word = "Mag ki ta";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else if (event === "Ikaw") {
      audio = new Audio(chrome.runtime.getURL("src/words/ikaw.mp3"));
      let word = "e-cow";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else if (event === "Bahala") {
      audio = new Audio(chrome.runtime.getURL("src/words/bahala.mp3"));
      let word = "Bahala";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else if (event === "Pupunta") {
      audio = new Audio(chrome.runtime.getURL("src/words/pupunta.mp3"));
      let word = "Pupunta";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else if (event === "Magdala") {
      audio = new Audio(chrome.runtime.getURL("src/words/magdala.mp3"));
      let word = "Magdala";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else if (event === "Pera") {
      audio = new Audio(chrome.runtime.getURL("src/words/pera.mp3"));
      let word = "Pera";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else if (event === "Bawal") {
      audio = new Audio(chrome.runtime.getURL("src/words/bawal.mp3"));
      let word = "Bawal";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    } else if (event === "Mahuli") {
      audio = new Audio(chrome.runtime.getURL("src/words/mahuli.mp3"));
      let word = "Mahuli";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);*/

    }else if (event === "Ahas"){
      audio = new Audio(chrome.runtime.getURL("src/words/Ahas.mp3"));
      let word = "Ahas";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    }else if (event === "Ahit"){
      audio = new Audio(chrome.runtime.getURL("src/words/Ahit.mp3"));
      let word = "Ahit";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    }else if (event === "Apat"){
      audio = new Audio(chrome.runtime.getURL("src/words/Apat.mp3"));
      let word = "Apat";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    }else if (event === "Bahala"){
      audio = new Audio(chrome.runtime.getURL("src/words/Bahala.mp3"));
      let word = "Bahala";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Baril"){
      audio = new Audio(chrome.runtime.getURL("src/words/Baril.mp3"));
      let word = "Baril";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Basura"){
      audio = new Audio(chrome.runtime.getURL("src/words/Basura.mp3"));
      let word = "Basura";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    }else if (event === "Bitamina"){
      audio = new Audio(chrome.runtime.getURL("src/words/Bitamina.mp3"));
      let word = "Bitamina";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Buntot"){
      audio = new Audio(chrome.runtime.getURL("src/words/Buntot.mp3"));
      let word = "Buntot";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    }else if (event === "Dyaryo"){
      audio = new Audio(chrome.runtime.getURL("src/words/Dyaryo.mp3"));
      let word = "Dyaryo";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    }else if (event === "Eroplano"){
      audio = new Audio(chrome.runtime.getURL("src/words/Eroplano.mp3"));
      let word = "Eroplano";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    }else if (event === "Gabi"){
      audio = new Audio(chrome.runtime.getURL("src/words/Gabi.mp3"));
      let word = "Gabi";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);    
    }else if (event === "Gatas"){
      audio = new Audio(chrome.runtime.getURL("src/words/Gatas.mp3"));
      let word = "Gatas";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);   
    }else if (event === "Gunting"){
      audio = new Audio(chrome.runtime.getURL("src/words/Gunting.mp3"));
      let word = "Gunting";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Habol"){
      audio = new Audio(chrome.runtime.getURL("src/words/Habol.mp3"));
      let word = "Habol";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    }else if (event === "Hila"){
      audio = new Audio(chrome.runtime.getURL("src/words/Hila.mp3"));
      let word = "Hila";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);    
    }else if (event === "Hindi"){
      audio = new Audio(chrome.runtime.getURL("src/words/Hindi.mp3"));
      let word = "Hindi";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Hiram"){
      audio = new Audio(chrome.runtime.getURL("src/words/Hiram.mp3"));
      let word = "Hiram";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Ikaw"){
      audio = new Audio(chrome.runtime.getURL("src/words/Ikaw.mp3"));
      let word = "Ikaw";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Ilalim"){
      audio = new Audio(chrome.runtime.getURL("src/words/Ilalim.mp3"));
      let word = "Ilalim";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Inom"){
      audio = new Audio(chrome.runtime.getURL("src/words/Inom.mp3"));
      let word = "Inom";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Intindi"){
      audio = new Audio(chrome.runtime.getURL("src/words/Intindi.mp3"));
      let word = "Intindi";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Iyak"){
      audio = new Audio(chrome.runtime.getURL("src/words/Iyak.mp3"));
      let word = "Iyak";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000); 
    }else if (event === "Kahapon"){
      audio = new Audio(chrome.runtime.getURL("src/words/Kahapon.mp3"));
      let word = "Kahapon";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);   
    }else if (event === "Kaunti"){
      audio = new Audio(chrome.runtime.getURL("src/words/Kaunti.mp3"));
      let word = "Kaunti";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000); 
    }else if (event === "Konsepto"){
      audio = new Audio(chrome.runtime.getURL("src/words/Konsepto.mp3"));
      let word = "Konsepto";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);   
    }else if (event === "Kulot"){
      audio = new Audio(chrome.runtime.getURL("src/words/Kulot.mp3"));
      let word = "Kulot";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Libro"){
      audio = new Audio(chrome.runtime.getURL("src/words/Libro.mp3"));
      let word = "Libro";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Limang Dolyar"){
      audio = new Audio(chrome.runtime.getURL("src/words/Limang_Dolyar.mp3"));
      let word = "Limang Dolyar";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000); 
    }else if (event === "Lungkot"){
      audio = new Audio(chrome.runtime.getURL("src/words/Lungkot.mp3"));
      let word = "Lungkot";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Magandang Tanghali"){
      audio = new Audio(chrome.runtime.getURL("src/words/Magandang_Tanghali.mp3"));
      let word = "Magandang Tanghali";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000); 
    }else if (event === "Magkita"){
      audio = new Audio(chrome.runtime.getURL("src/words/Magkita.mp3"));
      let word = "Magkita";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);    
    }else if (event === "Manika"){
      audio = new Audio(chrome.runtime.getURL("src/words/Manika.mp3"));
      let word = "Manika";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Mansanas"){
      audio = new Audio(chrome.runtime.getURL("src/words/Mansanas.mp3"));
      let word = "Mansanas";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    }else if (event === "Martilyo"){
      audio = new Audio(chrome.runtime.getURL("src/words/Martilyo.mp3"));
      let word = "Martilyo";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Minuto"){
      audio = new Audio(chrome.runtime.getURL("src/words/Minuto.mp3"));
      let word = "Minuto";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Nakakatawa"){
      audio = new Audio(chrome.runtime.getURL("src/words/Nakakatawa.mp3"));
      let word = "Nakakatawa";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Norte"){
      audio = new Audio(chrome.runtime.getURL("src/words/Norte.mp3"));
      let word = "Norte";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Oo"){
      audio = new Audio(chrome.runtime.getURL("src/words/Oo.mp3"));
      let word = "Oo";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Palaka"){
      audio = new Audio(chrome.runtime.getURL("src/words/Palaka.mp3"));
      let word = "Palaka";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    }else if (event === "Para"){
      audio = new Audio(chrome.runtime.getURL("src/words/Para.mp3"));
      let word = "Para";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Pinya"){
      audio = new Audio(chrome.runtime.getURL("src/words/Pinya.mp3"));
      let word = "Pinya";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Programa"){
      audio = new Audio(chrome.runtime.getURL("src/words/Programa.mp3"));
      let word = "Programa";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Puno"){
      audio = new Audio(chrome.runtime.getURL("src/words/Puno.mp3"));
      let word = "Puno";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Pupunta"){
      audio = new Audio(chrome.runtime.getURL("src/words/Pupunta.mp3"));
      let word = "Pupunta";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Radyo"){
      audio = new Audio(chrome.runtime.getURL("src/words/Radyo.mp3"));
      let word = "Radyo";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Saan"){
      audio = new Audio(chrome.runtime.getURL("src/words/Gatas.mp3"));
      let word = "Saan";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    }else if (event === "Saranggola"){
      audio = new Audio(chrome.runtime.getURL("src/words/Saranggola.mp3"));
      let word = "Saranggola";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Sibuyas"){
      audio = new Audio(chrome.runtime.getURL("src/words/Sibuyas.mp3"));
      let word = "Sibuyas";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Sigarilyo"){
      audio = new Audio(chrome.runtime.getURL("src/words/Sigarilyo.mp3"));
      let word = "Sigarilyo";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    }else if (event === "Tanggap"){
      audio = new Audio(chrome.runtime.getURL("src/words/Tanggap.mp3"));
      let word = "Tanggap";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    }else if (event === "Tayo"){
      audio = new Audio(chrome.runtime.getURL("src/words/Tayo.mp3"));
      let word = "Tayo";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    }else if (event === "Tubig"){
      audio = new Audio(chrome.runtime.getURL("src/words/Tubig.mp3"));
      let word = "Tubig";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);
    }else if (event === "Tungkol"){
      audio = new Audio(chrome.runtime.getURL("src/words/Tungkol.mp3"));
      let word = "Tungkol";
      console.log("Probability of " + word + " = " + maxProbability);
      debounce(playTheWord(word, maxProbability), 3000);  
    } else {
      // No word matched 😣
      // Don't play anything
    }
  }
}

