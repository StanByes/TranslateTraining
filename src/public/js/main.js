let lang = "es";
let word = {base: "", translate: ""};

const informations = document.getElementById("informations");
const langSelector = document.getElementById("lang");
const loading = document.getElementById("loading");
const newButton = document.getElementById("new");
const translate = document.getElementById("translate");
const validate = document.getElementById("validate");
const wordLabel = document.getElementById("word");

function validateWord() {
    translate.setAttribute("disabled", true);
    validate.classList.add("disabled");

    const text = translate.value.toLowerCase();
    if (text == word.translate.toLowerCase()) {
        informations.classList.add("text-success");
        informations.innerHTML = "Correct !";
    } else {
        informations.classList.add("text-danger");
        informations.innerHTML = `Faux ! La traduction du mot était ${word.translate.toLowerCase()}.`;
    }
}

async function newWord() {
    informations.classList.remove("text-danger");
    informations.classList.remove("text-success");
    informations.innerHTML = "";

    loading.classList.remove("d-none");
    loading.classList.add("d-block");
    newButton.classList.add("disabled");
    translate.setAttribute("disabled", true);
    translate.value = "";
    validate.classList.add("disabled");
    wordLabel.innerHTML = "Loading...";

    const words = await (await fetch("/generate?count=1&lang=" + lang, {method: "GET"})).json();
    word = words[0];
    console.log(word);

    loading.classList.add("d-none");
    loading.classList.remove("d-block");
    newButton.classList.remove("disabled");
    translate.removeAttribute("disabled");
    validate.classList.remove("disabled");
    wordLabel.innerHTML = word.base.toLowerCase();
}

langSelector.onchange = (ev) => {
    lang = langSelector.value;
    newWord();
}
translate.onkeydown = (ev) => {
    if (ev.key == "Enter")
        validateWord();
}
validate.onclick = validateWord;

newWord();