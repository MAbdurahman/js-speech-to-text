
/* ============================================
            preloader
===============================================*/
$(window).on('load', function () {
  // makes sure that whole site is loaded
  $('#preloader-gif, #preloader').fadeOut(3000, function () {});
});





$(document).ready(function () {
  //**************** variables ****************//
  const input_language = document.querySelector("#language");
  const clear_button = document.querySelector("#clear-button");
  const download_button = document.querySelector("#download-button");
  const record_button = document.querySelector("#record-button");
  
  let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recording = false;
  let recognition;
  
  
  /**
   * @description - populates the languages from data/languages.js to the select option
   */
  function populateLanguages () {
    languages.forEach((language) => {
      const option = document.createElement("option");
      option.value = language.code;
      option.innerHTML = language.name;
      input_language.appendChild(option);
    });
    
  }// end of populateLanguages function
  
  /**
   * @description -
   */
  function clearTextField() {
  
  }//end of the clearTextField function
  
  /**
   * @description -
   */
  function downloadText() {
  
  }// end of the downloadText function
  
  function startOrStopRecording() {}
  
  /**
   * @description -
   */
  function speechToText() {
  
  }//end of the speechToText function
  
  /**
   * @description -
   */
  function stopRecording() {
  
  }//end of the stopRecording function
  
  populateLanguages();
  
  
  clear_button.addEventListener('click', clearTextField);
  download_button.addEventListener('click', downloadText);
  record_button.addEventListener('click', startOrStopRecording);
  
});