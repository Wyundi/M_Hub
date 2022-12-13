let myForm = document.getElementById('myForm');
let textInput = document.getElementById('text_input');
let errorDiv = document.getElementById('error');
let myUl = document.getElementById('results');
let frmLabel = document.getElementById('formLabel');
let counter = 0;

if (myForm) {
  myForm.addEventListener('submit', (event) => {
    console.log('Form submission fired');
    event.preventDefault();
    console.log('Has a form');
    if (isValid(textInput.value.trim())) {
      const combinedArray = combineArray(textInput.value);
      let sortedArray = sortArray(combinedArray);
      let li = document.createElement('li');
      li.innerHTML = "[" + sortedArray + "]";
      if (counter % 2 == 0) {
        li.classList.add('is-green')
      } else {
        li.classList.add('is-red')
      }
      counter++;
      myUl.appendChild(li);
      errorDiv.hidden = true;
    } else {
      // textInput.value = '';
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'You must enter a valid input';
      textInput.focus();
      textInput.className = 'inputClass';
    }
  });
}