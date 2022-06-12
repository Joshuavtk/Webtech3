let urlParams = new URLSearchParams(window.location.search);
let message = urlParams.get("msg");
let messageElement = document.querySelector("#message");

switch (message) {
    case "not_logged_in":
        messageElement.innerHTML = "Je bent niet ingelogd!";
        break;
    case "session_expired":
        messageElement.innerHTML = "Sessie verlopen! Log a.u.b. opnieuw in.";
        break;
    case "register_success":
        messageElement.innerHTML = "Registreren gelukt, je kan nu inloggen.";
}

if (localStorage.JWT) {
    redirectToMemory();
}

document.querySelector("#login_submit").addEventListener("click", (ev) => {
    ev.preventDefault();

    let form = document.querySelector("#form");

    let username = form.querySelector("#username").value;
    let password = form.querySelector("#password").value;

    fetch("http://127.0.0.1:8000/api/login_check", {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        method: "POST",
        body: `{"password": "${password}", "username": "${username}" }`,
    })
        .then((data) => data.json())
        .then((data) => {
            localStorage.setItem("JWT", data.token);
            redirectToMemory();
        });
});

function redirectToMemory() {
    window.location.href = "/";
}
