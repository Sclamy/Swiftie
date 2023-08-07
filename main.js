document.addEventListener('DOMContentLoaded', function() {
    var txt_input = document.getElementById("txt-input");
    txt_input.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
            newMessage(e);
        }
    });
})

function newMessage(e) {  // When a message is received from user
    var text = e.target.value;
    var txt_input = document.getElementById("txt-input");
    // var messages = document.getElementById("messages")

    // TODO: Validate input?

    // Clear the input
    txt_input.value = '';

    // Add a new element!
    // $('.message').length
    //$('#messages').prepend('<l class="message">'+ text + '</l>');
    addUserMessage(text);

    respond(text);

    // Remove all hidden elements
    $('.message').each(function() {
        let el = $(this);
        if (el.position().top < 0) {  // The element is hidden and needs to be removed
            el.remove();
        }
    });
}

function addUserMessage(text) {  // Text from the user
    $('#messages').prepend('<l class="message" align="left">'+ text + '</l>');
}

function addReflectionMessage(text) {  // Text from the reflection
    $('#messages').prepend('<l class="message" align="right">'+ text + '</l>');
}

function respond(text) {
    // Long function (or imports/uses text file?)
    var response;

    response = 'This is a response to "' + text + '"';  // Template for now

    addReflectionMessage(response);
}