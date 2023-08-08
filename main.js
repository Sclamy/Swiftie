document.addEventListener('DOMContentLoaded', function() {
    var txt_input = document.getElementById("txt-input");
    txt_input.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
            newMessage(e);
        }
    });
    const messages = document.getElementById('messages');
    messages.addEventListener('click', function(e) {
        // console.log(e.target.className);
        if (e.target.className == "query") {  // Go to link!!
            let id = e.target.getAttribute("videoid");
            let startTime = e.target.getAttribute("starttime");
            // console.log('id is ' + id);
            console.log('startTime: ' + startTime);
            loadVideo(id, startTime, 1000);
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

function addSearchResult(lyrics, header) {
    // First extract title, album name, and video ID
    let titleregex = RegExp('\\[ti:(.*)\\]');
    let title = titleregex.exec(header);
    if (title) {
        title = title[1];
    } else {
        title = "???";
    }

    let albumregex = RegExp('\\[al:(.*)\\]');
    let album = albumregex.exec(header);
    console.log('album: ' + album);
    if (album) {
        album = album[1];
    } else {
        album = "???";
    }

    let idregex = RegExp('\\[id:(.*)\\]');
    let id = idregex.exec(header);
    if (id) {
        id = id[1];
    } else {
        id = "dQw4w9WgXcQ";
    }

    // Now let's make the element!!!
    let startTime = null;  // this is unparsed, in form mm:ss.ss
    let newLyric = '<div class="SongLyric" videoid="' + id + '"><p>';

    // Prefix
    if (lyrics[1] && lyrics[1] != '\n') {
        // Filter it first! remove the first part)
        let pos = lyrics[1].indexOf("]");
        startTime = lyrics[1].substring(1, pos);
        let prefix = lyrics[1].substring(pos+1);
        newLyric += '' + prefix + '<br>';
    }

    // Text!
    newLyric += '' + '<span class="lyric">';
    // Filter it first! Use a loop to remove all stuff
    if (lyrics[3]) { // Remove timestamp, and check if we need it
        let pos = lyrics[3].indexOf("]");
        if (!startTime){  // Obtain startTime here, if didn't get from a prefix
            startTime = lyrics[3].substring(1, pos);
        }
        let prelyrics = lyrics[3].substring(pos+1);
        if (prelyrics.slice(-1) == "'") {  // Random case, want to include this in the word
            prelyrics = prelyrics.slice(0, -1);  // Remove it from the end
            lyrics[4] = "'" + lyrics[4];  // Add it to the front of the lyrics!
        }
        newLyric += '' + prelyrics;
    }

    if (lyrics[4]) {  // There better be matching lyrics lol
        // This could start at the start of a line (with [timestamp]), or in the middle...
        // It also can include any number of timestamps!!!
        // First check if we still need prefix
        let matchedlyrics = null;
        if (!startTime) {
            let pos = lyrics[4].indexOf("]");
            startTime = lyrics[4].substring(1, pos);
            matchedlyrics = lyrics[4].substring(pos+1);
        }
        // At this point, it could still start with a timestamp, but it doesn't matter
        // We just need to remove (discard) all timestamps!
        let start, end;
        while ((start = lyrics[4].indexOf('[')) > -1) {
            end = lyrics[4].indexOf(']');
            lyrics[4] = lyrics[4].substring(0, start) + lyrics[4].substring(end+1);
        }
        // Also turn every \n into a <br>
        lyrics[4] = lyrics[4].replaceAll("\n", "<br>");

        // And now print it
        newLyric += '<span class="query" videoid="' + id + '" starttime="' + convertSeconds(startTime) + '">' + lyrics[4] + '</span>';

    }

    if (lyrics[5]) {  // Theoretically, cannot include [], or it would be suffix
        newLyric += '' + lyrics[5];
    }
    newLyric += '' + '</span><br>';

    if (lyrics[7] && lyrics[7] != '\n') {
        // Just remove the useless timetag and print it
        let pos = lyrics[7].indexOf("]");
        let suffix = lyrics[7].substring(pos+1);
        newLyric += '' + suffix;
    }
    newLyric += '' + '</p>';

    // Finally, metadata!
    newLyric += '' + title + ', <i>' + album + '</i><hr></div>';
    /*

    '<span class="query">Purring in my lap</span>' +
    ' cause it loves me</span><br>' +
    'Flexing like a goddamn acrobat' +
    '</p>Karma, <i>Midnights</i>' +
    '<hr></div>';
     */

    $('#messages').append(newLyric);
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
    // (^|.*\n)((.*[\s\[\]0-9:.'])(o[^\s\[\]0-9:.]*[\s\[\]0-9:.']+i[^\s\[\]0-9:.]*[\s\[\]0-9:.']+a[^\s\[\]0-9:.]*)(.*)($|\n(.*)))

    // Group 1: Prefix (lyric before, empty if N/A)
    // Group 2: Lyrix Lines (all line(s) containing the lyrics) [Don't Use This]
    // Group 3: Pre-Lyrics (lyrics before but on the same line)
    // Group 4: Lyrics (the actual phrase that matches)
    // Group 5: Suf-Lyrics (lyrics after but on the same line)
    // Group 6: Suffix with leading space [Don't Use This]
    // Group 7: Suffix (lyric after, empty if N/A)
    let regex = input_text.split("").join("[^\\s\\[\\]0-9:.]*[\\s\\[\\]0-9:.\']+");  // Rest of word + whitespace
    regex = '\(^|.*\\n)((.*[\\s\\[\\]0-9:.\'])(' + regex + '[^\\s\\[\\]0-9:.]*)(.*)($|\\n(.*)))';  // Beginning and end
    let myRe = new RegExp(regex, 'gi');
    console.log(regex);
    // Now, search for matches

    let matches = 0;
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
                myRe.lastIndex = result.index + result[1].length + result[3].length + 1;
                matches += 1;
                console.log(result);

                addSearchResult(result, header);
            }
            console.log('Matches: ' + matches);
        })
        .catch((e) => console.error(e));

}

function convertSeconds(startTime) {
    // Take in string in the form mm:ss.ss
    let minutes = Number(startTime.substring(0, 2)) * 60;
    let seconds = Number(startTime.substring(3, 8));
    return minutes + seconds;
}