import "./style/initial.pcss";
const splashHtml = require("./splash.html");

if (window.location.pathname !== "/") {
  import("./init-vue");
} else {
  // @ts-ignore
  document.querySelector("#app").innerHTML = splashHtml;

  const queryParams: any = window.location.search
    .slice(1)
    .split("&")
    .reduce((map, str) => {
      const pair = str.split("=");
      map[pair[0]] = pair[1];
      return map;
    }, {});

  if (queryParams.error) {
    const errorElement = document.querySelector("#error") as HTMLElement;
    errorElement.classList.add("has-error");

    const errorMessages = {
      noAccess: "Fără acces la dashboard. Dacă credeți că aceasta este o greșeală, vă rugăm să contactați proprietarul serverului.",
      expiredLogin: "Conectarea la dashboard a expirat. Te rog logheaza-te din nou.",
    };

    const errorMessageElem = document.createElement("div");
    errorMessageElem.classList.add("message");
    errorMessageElem.innerText = errorMessages[queryParams.error] || "Unexpected error";
    errorElement.appendChild(errorMessageElem);
  }
}
