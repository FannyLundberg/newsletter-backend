const nameInput = document.getElementById("nameInput");
const passwordInput = document.getElementById("passwordInput");
const logInBtn = document.getElementById("logInBtn");
const logInSection = document.getElementById("logInSection");


logInBtn.addEventListener("click", () => {
    console.log("Klick på Logga in-knappen")

    if (nameInput.value == "admin" && passwordInput.value == "admin") {
        console.log("Rätt inloggningsuppgifter")

        logInSection.remove();

    } else {
        console.log("Fel inloggningsuppgifter")
    }
})