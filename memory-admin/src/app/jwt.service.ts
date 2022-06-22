import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  getJWT() {
    return localStorage.getItem("JWT")
  }

  getUsername(): string {
    return this.decodeJWT(
      this.getJWT()?.split(".")[1] || "").username
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
