document.querySelector("#register_submit").addEventListener("click", (ev) => {
    ev.preventDefault();

    let form = document.querySelector("#form");

    let username = form.querySelector("#username").value;
    let email = form.querySelector("#email").value;
    let password = form.querySelector("#password").value;

    fetch("http://127.0.0.1:8000/register", {
        headers: {
            Accept: "application/json",
        },
        method: "POST",
        body: `{"username": "${username}", "password": "${password}", "email": "${email}" }`,
    }).then((data) => {
        let status = document.querySelector("#status");
        if (data.status == 201) {
            status.innerText = "Account aangemaakt gelukt!";
        } else {
            status.innerText = "Mislukt, probeer opnieuw.";
        }
    });
});
