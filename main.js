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
    // addUserMessage(text);

    // respond(text);

    clearSearchResults();
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

function addSearchResult(text) {
    /*
    let newLyric = 'div className="SongLyric">' +
        '<p>Sweet like honey, karma is a cat<br>' +
        '<span className="lyric">' +
    '<Purring in my <span
        className="query">lap</span> 'cause it loves me</span><br>Flexing like a goddamn acrobat
    </p>Karma, <i>Midnights</i>
        <hr>
    </div>
    */

    $('#messages').append('<div class="message" align="right">'+ text + '</div>');
}

function clearSearchResults() {
    $('#messages').empty();
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
    // (^|\n).*[\s\[\]0-9:.](y[^\s\[\]0-9:.]*[\s\[\]0-9:.]+t[^\s\[\]0-9:.]*[\s\[\]0-9:.]+s[^\s\[\]0-9:.]*)
    // (^|\n).*[\s\[\]0-9:.]((f[^\s\[\]0-9:.]*[\s\[\]0-9:.]+t[^\s\[\]0-9:.]*[\s\[\]0-9:.]+h[^\s\[\]0-9:.]*).*)
    // (^|\n)(.*[\s\[\]0-9:.](o[^\s\[\]0-9:.]*[\s\[\]0-9:.]+i[^\s\[\]0-9:.]*[\s\[\]0-9:.]+a[^\s\[\]0-9:.]*).*)
    // ^|\n(.*[\s\[\]0-9:.](o[^\s\[\]0-9:.]*[\s\[\]0-9:.]+i[^\s\[\]0-9:.]*[\s\[\]0-9:.]+a[^\s\[\]0-9:.]*).*)
    // (^|.*\n)(.*[\s\[\]0-9:.](a[^\s\[\]0-9:.]*[\s\[\]0-9:.]+t[^\s\[\]0-9:.]*[\s\[\]0-9:.]+b[^\s\[\]0-9:.]*).*)
    // (^|.*\n)(.*[\s\[\]0-9:.](a[^\s\[\]0-9:.]*[\s\[\]0-9:.]+t[^\s\[\]0-9:.]*[\s\[\]0-9:.]+b[^\s\[\]0-9:.]*).*($|\n.*))
    // (^|.*\n)((.*[\s\[\]0-9:.](a[^\s\[\]0-9:.]*[\s\[\]0-9:.]+t[^\s\[\]0-9:.]*[\s\[\]0-9:.]+b[^\s\[\]0-9:.]*).*)($|\n.*))
    // (^|.*\n)(.*[\s\[\]0-9:.'](d[^\s\[\]0-9:.]*[\s\[\]0-9:.']+c[^\s\[\]0-9:.]*[\s\[\]0-9:.']+i[^\s\[\]0-9:.]*).*)($|\n(.*))

    // Group 1: Prefix (lyric before, empty if N/A)
    // Group 2: Lyrix Lines (all line(s) containing the lyrics)
    // Group 3: Lyrics (the actual phrase that matches)
    // Group 4: Suffix with leading space [Don't Use This]
    // Group 5: Suffix (lyric after, empty if N/A)
    let regex = input_text.split("").join("[^\\s\\[\\]0-9:.']*[\\s\\[\\]0-9:.]+");  // Rest of word + whitespace
    regex = '\(^|.*\\n)(.*[\\s\\[\\]0-9:.\'](' + regex + '[^\\s\\[\\]0-9:.]*).*)($|\\n(.*))';  // Beginning and end
    let myRe = new RegExp(regex, 'gi');
    console.log(regex);
    // Now, search for matches

    fetch("lyrics/Karma by Taylor Swift.lrc")
        .then((res) => res.text())
        .then((text) => {
            // do something with "text"
            // split into header and lyrics
            let pos = text.indexOf("[00");
            let header = text.substring(0, pos);
            let lyrics = text.substring(pos);

            let result;
            let embed_player = document.getElementById("embed-player");
            while (result = myRe.exec(lyrics)) {
                addSearchResult("Result found:");
                addSearchResult(result);
                addSearchResult("\n\n");
                // Change the youtube link!
                loadVideo('XzOvgu3GPwY', 0, 60);
            }
        })
        .catch((e) => console.error(e));

}