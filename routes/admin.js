var express = require('express');
var router = express.Router();
// const ls = require("node-localstorage").LocalStorage;

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}


// Styling
let styling = "<link rel='stylesheet' href='/stylesheets/style.css'>";


router.get("/", (req, res) => {

    let logIn = `
        <section id="logInSection">
            <h2>Hej Administratör!</h2>

            <form>
                <label for="adminName">Användarnamn: </label>
                <input type="text" name="adminName" id="adminName">
        
                <label for="adminPassword">Lösenord: </label>
                <input type="text" name="adminPassword" id="adminPassword">
            </form>
      
          <button id="submitBtn">Logga in</button>
        </section>

        <script>
            document.getElementById("submitBtn").addEventListener("click", () => {
                if (adminName.value === "admin" && adminPassword.value ===  "admin") {
                    console.log("Rätt")

                    document.getElementById("logInSection").remove();

                    localStorage.setItem("loggedIn", "true");

                    let heading = document.createElement("H2");
                    heading.innerText = "Hej Administratören i inloggat läge!";
                    document.body.append(heading);

                    let showUsersBtn = document.createElement("button");
                    showUsersBtn.innerText = "Visa alla användare";
                    showUsersBtn.id = "showUsersBtn";
                    document.body.append(showUsersBtn);

                    document.getElementById("showUsersBtn").addEventListener("click", () => {
                        console.log("Klick på Visa alla användare")

                        location.href = "/admin/showusers";
                    })

                    let showMailBtn = document.createElement("button");
                    showMailBtn.innerText = "Visa alla prenumeranter";
                    showMailBtn.id = "showMailBtn";
                    document.body.append(showMailBtn);

                    document.getElementById("showMailBtn").addEventListener("click", () => {
                        console.log("Klick på Visa alla mailadresser")

                        location.href = "/admin/showsubscribers";
                    })

                } else {
                    console.log("Fel")

                    let wrongInput = document.createElement("p");
                    wrongInput.innerText = "Fel uppgifter";

                    document.body.append(wrongInput);
                }
            })

            if (localStorage.length > 0) {
                console.log("Det finns något i ls")
            }
        </script>
    `;
    res.send(logIn + styling)
})


// Visa alla användare och prenumeranter
router.get("/showusers", (req, res) => {

    let loggedInAdmin = localStorage.getItem("loggedIn");

    console.log(loggedInAdmin)

    // if (loggedInAdmin === true) {

        // Visa alla användare
        req.app.locals.db.collection("users").find().toArray()
        .then(users => {
            console.log(users)

            let printUsers = `
                <div>
                <h3>Alla användare</h3>
            `;

            for (let i = 0; i < users.length; i++) {
                printUsers += `
                    <h4> ${users[i].username} </h4>
                `;
            }

            printUsers += `
                <p> Antal användare: ${users.length} </p>
                </div>
            `;


            // Visa prenumeranterna
            req.app.locals.db.collection("users").find({"subscriber": true}).toArray()
            .then(subscribers => {
            console.log(subscribers)

            let printSubscribers = `
                <div>
                <h3>Alla prenumeranter</h3>
            `;

            for (let i = 0; i < subscribers.length; i++) {
                printSubscribers += `
                    <span> ${subscribers[i].username}, </span>
                `;
            }

            printSubscribers += `
                <p> Antal prenumeranter: ${subscribers.length} </p>
                </div>
            `;

            res.send(printUsers + printSubscribers + styling)
        })
            // res.send(printUsers)
        })

        

    // } else {
    //     res.send("Inte inloggad");
    // }
});


// Visa prenumeranterna
router.get("/showsubscribers", (req, res) => {

    const loggedInAdmin = JSON.parse(localStorage.getItem("loggedIn"));

    console.log(loggedInAdmin);

    if (JSON.parse(localStorage.getItem("loggedIn")) === true) {

        

    } else {
        res.send("Inte inloggad");
    }
});


// function showUsers() {
//     res.redirect("/admin/loggedin");
// }


// router.get("/loggedin", (req, res) => {

//     let loggedIn = `
//         <section id="logInSection">
//             <h2>Hej Administratören i inloggat läge!</h2>
//         </section>
//     `;

//     res.send(loggedIn + styling)
// })


module.exports = router;