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

    search(text);

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

function search(input_text) {
    // We expect that text is a string of letters (and has been validated)
    // First, convert text to regex
    // \n.*[\s\[\]0-9:.]W[^\s\[\]0-9:.]*[\s\[\]0-9:.]+K[^\s\[\]0-9:.]*[\s\[\]0-9:.]+A[^\s\[\]0-9:.]*
    let regex = input_text.split("").join("[^\\s\\[\\]0-9:.]*[\\s\\[\\]0-9:.]+");  // Rest of word + whitespace
    regex = '\\n.*[\\s\\[\\]0-9:.]' + regex + '[^\\s\\[\\]0-9:.]*';  // Beginning and end
    let myRe = new RegExp(regex, 'gi');
    console.log(regex);
    // Now, search for matches

    fetch("lyrics/Karma by Taylor Swift.lrc")
        .then((res) => res.text())
        .then((text) => {
            // do something with "text"
            let result;
            let embed_player = document.getElementById("embed-player");
            while (result = myRe.exec(text)) {
                addReflectionMessage(result);
                // Change the youtube link!
            }
        })
        .catch((e) => console.error(e));

}