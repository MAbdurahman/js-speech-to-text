/* ============================================
            preloader
===============================================*/
$(window).on('load', function () {
  // makes sure that whole site is loaded
  $('#preloader-gif, #preloader').fadeOut(3000, function () {});
});

$(document).ready(function () {
  //**************** variables ****************//
  const input_language = document.querySelector('#language');
  const clear_button = document.querySelector('#clear-button');
  const download_button = document.querySelector('#download-button');
  const record_button = document.querySelector('#record-button');
  const result_text = document.querySelector('#result-text');
  
  let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let isRecording = false;
  let recognition;
  
  /**
   * @description - populates the languages from data/languages.js to the select option
   */
  function populateLanguages () {
    languages.forEach((lang) => {
      const option = document.createElement('option');
      option.value = lang.code;
      option.innerHTML = lang.name;
      input_language.appendChild(option);
    });
    
  }// end of populateLanguages function
  populateLanguages();
  
  /**
   * @description - creates the interim paragraph and adds to result text
   */
  function addInterimParagraph () {
    const interim = document.createElement('p');
    interim.classList.add('interim');
    interim.setAttribute('spellcheck', false);
    interim.setAttribute('contentEditable', 'true');
    interim.dataset.placeholder = 'Text will be displayed here';
    result_text.appendChild(interim);
    
  }// end of addInterimParagraph function
  /**
   * @description - clears the result speech textfield, disables the download_button, and
   * sets to original settings
   */
  function clearTextField () {
    if (document.querySelector('p.interim')) {
      swal('Invalid Entry', 'Message is already empty!', 'error');
      return;
      
    } else if (result_text.innerHTML.length <= 0) {
      swal('Invalid Entry', 'Message is already empty!', 'error');
      return;
      
    } else {
      result_text.innerHTML = '';
      addInterimParagraph();
      download_button.disabled = true;
      
    }
    
  }//end of the clearTextField function
  
  /**
   * @description - creates file, add innerText to the file, and configure for its ability to
   * be downloaded.
   */
  function downloadText () {
    const text = result_text.innerText;
    const filename = 'speechToText.txt';
    
    const element = document.createElement('a');
    element.href = `https://js-speech-to-text.netlify.app/${filename}`;
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    
    document.body.removeChild(element);
    
  }// end of the downloadText function
  
  /**
   * @description - starts or stops the recording
   */
  function startOrStopRecording () {
    if (!isRecording) {
      speechToText();
      isRecording = true;
      swal('SpeechRecognition Started', 'SpeechRecognition successfully started.', 'info');
      
      
    } else {
      stopRecording();
      
    }
  }; //end of the startOrStopRecording function
  
  /**
   * @description - the workhorse of the program; in that, it initializes the SpeechRecognition and
   * utilizes many of the listeners of the SpeechRecognition (onresult, onspeechend, and onerror).
   */
  function speechToText () {
    
    try {
      recognition = new SpeechRecognition();
  
      /**
       * If recognition.continuous = false, the recording will stop after a few seconds of
       * silence.  When it is true, the silence period can be longer (about 15 seconds).  Thus,
       * allowing SpeechRecognition to continue recording, even when the speaker pauses.
       */
      recognition.continuous = true;
      recognition.lang = input_language.value;
      recognition.interimResults = true;
      
      record_button.classList.add('recording');
      record_button.querySelector('.btn-text').innerHTML = 'Listening...';
      
      recognition.start();
      
      recognition.onresult = (e) => {
        const speech_results = e.results[0][0].transcript;
        
        // detect when interim results
        if (e.results[0].isFinal) {
          result_text.innerHTML += ' ' + speech_results;
          result_text.querySelector('p.interim').remove();
          
        } else {
          // if paragraph tag does not exist, create it with class interim
          if (!document.querySelector('.interim')) {
            const interim = document.createElement('p');
            interim.classList.add('interim');
            result_text.appendChild(interim);
            
          }
          //update the interim p with the speech result
          document.querySelector('.interim').innerHTML = ' ' + speech_results;
        }
        download_button.disabled = false;
      };
      
/*      recognition.onspeechend = () => {
        speechToText();
      };*/
  
      recognition.onspeechend = function () {
        if (isRecording === true) {
          swal('Speech Recognition Terminated', 'Terminates, when silence for 15 seconds.', 'info');
        }
    
      }; //end of onspeechend function
      recognition.onerror = (e) => {
        stopRecording();
        if (e.error === 'no-speech') {
          swal('No Speech!', 'No speech was detected. Stopping...', 'error');
          
        } else if (e.error === 'audio-capture') {
          swal('No Microphone Found!', 'Ensure that a microphone is installed', 'error');
          
        } else if (e.error === 'not-allowed') {
          swal('Permission Denied!', 'Permission to use microphone is blocked.', 'error');
          
        } else if (e.error === 'aborted') {
          swal('Speech Recognition Aborted!', 'Speech Recognition has stopped listening.', 'error');
          
        } else {
          swal('Speech Recognition Failed!', 'Error ' + e.error, 'error');
          
        }
      };
      
    } catch (error) {
      isRecording = false;
      swal('Error: ' + error.message, 'error');
      
    }
    
  };//end of the speechToText function
  
  /**
   * @description - stops SpeechRecognition, sets the innerHTML to the original text, removes
   * the recording class, and set isRecording to false.
   */
  function stopRecording () {
    recognition.stop();
    swal('SpeechRecognition Stopped', 'SpeechRecognition successfully stopped.', 'info');
    record_button.querySelector('.btn-text').innerHTML = 'Start Listening';
    record_button.classList.remove('recording');
    isRecording = false;
    
  }//end of the stopRecording function
  
  /*=============================================
          adding event listeners
  ================================================*/
  clear_button.addEventListener('click', clearTextField);
  download_button.addEventListener('click', downloadText);
  record_button.addEventListener('click', startOrStopRecording);
  
});