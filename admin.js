document.addEventListener("DOMContentLoaded", () => {

    console.log("Admin loaded");

    setAdminLanguage();

    const div = document.getElementById("boardsDiv");
    console.log(div);
    console.log(document.body.innerHTML);

    fetch("http://localhost:3000/admin/boards")
        .then(res => res.json())
        .then(data => {

            console.log(data);

            if (!data.success) {
                div.innerHTML = "<h3>Database error</h3>";
                return;
            }

            if (data.boards.length === 0) {

                const lang = localStorage.getItem("language") || "fi";

                if (lang === "en") {
                    div.innerHTML = "<p>No boards</p>";
                } else {
                    div.innerHTML = "<p>Ei tauluja</p>";
                }

                return;
            }

            let html = "";

data.boards.forEach(board => {

 html += `
<div class="adminBoard">

    <b>${board.name}</b><br>

    Owner : ${board.username || "-"}<br>
    Email : ${board.email || "-"}<br>
    Users : ${board.userCount}<br>

    <button onclick="adminDeleteBoard(${board.id}, '${board.name}')">
        🗑
    </button>

</div>

<hr>
`;

});

div.innerHTML = html;

        })
        .catch(err => console.error(err));

});

function setAdminLanguage() {

    const lang = localStorage.getItem("language") || "fi";

    const texts = {
        fi: {
            goHome: "Koti",
            deleteAllBoardsBtn: "Poista kaikki taulut"
        },
        en: {
            goHome: "Home",
            deleteAllBoardsBtn: "Delete all boards"
        }
    };

    document.getElementById("goHome").textContent =
        texts[lang].goHome;
    document.getElementById("deleteAllBoardsBtn").textContent =
        texts[lang].deleteAllBoardsBtn;
}

function deleteAllBoards() {

    if (!confirm("Poistetaanko kaikki taulut?")) {
        return;
    }

    fetch("http://localhost:3000/admin/boards", {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {

        if (data.success) {
            location.reload();
        }

    });

}

function adminDeleteBoard(id, name) {

    const lang = localStorage.getItem("language") || "fi";

    const msg = lang === "en"
        ? `Delete board ${name}?`
        : `Poistetaanko taulu ${name}?`;

    if (!confirm(msg)) {
        return;
    }

    fetch(`http://localhost:3000/admin/board/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {

        if (!data.success) {
            alert(
                lang === "en"
                ? "Delete failed"
                : "Poisto epäonnistui"
            );
            return;
        }

        location.reload();

    });
}

function goHome() {
    window.location.href = "index.html";
}

