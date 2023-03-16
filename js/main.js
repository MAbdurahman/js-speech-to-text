





$(document).ready(function () {
  //**************** variables ****************//
  const input_language = document.querySelector("#language");
  
  
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
  
  populateLanguages();
  
});