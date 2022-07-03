import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  jwt: String = "";

  constructor() {
    let jwt = localStorage.getItem("JWT")
    if (jwt) {
      this.jwt = jwt
    } else {
      jwt = (new URLSearchParams(window.location.search)).get("JWT")
      if (jwt) {
        localStorage.setItem("JWT", jwt)
        this.jwt = jwt
      } else {
        window.alert("Geen JWT token gevonden, log eerst in.");
      }
    }
  }

  getJWT() {
    return this.jwt
  }

  getUsername(): string {
    return this.decodeJWT(
      this.jwt.split(".")[1] || "").username
  }

  decodeJWT(encoded: string) {
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
}
