(function ($) {
    // Let's start writing AJAX calls!
    
    console.log("we reached here - start of ajax")
  
    var myNewTaskForm = $('#login_form')

  
    // --------------------------------- below should be deleted after figuring out stuffs
    // function bindEventsToTodoItem(todoItem) {
    //     todoItem.find('.finishItem').on('click', function (event) {
    //       event.preventDefault();
    //       var currentLink = $(this);
    //       var currentId = currentLink.data('id');
    
    //       var requestConfig = {
    //         method: 'POST',
    //         url: '/login'
    //       };
    
    //       $.ajax(requestConfig).then(function (responseMessage) {
    //         var newElement = $(responseMessage);
    //         bindEventsToTodoItem(newElement);
    //         todoItem.replaceWith(newElement);
    //       });
    //     });
    //   }
    
    //   errorMsg.children().each(function (index, element) {
    //     bindEventsToTodoItem($(element));
    //   });
//-------------------------------------------- ABOVE
function checkInputExists(input) { // check parameter exists
  if (input == undefined) {
      throw 'input does not exist';
  }
}

function checkInputType(input, type) {
  if (type === 'array') {
      if (!Array.isArray(input)) {
          throw 'provided input is not an array';
      }
  }
  else if (type === 'object') {
      if (Array.isArray(input)) {
          throw 'provided input is an array';
      }
      else if (typeof(input) !== 'object') {
          throw 'provided input is not an object';
      }
  }
  else {
      if (typeof(input) !== type) {
          throw `provided input is not a ${type}`;
      }
  }
}

function checkStringEnpty(str) {
  str = str.trim();
  if (str.length == 0) {
      throw 'provided input string is empty';
  }
}

function checkString(str) {
    
  checkInputExists(str);
  checkInputType(str, 'string');
  checkStringEnpty(str);

  return str.trim();

}

function checkUsername(username) {

  username = checkString(username);
  
  if (username.match(/[^a-zA-Z0-9]+/g) !== null) {
      throw 'Username shoule not contain special characters.';
  }

  if (username.length < 4) {
      throw "Username too short.";
  }

  return username;
}

function checkPasswd(passwd) {

  passwd = checkString(passwd);

  if (passwd.includes(' ')) {
      throw "Password should not contain spaces.";
  }

  if (passwd.length < 6 || passwd.length > 14) {
      throw "Password should be at least 6 characters long.";
  }

  if (passwd.match(/[A-Z]+/g) === null) {
      throw "Password needs to be at least one uppercase character.";
  }

  if (passwd.match(/[0-9]+/g) === null) {
      throw "Password needs to be at least one number.";
  }

  if (passwd.match(/[^a-zA-Z0-9]+/g) === null) {
      throw "Password needs to be at least one special character.";
  }

  return passwd;
}

//------------------------------------------below are the codes that really matter---------------------------------------------


    myNewTaskForm.submit(function (event) {
      event.preventDefault();

      var newName = $('#login_username'),
      newPasswd = $('#login_passwd'),
      errorMsg = $('#login_error');

      console.log("we reached here - before getting values")
  
      var newName = newName.val();
      var newPasswd = newPasswd.val();
  
      try {
        checkUsername(newName);
        checkPasswd(newPasswd);

        var requestConfig = {
            method: 'POST',
            url: '/login',
            contentType: 'application/json',
            data: JSON.stringify({
                user_name: newName,
                user_password: newPasswd
            })
        };

        console.log("Everything looks good, let's send those data to routes")
  
          $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage);
            var newElement = $(responseMessage);
            //---------------------- Lines in middle might not be needed
            // bindEventsToTodoItem(newElement);
            //----------------------
            errorMsg.append(newElement);
        });
      } catch (e) {
        var requestConfig = {
            method: 'POST',
            url: '/login',
            contentType: 'application/json',
            data: JSON.stringify({
                user_name: newName,
                user_password: newPasswd
            })
        };

        
        console.log("Something is wrong, but we got here")
  
          $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage);
            var newElement = $(responseMessage);
            //---------------------- Lines in middle might not be needed
            // bindEventsToTodoItem(newElement);
            //----------------------
  
            errorMsg.append(newElement);
            errorMsg.append(e);
          });
      }


    });
})(window.jQuery);