/*
Using JavaScript in your browser only, you will listen for the form's submit event; when the form is submitted, you will:
-Get the value of the input text element.  
-You should be expecting a variable number of arrays typed into the input separated by commas:  For example: [3,0,1,2,4], [1,2,8,15], [6,3,10,25,29]
-All array elements should be whole numbers (negative and 0 are allowed), no decimals. 
-Each array should have at least one element that is a whole number (negative and 0 are allowed), no decimals. 
-You can ignore any extra commas for example, inputting: [3,0,1,2,4], [1,2,8,15], [6,3,10,25,29], 
-There should be at least one array inputted. 
-You will then return a single array that has all the values from the arrays inputted sorted from lowest to highest number.  For example:  If our input was: [3,0,1,2,4], [1,2,8,15], [6,3,10,25,29] You would return:  [0,1,1,2,2,3,3,4,6,8,10,15,25,29]
-Add a list item to the #results list of result of the sort you have just completed. You will alternate the class for each list item using the classes is-green and is-red (described below), starting with is-green first.
-If the user does not have a value for the input when they submit, you should not continue processing and instead should inform them of an error somehow.
*/

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

const isValid = (array) => {
  for (let i = 0; i < array.length; i++) {
    if (!shouldExist(array[i])) {
      return false;
    }
  }
  leftCount = 0;
  rightCount = 0;
  hasComma = false;
  seenNumber = false;
  inBracket = false;

  for (let i = 0; i < array.length; i++) {
    if (array[i] == '[') {
      if (inBracket) return false;
      inBracket = true;
      leftCount++;
    } else if (array[i] == ']') {
      if (!inBracket) return false;
      inBracket = false;
      rightCount++;
    } else if (array[i] == ',') {
      if (hasComma) return false;
      hasComma = true
    } else if (isNumber(array[i])) {
      if (!inBracket) return false;
      hasComma = false;
      seenNumber = true
    }
  }
  return leftCount == rightCount && seenNumber && leftCount > 0;
}

const shouldExist = (character) => {
  return isNumber(character) || character == ' ' || character == ',' || character == '[' || character == ']' || character == '-'
}

const combineArray = (arrays) => {
    let result = [];
    let process = ""
    for (let i = 0; i < arrays.length; i++) {
        if (isNumber(arrays[i]) || arrays[i] == ',' || arrays[i] == '-') {
            process += arrays[i];
        }
    }
    let part = process.split(',');
    for (let i = 0; i < part.length; i++) {
        if (part[i] == '') continue;
        let section = ""
        for (let j = 0; j < part[i].length; j++) {
            if (part[i][j] != ',') section += part[i][j]
        }
        result.push(section);
    }
    return result;
}

const sortArray = (array) => {
    array.sort(function(a, b){return a-b});
    return array;
}

const isNumber = (char) => {
    return char >= "0" && char <= "9";
};

