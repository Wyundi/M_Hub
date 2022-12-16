(function ($) {

    // error check
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
    
        try {
            checkInputExists(str);
            checkInputType(str, 'string');
            checkStringEnpty(str);

            return str.trim();
        } catch (e) {
            return '';
        }
            
    }

    // ajax
    let search_page = $('#search_page');
    let search_input_html = $('#search_data');
    let newContent = $('#new-content');

    let search_result_header = $('#search_result_header');
    let data_search_res = $('#data_search_res');
    let model_search_res = $('#model_search_res');

    let data_result_list = $('#data_result_list');
    let model_result_list = $('#model_result_list');

    function update_page(res) {

        if (res.error_message) {
            search_page.empty();
            search_page.html('<h1> Forbidden Access </h1><br><p> The user is not logged in. </p><br><a href="../"> homepage </a>');
        }


        search_result_header.empty();
        data_search_res.empty();
        model_search_res.empty();

        data_result_list.empty();
        model_result_list.empty();

        console.log(res);
        if (res.error_message) {
            console.log('test');
            newContent.html(`<h2>${res.error_message}</h2>`);
        }
        else {
            if (res.no_res) {
                search_result_header.text("No result for your search.");
            }
            else {
                search_result_header.text("Search Result");
                if (res.data_search_res.length !== 0) {
                    data_search_res.append("<h2> Data </h2>");
                    for (let data_db of res.data_search_res) {
                        data_result_list.append(`<li><a href="../data/info/${data_db._id}"> ${data_db.data_name} </a><p> ${data_db.description} </p></li>`);
                    }
                }
                if (res.model_search_res.length !== 0) {
                    model_search_res.append("<h2> Model </h2>");
                    for (let model_db of res.model_search_res) {
                        model_result_list.append(`<li><a href="../model/info/${model_db._id}"> ${model_db.model_name} </a><p> ${model_db.description} </p></li>`);
                    }
                }
            }
        }

    }

    $('#form_submit').click(function(event) {
        event.preventDefault();
        search_input = checkString(search_input_html.val());
        if (search_input.length === 0) {
            newContent.html("<p>input error</p>");
        }
        else {
            newContent.html("");

            let post_data = JSON.stringify({
                ajax: true,
                search_input: search_input
            });
    
            let requestConfig = {
                method: 'POST',
                url: "/search",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: post_data,
                success: update_page
            };
    
            $.ajax(requestConfig);
        }
    });
    
})(window.jQuery);