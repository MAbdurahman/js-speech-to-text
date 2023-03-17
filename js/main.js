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
   * @description - clears the result speech textfield and disables the download_button
   */
  function clearTextField () {
    result_text.innerHTML = '';
    download_button.disabled = true;
    
  }//end of the clearTextField function
  
  /**
   * @description - creates file, add innerText to the file, and configure for its ability to
   * be downloaded.
   */
  function downloadText () {
    const text = result_text.innerText;
    const filename = 'speechToText.txt';
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    
    document.body.removeChild(element);
    
  
  }// end of the downloadText function
  
  function startOrStopRecording () {
    if (!isRecording) {
      speechToText();
      isRecording = true;
      
    } else {
      stopRecording();
      isRecording = false;
    }
  }; //end of the startOrStopRecording function
  
  /**
   * @description -
   */
  function speechToText () {
    
    if (result_text.innerHTML.length > 0) {
      clearTextField();
      
    } else {
      const interim = document.createElement('p');
      interim.classList.add('interim');
      result_text.appendChild(interim);
      
    }
    
    try {
      
      recognition = new SpeechRecognition();
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
          if (result_text.querySelector('p.interim')) {
            result_text.querySelector("p.interim").remove();
          }
          
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
      
      recognition.onspeechend = () => {
        speechToText();
      };
      
      recognition.onerror = (e) => {
        stopRecording();
        if (e.error === 'no-speech') {
          alert('No speech was detected. Stopping...');
          
        } else if (e.error === 'audio-capture') {
          alert('No microphone was found. Ensure that a microphone is installed.');
          
        } else if (e.error === 'not-allowed') {
          alert('Permission to use microphone is blocked.');
          
        } else if (e.error === 'aborted') {
          alert('Listening Stopped.');
          
        } else {
          alert('Error occurred in recognition: ' + e.error);
          
        }
      };
      
    } catch (error) {
      isRecording = false;
      console.log(error);
    }
    
  }//end of the speechToText function
  
  /**
   * @description - stops SpeechRecognition, sets the innerHTML to the original text, removes
   * the recording class, and set isRecording to false.
   */
  function stopRecording () {
    recognition.stop();
    record_button.querySelector('.btn-text').innerHTML = 'Start Listening';
    record_button.classList.remove('recording');
    isRecording = false;
    
  }//end of the stopRecording function
  
  clear_button.addEventListener('click', clearTextField);
  download_button.addEventListener('click', downloadText);
  record_button.addEventListener('click', startOrStopRecording);
  
});