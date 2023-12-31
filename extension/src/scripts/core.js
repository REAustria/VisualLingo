const URL = "https://teachablemachine.withgoogle.com/models/W-0kC6yKL/";
const URL2 = "https://teachablemachine.withgoogle.com/models/3s8hwgKSS/";
let model, webcam, ctx, labelContainer, maxPredictions;


let extensionEnabled = true;

updateCore();

// Function to handle changes in the extension status
function handleExtensionStatusChange(changes) {
  if (changes.extensionEnabled) {
    extensionEnabled = changes.extensionEnabled.newValue;
    updateCore();
  }
}

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

function debounce(func, delay) {
  let timerId;
  
  return function() {
    const context = this;
    const args = arguments;
    
    clearTimeout(timerId);
    
    timerId = setTimeout(function() {
      func.apply(context, args);
    }, delay);
  };
}

var speaker = new SpeechSynthesisUtterance();

function speakTheWord(word, probability){

    if(probability >= 1){
        console.log("Speaking the "+word);
        speaker.text = word;
        window.speechSynthesis.speak(speaker);
        speaker.onend = (event)=>{
          window.speechSynthesis.cancel();
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
    const modelURL2 = URL2 + "model.json";
    const metadataURL2 = URL2 + "metadata.json";


    model = await tmPose.load(modelURL, metadataURL, modelURL2, metadataURL2);
    maxPredictions = model.getTotalClasses();


    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append/get elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    if(isEnable){
      console.log('Initializing hand detection feature...')
    }else{
      console.log('Disabling hand detection feature...')
      window.requestAnimationFrame(loop);
    }
   
}

async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    if(extensionEnabled){
      await predict();
    }
    window.requestAnimationFrame(loop);
}


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

      //  ADD EVENT HERE!!!
      if (event === "Default") {
        let word = "Default";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord("", maxProbability),3000);
      }else if ( event === "Ako"){
        let word = "Ako";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "I Don't Know"){
        let word = "I Don't Know";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Mama"){
        let word = "Mama";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Papa"){
        let word = "Papa";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "I Don't Understand"){
        let word = "I Don't Understand";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Family"){
        let word = "Family";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Bakit"){
        let word = "Bakit";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "LGBTQ"){
        let word = "LGBTQ";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Kanila"){
        let word = "Kanila";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Salamat"){
        let word = "Salamat";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Bible"){
        let word = "Bible";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Problem"){
        let word = "Problem";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Relate"){
        let word = "Relate";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Hindi"){
        let word = "Hindi";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Matanggap"){
        let word = "Matanggap";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "How"){
        let word = "How";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Paliwanag"){
        let word = "Paliwanag";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Anak"){
        let word = "Anak";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Pagmamahal"){
        let word = "Pagmamahal";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Huli"){
        let word = "Huli";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else if ( event === "Payo"){
        let word = "Payo";
        console.log("Probability of "+ word + " = "+ maxProbability);
        debounce(speakTheWord(word, maxProbability),3000);
      }else{
        // Speech Synthesis Not Supported 😣
        alert("Sorry, your browser doesn't support text to speech!");
      }
}






}
