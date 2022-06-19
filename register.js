document.querySelector("#register_submit").addEventListener("click", (ev) => {
    ev.preventDefault();

    let form = document.querySelector("#form");
    form.querySelector('fieldset').setAttribute("disabled", "true")

    let username = form.querySelector("#username").value;
    let email = form.querySelector("#email").value;
    let password = form.querySelector("#password").value;

    fetch(`${backend_url}/register`, {
        headers: {
            Accept: "application/json",
        },
        method: "POST",
        body: `{"username": "${username}", "password": "${password}", "email": "${email}" }`,
    }).then((data) => {
        form.querySelector('fieldset').removeAttribute("disabled")
        let status = document.querySelector("#status");
        if (data.status == 201) {
            status.innerText = "Account aangemaakt gelukt!";
            window.location.href = "login.html?msg=register_success"
        } else {
            status.innerText = "Mislukt, probeer opnieuw.";
        }
    });
});
