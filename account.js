let decoded = getJWTInfo();

document.querySelector('fieldset').setAttribute("disabled", "true")

let id = decoded[0].sub;

fetch(`${backend_url}/api/player/${id}/email`, {
    headers: {
        Authorization: "Bearer " + localStorage.JWT,
    },
    method: "GET",
})
    .then((res) => res.json())
    .then((data) => {
        document.querySelector("#email").value = data;
        document.querySelector('fieldset').removeAttribute("disabled")
    })
    .catch((err) => {
        localStorage.removeItem("JWT");
        window.location.href = "login.html?msg=session_expired";
    });

document
    .querySelector("#change_email_submit")
    .addEventListener("click", (ev) => {
        ev.preventDefault();

        let form = document.querySelector("#form");
        document.querySelector('fieldset').setAttribute("disabled", "true")

        let email = form.querySelector("#email").value;

        fetch(`${backend_url}/api/player/${id}/email`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + localStorage.JWT,
            },
            method: "PUT",
            body: `{"email": "${email}" }`,
        })
            .then((data) => {
                let status = document.querySelector("#status");
                if (data.status == 204) {
                    status.innerText = "Email bijwerken gelukt!";
                } else {
                    status.innerText = "Mislukt, probeer opnieuw.";
                }
                document.querySelector('fieldset').removeAttribute("disabled")
            })
    });
