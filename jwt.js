const backend_url = "http://127.0.0.1:8000"

function decodeJWT(encoded) {
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    let decoded = decodeURIComponent(
        atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );
    return JSON.parse(decoded);
}

function getJWTInfo() {
    let JWT = localStorage.getItem("JWT");

    if (JWT) {
        let JWTSplit = JWT.split(".");

        let JWTHeader = JWTSplit[0];
        let JWTBody = JWTSplit[1];

        let decodedHeader = decodeJWT(JWTHeader);
        let decodedBody = decodeJWT(JWTBody);

        return [decodedHeader, decodedBody];
    } else {
        window.location.href = "/login.html?msg=not_logged_in";
    }
}