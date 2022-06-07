document.querySelector("#login_submit").addEventListener("click", (ev) => {
    ev.preventDefault();

    let form = document.querySelector("#form");

    let username = form.querySelector("#username").value;
    let password = form.querySelector("#password").value;

    fetch("http://127.0.0.1:8000/api/login_check", {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: `{"password": "${password}", "username": "${username}" }`,
    }).then(data => data.json()).then((data) => {
        localStorage.setItem("JWT", data.token)
    })
});
