let decoded = getJWTInfo();

let id = decoded[0].sub;

fetch(`http://127.0.0.1:8000/api/player/${id}/email`, {
    headers: {
        Authorization: "Bearer " + localStorage.JWT,
    },
    method: "GET",
})
    .then((res) => res.json())
    .then((data) => {
        document.querySelector("#email").value = data;
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

        let email = form.querySelector("#email").value;

        fetch(`http://127.0.0.1:8000/api/player/${id}/email`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + localStorage.JWT,
            },
            method: "PUT",
            body: `{"email": "${email}" }`,
        })
            .then((data) => {
                let status = document.querySelector("#status");
                if (data.status == 201) {
                    status.innerText = "Account aangemaakt gelukt!";
                    window.location.href = "login.html?msg=register_success";
                } else {
                    status.innerText = "Mislukt, probeer opnieuw.";
                }
            })
    });
