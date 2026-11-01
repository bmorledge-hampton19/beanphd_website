const DR_BEAN_IMG = document.getElementById("dr-bean")
const DR_BEAN_DIR = "images/dr_bean/"
const DR_BEAN_DEFAULT = DR_BEAN_DIR + "default.png"
const DR_BEAN_TALKING = [DR_BEAN_DIR + "talking_1.png", DR_BEAN_DIR + "talking_2.png"]
const DR_BEAN_FLASK_IDLE = DR_BEAN_DIR + "idle_flask_animation.gif"
const DR_BEAN_COMPUTER_IDLE = DR_BEAN_DIR + "idle_computer_animation.gif"

const CHAT_CONTAINER_DIV = document.getElementById("chat-container")
const SPEECH_BUBBLE_DIV = document.getElementById("speech-bubble")
const MSG_DIV = document.getElementById("msg")
const RESPONSE_CONTAINER = document.getElementById("response-container")
const SKIP_BUTTON = document.getElementById("skip-button")

const FLASK = 1
const FLASK_IDLE_ANIMATION_LENGTH = 3200
const COMPUTER = 2
const COMPUTER_IDLE_ANIMATION_LENGTH = 2500

function rand_float_range(min, max) {
    return Math.random() * (max-min) + min;
}
function rand_int_range(min, max) {
    return Math.floor(Math.random() * (max-min + 1)) + min;
}


let text_chunks = []
let full_message = ""
const CHAR_INTERVAL = 30
const CHUNK_INTERVAL = 600
const GAME_THUMBNAIL_DIR = "images/game_thumbnails/"
const RAINBOW_SPONGE = "RAINBOW_SPONGE"
let game_image = ""
let game_link = ""
let skip_requested = false
let finished = false
function init_speech_bubble(p_text_chunks = [], p_game_image = "", p_game_link = "") {
    text_chunks = p_text_chunks
    game_image = p_game_image
    game_link = p_game_link
    for (let text_chunk of text_chunks) {
        full_message += text_chunk
    }
    SKIP_BUTTON.addEventListener("click", function() {skip_requested = true; _animate_speech_bubble(0,0)})
}
function start_speech_bubble(delay = 500) {
    setTimeout(_animate_speech_bubble, delay, 0, 0)
}

function _animate_speech_bubble(chunk_index, char_index) {
    if (finished) {
        return
    } else if (chunk_index >= text_chunks.length || skip_requested) {
        MSG_DIV.textContent = full_message

        if (game_image == RAINBOW_SPONGE) {
            let iframe = document.createElement("iframe")
            iframe.src="https://www.youtube.com/embed/V_OVxxIvqVw"
            iframe.width="560"
            iframe.height="315"
            iframe.title="YouTube video player"
            iframe.frameborder="0"
            iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin")
            iframe.allowFullscreen=true
            iframe.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            SPEECH_BUBBLE_DIV.appendChild(iframe)

            setTimeout(reset_idle_animation, 1000, rand_int_range(FLASK, COMPUTER))
            setTimeout(function() {SKIP_BUTTON.remove(); _animate_responses(0)}, 750)
        }
        else if (game_image != "") {
            let link = document.createElement('a')
            link.href = game_link
            link.target = "_blank"
            link.classList.add("dr-bean-speech-bubble-link")
            SPEECH_BUBBLE_DIV.appendChild(link)

            let img = document.createElement("img")
            img.src = GAME_THUMBNAIL_DIR + game_image
            img.classList.add("dr-bean-speech-bubble-image")
            link.appendChild(img)

            setTimeout(reset_idle_animation, 1000, rand_int_range(FLASK, COMPUTER))
            setTimeout(function() {SKIP_BUTTON.remove(); _animate_responses(0)}, 750)
        } else {
            reset_idle_animation(rand_int_range(FLASK, COMPUTER))
            SKIP_BUTTON.remove()
            _animate_responses(0)
        }

        finished = true

    } else if (char_index < text_chunks[chunk_index].length) {
        if (char_index % 10 == 0) {
            DR_BEAN_IMG.src = DR_BEAN_TALKING[0]
        } else if (char_index % 5 == 0) {
            DR_BEAN_IMG.src = DR_BEAN_TALKING[1]
        }

        MSG_DIV.append(text_chunks[chunk_index][char_index++]);
        setTimeout(_animate_speech_bubble, CHAR_INTERVAL, chunk_index, char_index);

    } else if (chunk_index < text_chunks.length) {
        chunk_index++
        char_index = 0
        DR_BEAN_IMG.src = DR_BEAN_DEFAULT
        setTimeout(_animate_speech_bubble, CHUNK_INTERVAL, chunk_index, char_index);
    }
}


let response_labels = []
let response_links = []
const RESPONSE_INTERVAL = 500
function init_responses(p_response_labels, p_response_links) {
    response_labels = p_response_labels
    response_links = p_response_links
    RESPONSE_CONTAINER.style.minHeight = SKIP_BUTTON.offsetHeight + "px"
}

function _animate_responses(response_index) {
    if (response_index < response_labels.length && response_index < response_links.length) {

        let link = document.createElement('a')
        link.href = response_links[response_index]
        if (response_links[response_index].startsWith("http")) {link.target = "_blank"}
        link.classList.add("response-link")
        RESPONSE_CONTAINER.appendChild(link)

        let div = document.createElement("div")
        div.textContent = response_labels[response_index]
        div.classList.add("user-response")
        link.appendChild(div)

        if (response_index == 0) {
            RESPONSE_CONTAINER.style.minHeight = 64.4*Math.min(response_labels.length, response_links.length)-10 + "px"
        }

        setTimeout(_animate_responses, RESPONSE_INTERVAL, response_index+1);
    }
}


function reset_idle_animation(next_animation) {
    DR_BEAN_IMG.src = DR_BEAN_DEFAULT
    setTimeout(play_idle_animation, rand_float_range(3,5)*1000, next_animation)
}

function play_idle_animation(flask_or_computer) {
    if (flask_or_computer == FLASK) {
        DR_BEAN_IMG.src = DR_BEAN_FLASK_IDLE
        setTimeout(reset_idle_animation, FLASK_IDLE_ANIMATION_LENGTH, COMPUTER)
    } else if (flask_or_computer == COMPUTER) {
        DR_BEAN_IMG.src = DR_BEAN_COMPUTER_IDLE
        setTimeout(reset_idle_animation, COMPUTER_IDLE_ANIMATION_LENGTH, FLASK)
    }
}
