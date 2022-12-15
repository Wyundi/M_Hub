(function ($) {
    // Let's start writing AJAX calls!
    
    console.log("we reached here - start of ajax")
  
    var myNewTaskForm = $('#login_form'),
      newName = $('#login_username'),
      newPasswd = $('#login_passwd'),
      errorMsg = $('#login_error');
  
    // --------------------------------- below should be deleted after figuring out stuffs
    function bindEventsToTodoItem(todoItem) {
        todoItem.find('.finishItem').on('click', function (event) {
          event.preventDefault();
          var currentLink = $(this);
          var currentId = currentLink.data('id');
    
          var requestConfig = {
            method: 'POST',
            url: '/login'
          };
    
          $.ajax(requestConfig).then(function (responseMessage) {
            var newElement = $(responseMessage);
            bindEventsToTodoItem(newElement);
            todoItem.replaceWith(newElement);
          });
        });
      }
    
      todoArea.children().each(function (index, element) {
        bindEventsToTodoItem($(element));
      });
//-------------------------------------------- ABOVE

    myNewTaskForm.submit(function (event) {
      event.preventDefault();

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
            bindEventsToTodoItem(newElement);
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
            bindEventsToTodoItem(newElement);
            //----------------------
  
            errorMsg.append(newElement);
            errorMsg.append(e);
          });
      }


    });
})(window.jQuery);
  

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