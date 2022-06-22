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

    form.querySelector('fieldset').setAttribute("disabled", "true")

    let username = form.querySelector("#username").value;
    let password = form.querySelector("#password").value;

    fetch(`${backend_url}/api/login_check`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        method: "POST",
        body: `{"password": "${password}", "username": "${username}" }`,
    })
        .catch(err => {
            console.log(err)
            document.querySelector("#status").innerText = `Kan geen verbinding maken met de back-end. Gebruikte url: ${backend_url}`
            form.querySelector('fieldset').removeAttribute("disabled")
        })
        .then((data) => data.json())
        .then((data) => {
            form.querySelector('fieldset').removeAttribute("disabled")

            let status = document.querySelector("#status");
            if (data.code === 401) {
                status.innerText = "Incorrecte inloggegevens.";
            } else {
                localStorage.setItem("JWT", data.token);
                redirectToMemory();
            }
        });
});

function redirectToMemory() {
    window.location.href = frontend_url + "/";
}
