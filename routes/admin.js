var express = require('express');
const { clearCookie } = require('express/lib/response');
var router = express.Router();


// Styling
let styling = "<link rel='stylesheet' href='/stylesheets/style.css'>";


router.get("/", (req, res) => {

    let logIn = `
        <section id="logInSection">
            <h2>Hej Administratör!</h2>
            <h3>Vänligen logga in:</h3>

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

                    location.href = "/admin/loggedin";

                } else {
                    console.log("Fel")

                    let wrongInput = document.createElement("p");
                    wrongInput.innerText = "Fel uppgifter, vänligen prova igen.";

                    document.body.append(wrongInput);
                }
            })

            if (localStorage.length > 0) {
                console.log("Det finns något i ls")
            }
        </script>
    `;

    res.clearCookie("admin");
    res.send(logIn + styling)
})

router.get("/loggedin", (req, res) => {

    res.cookie("admin", true);

    let printWelcome = `
        <h2>Välkommen Administratören, Du är nu inloggad!</h2>
        <button>
            <a href='/admin/showusers'>Visa alla användare och prenumerater</a>
        </button>
    `;

    res.send(printWelcome + styling);
})


// Visa alla användare och prenumeranter
router.get("/showusers", (req, res) => {

    if (req.cookies["admin"]) {

        // Visa alla användare
        req.app.locals.db.collection("users").find().toArray()
        .then(users => {
            console.log(users)

            let printUsers = `
                <h2>Alla användare och prenumeranter</h2>
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

                    <button>
                        <a href='/admin'>Logga ut</a>
                    </button>
                `;
                res.send(printUsers + printSubscribers + styling)
            })
        })

    } else {
        
        let printNotLoggedIn = `
            <p>Du är inte inloggad. Vänligen logga in.</p>
            <button>
                <a href='/admin'>Till inloggning</a>
            </button>
        `;
        res.send(printNotLoggedIn + styling);
    }
});


module.exports = router;