let loading = false;
let refreshInterval = null;
let categories = [];
let currentCategory = "";
let currentTopic = "";
let editingTopicId = null;
let saunaEditMode = false;
let saunaSlots = [];
let autoSlots = [];
//let currentButtonsCache = [];

console.log("APP.JS VERSION 123");
console.log("APP START");
//alert("UUSI APP.JS LADATTU");

const boardDescriptions = {
    fi: {
        family: "🏠 Perhetaulu",
        taloyhtio: "🏢 Taloyhtiön ilmoitustaulu",
        urheiluseura: "⚽ Urheiluseuran ilmoitustaulu",
        yhteiso: "💼 Yhteisön ilmoitustaulu",
        yhdistys: "🤝 Yhdistyksen ilmoitustaulu"
    },

    en: {
        family: "🏠 Family board",
        taloyhtio: "🏢 Housing company board",
        urheiluseura: "⚽ Sports club board",
        yheiso: "💼 Community board",
        yhdistys: "🤝 Association board"
    }
};

function getMessageTemplates() {
    return {

        general: {
            title: "",
            header: "",
            text: ""
        },

        contact: {
            title: `${t("CONTACT_TITLE")}`,
            header: `${t("CONTACT_HEADER")}`,
            text:
`👤 ${t("NAME")}:
🏠 ${t("ADDRESS")}:
📞 ${t("PHONE")}:
✉️ ${t("EMAIL")}:`
        },

        notice: {
            title: "",
            header: `${t("NOTICE_HEADER")}`,
            text:
`${t("SUBJECT")}:

${t("ADDITIONAL_INFO")}:`
        }
    };
}

const messages = {
    fi: {   
        QUICK_AT_STORE: "Kaupassa",
        QUICK_AT_WORK: "Töissä",
        QUICK_AT_HOME: "Kotona",
        QUICK_SLEEPING: "Nukkumassa",
        QUICK_EATING: "Syömässä",
        QUICK_COMING: "Tulossa",
        QUICK_LATE: "Myöhässä",
        QUICK_SICK_LEAVE: "Sairaslomalla",
        QUICK_BREAK: "Tauolla",
        QUICK_GYM: "Punttisalilla",
        Header: "Otsikko",
        ADMIN_LOGIN_FAILED: "Virheellinen admin-käyttäjänimi tai salasana.",
        BOARD_NOT_FOUND: "Taulua ei löytynyt.",
        SELECT_EXISTING_TOPIC: "Valitse olemassa oleva aihe",
        new_topic: "Uusi Aihe",
        onlyOwnerCanWrite: "Vain omistaja voi kirjoittaa tähän ketjuun.",
        PleaseSelectTopicFirst: "Valitse aihe ensin.",
        confirmRemoveMessage: "Haluatko poistaa tämän viestin?",
        confirmRemoveMessages: "Haluatko poistaa tämän viestiketjun?",
        LOGIN_FAILED: "Kirjautuminen epäonnistui.",
        BOARD_EXISTS: "Taulu on jo olemassa.",
        BOARD_INFO: "Ilmoitustaulu",
        WELCOME_TEXT: "Tervetuloa ilmoitustaululle!",
        REMOVE_USER_CONFIRM: "Poistetaanko käyttäjä?",
        BOARD_CREATED: "Taulu luotu.",
        M_ROLE: "omistaja",
        SAUNA_DELETED: "Saunavuorot poistettu.",
        AUTO_DELETED: "Autopaikat poistettu.",
        MM_ROLE: "jäsen",
        CREATE_SAUNA_SLOTS: "Haluatko luoda saunavuorot?",
        DATABASE_ERROR: "Tietokantavirhe.",
        ONLY_OWNER_EDIT: "Vain omistaja voi muuttaa.",
        SAVE: "Tallennettu.",
        HOME: "Koti",
        SAUNA_SAVE: "Talleta",
        SAUNA_EDIT: "Muokkaa",
        SAUNA_DELETE: "Poista",
        SAUNA_CLOSE: "Sulje",
        AUTO_CREATE: "Luo",
        AUTO_CLOSE: "Peru",
        AUTO_EDIT: "Muokkaa",
        AUTO_CLOSES: "Sulje",
        AUTO_DELETE: "Poista",
        AUTO_SAVE: "Talleta",
        LOGIN_AGAIN: "Kirjaudu uudelleen.",
        NO_PENDING: "Ei odottavia liittymis pyyntöjä.",
        NO_PERMISSION: "Ei oikeuksia.",
        MESSAGES_CLEARED: "Viestit poistettu.",
        USERNAME_EXISTS: "Käyttäjänimi on jo käytössä.",
        REQUEST_PENDING: "Liittymispyyntö on jo lähetetty.",
        REQUEST_SENT: "Liittymispyyntö lähetetty.",
        JOIN_REQUEST_FAILED: "Liittymispyyntö epäonnistui.",
        TOPIC_TOO_LONG: "Aihe saa sisältää enintään 40 merkkiä.",
        TOPIC_MISSING: "Aihe puuttuu.",
        MESSAGE_MISSING: "Viesti puuttuu.",
        USER_NOT_FOUND: "Käyttäjää ei löytynyt.",
        ONLY_OWNER_INFORMATION: "Vain omistaja voi lähettää tänne.",
        TOPIC_CREATED: "Aihe luotu.",
        REMOVE_FAILED: "Poisto epäonnistui.",
        ONLY_OWNER_REMOVE: "Vain omistaja voi poistaa jäseniä.",
        MEMBER_REMOVED: "Jäsen poistettu.",
        MEMBER_NOT_FOUND: "Jäsentä ei löytynyt.",
        QUICK_MESSAGE_EMPTY: "Pikaviesti ei voi olla tyhjä.",
        SAVE_FAILED: "Tallennus epäonnistui.",
        SAVE_ERROR: "Virhe tallennuksessa.",
        INVALID_QUICK_MESSAGES: "Virheelliset pikaviestit.",
        NOT_OWNER: "Vain omistaja voi tehdä.",
        BOARD_DELETED: "Taulu poistettu.",
        LEAVE_BOARD_CONFIRM: "Haluatko varmasti poistua tältä taululta?\n\nKäyttäjätilisi poistetaan tältä taululta.",
        USER_REMOVED: "Käyttäjä poistettu.",
        DELETE_FAILED: "poisto epäonnistui. (ei oikeuksia tai virhe serverillä).",
        NETWORK_ERROR: "Verkkovirhe.",
        BACK_CATEGORIES: "Kategoriat",
        BOARD_TYPE_FAMILY: "perhe",
        BOARD_TYPE_NOTICE: "ilmoitus",
        NO_TOPICS_IN_CATEGORY: "Ei aiheita tässä kategoriassa.",
        BOARD_NAME_RESERVED: "Taulun nimi on varattu.",
        TOPIC_ALREADY_EXISTS: "Aihe on jo olemassa.",
        confirmDeleteBoard: "Oletko varma että haluat poistaa taulun?",
        information: "Info",
        general: "Yleiset",
        maintenance: "Huolto",
        events: "Tapahtumat",
        confirmDeleteSauna: "Haluatko varmasti poistaa saunavuorot listan?",
        confirmDeleteAuto: "Haluatko varmasti poistaa parkkipaikat listan?",
        announcement: "Ilmoitukset",
        recommendations: "Suositukset",
        topic: "Aihe",
        topics: "Aiheet",
        writeMessage: "Kirjoita viesti...",
        training: "Harjoitukset",
        AUTO: "Autopaikat",
        meetings: "Kokoukset",
        "select topic": "valitse aihe",
        "general information": "Info",
        CONTACT_TITLE: "Yhteystiedot",
        NOTICE_TITLE: "Tiedotteet",
        NOTICE_HEADER: "Tiedote",
        CONTACT_HEADER: "Yhteystieto",
        NAME: "Nimi",
        ADDRESS: "Osoite",
        PHONE: "Puhelin",
        MESSAGES: "viestit",
        EMAIL: "Sähköposti",
        SUBJECT: "Kuvaus",
        ADDITIONAL_INFO: "Lisätiedot",
        announcements: "Tiedotteet",
        MEMBERS_TITLE: "Jäsenet",
        CP_JOIN_TITLE: "Liittymis pyynnöt",
        LOGIN_TITLE: "Kirjaudu Taululle",
        JOIN_TITLE: "Liity Taululle",
        CREATE_BOARD_TITLE: "Luo Taulu",
        OPEN_BOARD: "Avaa Taulu",
        JOIN_BOARD: "Liity Taululle",
        LEAVE_BOARD: "Poistu Taululta",
        CREATE_BOARD: "Luo Taulu",
        BOARD_NAME: "Taulun nimi",
        USERNAME: "Käyttäjänimi",
        SAUNA_TITLE: "Saunavuorot",
        AUTO_TITLE: "Autopaikat",
        PARKING_SLOTS_CREATED: "Autopaikkojen luonti onnistui.",
        PARKING_SLOTS_CREATE_FAILED: "Autopaikkojen luonti epäonnistui.",
        PASSWORD: "Salasana",
        SEND_REQUEST: "Lähetä Pyyntö",
        SAUNA_SLOT_SAVE: "Saunavuorot talletettu.",
        SAUNA_SLOT_SAVE_FAILED: "Saunavuorojen talletus epäonnistui.",
        CANCEL: "Peru",
        CREATE_TOPIC_TITLE: "Uusi Info",
        SAUNA_SLOT_CREATE_NO_SUCCESS: "Saunavuorolistan luonti epäonnistui.",
        CREATE_BTN: "Luo",
        SAVE_BTN: "Talleta",
        SAUNA: "Saunavuorot",
        NEW_TOPIC: "Uusi Info",
        SEND: "Lähetä",
        CLEAR: "Tyhjennä",
        SETTINGS: "Asetukset",
        MEMBERS: "Jäsenet",
        BOARD_COUNT: "Taulut",
        TODAY: "tänään",
        EDIT: "muokkaa",
        SAUNALIST_LOAD_NO_SUCCESS:"Saunavuoro listan lataaminen epäonnistui.",
        PARKING_SLOTS_NOT_CREATED: "Autopaikkoja ei ole vielä luotu.",
        SELECT_TOPIC: "Valitse aihe ensin.",
        IMPORTANT: "tärkeä",
        INFO: "info",
        LOGOUT: "Kirjaudu ulos",
        DELETE_BOARD: "Poista taulu",
        REQUESTS: "Pyynnöt",
        NOTICE_TALOYHTIO: "taloyhtiö",
        NOTICE_YHTEISO: "yhteisö",
        NOTICE_URHEILUSEURA: "urheiluseura",
        OWNER_CATEGORY_NO_MESSAGES: "Omistajan kategoria, ei viestejä.",
        NOTICE_YHDISTYS: "yhdistys"
        },
    en: {
        QUICK_AT_STORE: "At the store",
        QUICK_AT_WORK: "At work",
        QUICK_AT_HOME: "At home",
        QUICK_SLEEPING: "Sleeping",
        QUICK_EATING: "Eating",
        QUICK_COMING: "Coming",
        QUICK_LATE: "Running late",
        QUICK_SICK_LEAVE: "On sick leave",
        QUICK_BREAK: "On a break",
        QUICK_GYM: "At the gym",
        SAUNA_SAVE: "Save",
        SAUNA_EDIT: "Edit",
        SAUNA_DELETE: "Delete",
        SAUNA_CLOSE: "Close",
        AUTO_CREATE: "Create",
        AUTO_CLOSE: "Close",
        AUTO_EDIT: "Edit",
        AUTO_CLOSES: "Close",
        AUTO_DELETE: "Delete",
        AUTO_SAVE: "Save",
        Header: "Header",
        ADMIN_LOGIN_FAILED: "Invalid admin username or password.",
        BOARD_NOT_FOUND: "Board not found.",
        BOARD_INFO: "Notice Board",
        WELCOME_TEXT: "Welcome to your board system!",
        PARKING_SLOTS_NOT_CREATED: "Parking spaces have not been created yet.",
        new_topic: "New Info",
        onlyOwnerCanWrite: "Only the owner can write to this chain.",
        PleaseSelectTopicFirst: "Select topic first.",
        confirmRemoveMessage: "You want to remove this message?",
        confirmRemoveMessages: "You want to remove this message chain?",
        LOGIN_FAILED: "Login failed.",
        CONTACT_TITLE: "Contact infos",
        NOTICE_TITLE: "Notices",
        NOTICE_HEADER: "Notice",
        CONTANT_HEADER: "Contact info",
        NAME: "Name",
        ADDRESS: "Address",
        MESSAGES: "messages",
        SELECT_EXISTING_TOPIC: "Select existing topic",
        PHONE: "Phone",
        EMAIL: "Email",
        SUBJECT: "Description",
        ADDITIONAL_INFO: "Addition info",
        SAUNA: "Sauna List",
        AUTO: "Parking Slots",
        SAUNA_SLOT_CREATE_NO_SUCCESS: "Could not create sauna slots.",
        SAUNALIST_LOAD_NO_SUCCESS:"Could not load sauna list.",
        CREATE_SAUNA_SLOTS: "Do you want to create sauna slots?",
        BOARD_EXISTS: "Board already exists.",
        BOARD_CREATED: "Board created.",
        M_ROLE: "owner",
        MM_ROLE: "member",
        REMOVE_USER_CONFIRM: "Remove user?",
        ONLY_OWNER_EDIT: "Only owner can edit.",
        OWNER_CATEGORY_NO_MESSAGES: "Owner category no messages.",
        BACK_CATEGORIES: "Categories",
        DATABASE_ERROR: "Database error.",
        LOGIN_AGAIN: "Please login again.",
        NO_PERMISSION: "No permission.",
        TOPIC_ALREADY_EXISTS: "Topic already exists",
        MEMBERS_TITLE: "Members",
        CP_JOIN_TITLE: "Join Requests",
        SAVE: "Save done.",
        HOME: "Home",
        PARKING_SLOTS_CREATED: "Parking slots created.",
        NO_PENDING: "No pending requests.",
        PARKING_SLOTS_CREATE_FAILED: "Parking slots creation failed.",
        SAUNA_TITLE: "Sauna List",
        SELECT_TOPIC: "Select topic first.",
        AUTO_TITLE: "Parking Slots",
        MESSAGES_CLEARED: "Messages cleared.",
        USERNAME_EXISTS: "Username already exists.",
        REQUEST_PENDING: "Request already pending.",
        REQUEST_SENT: "Join request sent.",
        JOIN_REQUEST_FAILED: "Join request failed.",
        confirmDeleteBoard: "Are you sure you want to remove table?",
        TOPIC_TOO_LONG: "Topic can contain a maximum of 40 characters.",
        TOPIC_MISSING: "Topic is missing.",
        MESSAGE_MISSING: "Message is missing.",
        USER_NOT_FOUND: "User not found.",
        ONLY_OWNER_INFORMATION: "Only owner can add Information.",
        TOPIC_CREATED: "Topic created.",
        REMOVE_FAILED: "Remove failed.",
        NO_TOPICS_IN_CATEGORY: "No topics in this category",
        ONLY_OWNER_REMOVE: "Only owner can remove members.",
        BOARD_NAME_RESERVED: "Board name is reserved.",
        MEMBER_REMOVED: "Member removed.",
        MEMBER_NOT_FOUND: "Member not found.",
        QUICK_MESSAGE_EMPTY: "Quick message cannot be empty.",
        SAVE_FAILED: "Save failed.",
        SAUNA_SLOT_SAVE: "Sauna slots saved.",
        SAUNA_SLOT_SAVE_FAILED: "Sauna slots save failed.",
        SAVE_ERROR: "Error saving.",
        INVALID_QUICK_MESSAGES: "Invalid quick messages.",
        NOT_OWNER: "Only owner can do this.",
        BOARD_DELETED: "Board deleted.",
        LEAVE_BOARD_CONFIRM: "Are you sure you want to leave this board?\n\nYour user account will be removed from this board.",
        USER_REMOVED: "User removed.",
        BOARD_COUNT: "Boards",
        DELETE_FAILED: "Delete failed (no permission or server error).",
        NETWORK_ERROR: "Network error.",
        BOARD_TYPE_FAMILY: "family",
        BOARD_TYPE_NOTICE: "notice",
        information: "information",
        general: "General",
        maintenance: "Maintenance",
        confirmDeleteSauna: "Do you want to delete sauna slots?",
        confirmDeleteAuto: "Do you want to delete auto slots?",
        events: "Events",
        topic: "Topic",
        topics: "Topics",
        writeMessage: "Write message...",
        recommendations: "recommendations",
        training: "training",
        meetings: "meetings",
        "select topic": "select topic",
        "general information": "Information",
        announcements: "Notices",
        LOGIN_TITLE: "Login Board",
        SAUNA_DELETED: "Sauna slots deleted.",
        AUTO_DELETED: "Auto slots deleted.",
        JOIN_TITLE: "Join Board",
        CREATE_BOARD_TITLE: "Create Board",
        OPEN_BOARD: "Open Board",
        JOIN_BOARD: "Join Board",
        CREATE_BOARD: "Create Board",
        BOARD_NAME: "Board Name",
        USERNAME: "Username",
        PASSWORD: "Password",
        SEND_REQUEST: "Send Request",
        CANCEL: "Cancel",
        CREATE_TOPIC_TITLE: "Create New Topic",
        CREATE_BTN: "Create",
        SAVE_BTN: "Save",
        NEW_TOPIC: "New Topic",
        SEND: "Send",
        CLEAR: "Clear",
        SETTINGS: "Settings",
        MEMBERS: "Members",
        LEAVE_BOARD: "Leave Board",
        TODAY: "today",
        EDIT: "edit",
        IMPORTANT: "important",
        INFO: "info",
        LOGOUT: "Logout",
        DELETE_BOARD: "Delete Board",
        REQUESTS: "Requests",
        NOTICE_TALOYHTIO: "housing company",
        NOTICE_YHTEISO: "community",
        NOTICE_URHEILUSEURA: "sports club",
        NOTICE_YHDISTYS: "association"
        }
    };


const categories_family = [];

const categories_taloyhtio = [
    "general information",
    "announcements",
    "general",
    "maintenance",
    "events"
];

/*yleiset tiedot, tiedotteet*/

const categories_yhteiso = [
    "general information",
    "announcements",
    "general",
    "recommendations",
    "events"
];

const categories_urheiluseura = [
    "general information",
    "announcements",
    "general",
    "training",
    "events"
];

const categories_yhdistys = [
    "general information",
    "announcements",
    "general",
    "meetings",
    "events"
];

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("boardCount")) {
        loadBoardCount();
        initApp();
        clearLoginFields();
    } else {
        initApp();
    }
});


function changeTemplate() {

    const type = document.getElementById("messageTemplate").value;

    const templates = getMessageTemplates();
    const template = templates[type];

    document.getElementById("cp_topic").value = template.title;
    document.getElementById("cp_header").value = template.header;
    document.getElementById("cp_message").value = template.text;
}

//SCF

async function showCategories() {

    console.log("SHOW CATEGORIES CALLED");

    const el = document.getElementById("boardCategoriesView");

    el.style.display = "grid";
    el.style.height = "100%";

    document.getElementById("saunaBtn").style.display = "block";
    document.getElementById("autoBtn").style.display = "block";
    document.getElementById("clearBtn").style.display = "none";
    document.getElementById("boardTopicsView").style.display = "none";
    document.getElementById("boardMessagesDiv").style.display = "none";
    document.getElementById("backToCategoriesBtn").style.display = "none";
    
    renderCategories();
    loadTopicCounts();

    const boardName = localStorage.getItem("boardName");

    const response = await fetch(
    `http://localhost:3000/board/${boardName}`,
    {
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    }
);

    const data = await response.json();

    updateVisitedUI(data);
}

async function updateVisitedUsers() {

    const boardName = localStorage.getItem("boardName");

    const response = await fetch(
        `http://localhost:3000/board/${boardName}`,
        {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }
    );

    const data = await response.json();

    if (data.success) {
        updateVisitedUI(data);
    }
}

function showTopics() {
    
    console.log("SHOW TOPICS CALLED");
    document.getElementById("boardTopicsView").style.display = "grid";
    document.getElementById("backToCategoriesBtn").style.display = "block";
    document.getElementById("boardCategoriesView").style.display = "none";   
    document.getElementById("boardMessagesDiv").style.display = "none";   
    document.getElementById("saunaBtn").style.display = "none";
    document.getElementById("autoBtn").style.display = "none";
    document.getElementById("clearBtn").style.display = "none";
    
}

function showMessages() {
       
    document.getElementById("boardMessagesDiv").style.display = "block";
    document.getElementById("boardCategoriesView").style.display = "none";
    document.getElementById("boardTopicsView").style.display = "none";   
    document.getElementById("saunaBtn").style.display = "none";
    document.getElementById("autoBtn").style.display = "none";

    const role = localStorage.getItem("role");
    const editMode = document.getElementById("editMode")?.checked;

    document.getElementById("clearBtn").style.display =
        (role === "owner" && editMode)
        ? ""
        : "none";
      
    backToCategoriesBtn.style.display = "block";
}

function editMessage(msg) {

    editingTopicId = msg.id;

    document.getElementById("cp_header").value = msg.header;
    document.getElementById("cp_category").value = msg.category;
    document.getElementById("cp_topic").value = msg.topic;
    document.getElementById("cp_message").value = msg.text;

    document.getElementById("cp_createBtn").innerText = t("SAVE_BTN");

    openTopicPopup();
}

// RCF

function renderCategories() {

  console.log("RENDER CATEGORIES CALLED");

  const el = document.getElementById("boardCategoriesView");

  const main = [
      "general information",
      "announcements"
  ];

  const other = categories.filter(
      c => !main.includes(c)
  );


  el.innerHTML = `

  <div id="mainCategories">
      ${main.map(category => `
          <div class="category-card"
              data-category="${category}"
              onclick="openCategory('${category}', this)">
              ${t(category)}
          </div>
      `).join("")}
  </div>


  <div id="otherCategories">
      ${other.map(category => `
          <div class="category-card"
              data-category="${category}"
              onclick="openCategory('${category}', this)">
              ${t(category)}
          </div>
      `).join("")}
  </div>

  `;

}

function openCategory(category, el) {

    el.classList.add("pressed");

    setTimeout(() => {

        el.classList.remove("pressed");

        loadTopicsFromDatabase(category)
            .then(data => {

                if (data.topics.length === 0) {
                    alert(t("NO_TOPICS_IN_CATEGORY"));
                    return;
                }

                currentCategory = category;
                currentTopic = "";

                localStorage.setItem("currentCategory", category);
                localStorage.removeItem("currentTopic");

                showTopics();
            });

    }, 400);
}

function t(key) {

    const lang = localStorage.getItem("language") || "fi";

    return messages[lang][key] || key;
}

function setText(id, key) {

    const el = document.getElementById(id);

    if (el) {
        el.textContent = t(key);
    }
}

function setPlaceholder(id, key) {

    const el = document.getElementById(id);

    if (el) {
        el.placeholder = t(key);
    }
}

// =====================
// APP INIT
// =====================

function initApp() {

  console.log("INIT APP CALLED");

  bindUI();
  autoLoginFill();

  loadBoardDescription();

  initLanguageButtons();   // <-- tähän
  // Käännä aina nykyinen sivu
  initLanguage();

  if (document.getElementById("boardMessagesDiv")) {
    initBoard();
  }
}


// =====================
// UI EVENTS
// =====================

function bindUI() {
  
  const msgInput = document.getElementById("boardNewMsg");

  if (msgInput) {
    msgInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        updateMessage();
      }
    });
  }

  document.addEventListener("change", (e) => {
  if (e.target?.id === "todayMode") {
    loadMessage(true);
  }
});
}

// =====================
// SAFE HELPERS
// =====================

function getBoardName() {
  return localStorage.getItem("boardName");
}


// =====================
// AUTO LOGIN FILL
// =====================

function autoLoginFill() {

  if (!document.getElementById("boardName")) {
    return;
}

  const boardName = localStorage.getItem("boardName");
  const boardUsername = localStorage.getItem("boardUsername");
  const token = localStorage.getItem("token");

  // täytä kentät
  const boardNameInput = document.getElementById("boardName");
  const boardUsernameInput = document.getElementById("boardUsername");

  boardNameInput && (boardNameInput.value = boardName || "");
  boardUsernameInput && (boardUsernameInput.value = boardUsername || "");

  // Home-painikkeella tullessa ohita autologin kerran
if (sessionStorage.getItem("skipAutoLogin")) {
  sessionStorage.removeItem("skipAutoLogin");
  return;
}

  // ei tokenia -> ei autologinia
  if (!boardName || !token) {
    return;
  }

  fetch("http://localhost:3000/authCheck", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      boardName
    })
  })
  .then(r => r.json())
  .then(data => {

    if (!data.success) {
      localStorage.removeItem("token");
      return;
    }
    window.location.href = "board.html";
  });
}

// =====================
// BOARD INIT
// =====================

// IBF

function initBoard() {

  console.log("INIT BOARD CALLED");

  console.log(
    "INIT START:",
    document.documentElement.scrollHeight
);

console.log("1: ", window.innerHeight);
console.log("2: ",document.documentElement.scrollHeight);

  let boardName = localStorage.getItem("boardName");

  /*
  if (!boardName) {
  console.log("NO BOARD NAME");
  return;
}*/

console.log("BOARD NAME:", boardName);

  if (!boardName) {
    window.location.href = "index.html";
    return;
  }

    console.log("LOCAL STORAGE TEST");

  const role = localStorage.getItem("role");
  const boardType = localStorage.getItem("boardType");
  const noticeTemplate = localStorage.getItem("noticeTemplate");
  const quickBtn = document.getElementById("quickMessagesBtn");
  const templateSection = document.getElementById("templateSection");

  console.log("INIT BOARD TYPE:", boardType);

  if (quickBtn) {
    quickBtn.style.display =
    boardType === "notice" ? "none" : "inline";
  }

  if (boardType === "notice") {
    document.body.classList.add("notice-board");
  } else {
    document.body.classList.remove("notice-board");
  }

if (boardType === "notice") {

    categories = getCategories(boardType, noticeTemplate);

    const savedCategory = localStorage.getItem("currentCategory") || "general information";
    currentCategory = savedCategory;

    loadCategories();

} else {

    currentCategory = "";
    currentTopic = "";

    document.getElementById("boardCategoriesView").style.display = "none";
    document.getElementById("boardTopicsView").style.display = "none";
}

   const ownerCategories = [
    "general information",
    "announcements"
];

const templateSelect = document.getElementById("messageTemplate");

if (templateSelect) {
    templateSelect.value = "general";
}

updateTemplateVisibility();

  clearMessages();

  const ownerButtons = [
    "requestsBtn",
    "settingsBtn",
    "deleteBoardBtn",
    "clearBtn"
  ];

  ownerButtons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn && role !== "owner") {
      btn.style.display = "none";
    }
  });

  // Näkyvät vain memberille
  const memberButtons = ["leaveBoardBtn"];

  memberButtons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn && role !== "member") {
    btn.style.display = "none";
    }
  });

  boardName = getBoardName();
  const boardNameEl = document.getElementById("boardTitle");
  const box = document.getElementById("boardMessagesDiv");

  if (!boardNameEl || !box || !boardName) return;

  boardNameEl.innerText = boardName;

  const leaveBtn = document.getElementById("leaveBoardBtn");

  if (leaveBtn) {
    leaveBtn.style.display = "none";
  }

  updateEditModeUI();

  setInterval(() => {

  if (document.getElementById("boardCategoriesView").style.display !== "none") {
        updateVisitedUsers();
  }

  }, 10000);

  if (refreshInterval) clearInterval(refreshInterval);

  //TÄÄ OTETAAN KÄYTTÖÖN KUN VALMISTUU!
  /*
  const refreshTime = boardType === "notice" ? 60000 : 15000;

  refreshInterval = setInterval(() => {
  
    if (!document.hidden) {
      loadMessage(false);
    }
  }, refreshTime);
*/
  if (boardType === "notice") {
    initNoticeBoard();
    document.getElementById("cp_important").checked = false;
    document.getElementById("cp_info").checked = false;
  } else {
      initFamilyBoard();
  }

  // Notice Uusi Aihe 
 if (boardType === "notice") {

    document.getElementById("topicBtn").style.display = "block";

    if (noticeTemplate === "taloyhtio") {

        document.getElementById("saunaBtn").style.display = "block";
        document.getElementById("autoBtn").style.display = "block";

    } else {

        document.getElementById("saunaBtn").style.display = "none";
        document.getElementById("autoBtn").style.display = "none";
        
    }

} else {

    document.getElementById("topicBtn").style.display = "none";
    document.getElementById("saunaBtn").style.display = "none";
    document.getElementById("autoBtn").style.display = "none";
}
}

function initFamilyBoard() {

    //topicSummary.style.display = "none";
    
    updateRequestBadge();
    loadMessage(true);
    
}

function initNoticeBoard() {

    clearMessages();

    showCategories();

    loadTopicCounts();

    updateRequestBadge();
}

function initLanguageButtons() {

  const langFi = document.getElementById("langFi");
  const langEn = document.getElementById("langEn");

  if (langFi) {
    langFi.onclick = () => {
    localStorage.setItem("language", "fi");
    initLanguage();
    loadBoardCount();
    };
  }

  if (langEn) {
    langEn.onclick = () => {
    console.log("EN clicked");
    localStorage.setItem("language", "en");
    initLanguage();
    loadBoardCount();
    };
    }
  }

  function updateTemplateVisibility() {
    const templateSection = document.getElementById("templateSection");
    const role = localStorage.getItem("role");

    const ownerCategories = [
        "general information",
        "announcements"
    ];

    if (templateSection) {
        templateSection.style.display =
            role === "owner" &&
            ownerCategories.includes(currentCategory)
                ? "block"
                : "none";
    }
}

function loadBoardDescription() {

    const el = document.getElementById("boardDescription");
    if (!el) return;

    const lang = localStorage.getItem("language") || "fi";
    const template = localStorage.getItem("noticeTemplate");
    const boardType = localStorage.getItem("boardType") || "family";

    if (boardType === "notice" && template) {
        el.textContent = boardDescriptions[lang][template];
    } else {
        el.textContent = boardDescriptions[lang].family;
    }
}

function getCategories(boardType, noticeTemplate) {
   
    console.log("GET CATEGORIES CALLED");

    if (boardType === "notice") {

      switch (noticeTemplate) {

        case "taloyhtio":
          return categories_taloyhtio;

        case "yhteiso":
          return categories_tyopaikka;

        case "urheiluseura":
          return categories_urheiluseura;

        case "yhdistys":
          return categories_yhdistys;

        default:
          return categories_taloyhtio;
        }
    }

    return categories_family;
}

function renderTopicsMessages(topics) {

    console.log("RENDER TOPICS GRID:", topics);

    const el = document.getElementById("boardTopicsView");

    if (!el) return;

    el.innerHTML = "";

    topics.forEach(topic => {

        const card = document.createElement("div");

        card.className = "topic-card";
        card.dataset.topic = topic.topic;

        const title = document.createElement("span");
        title.innerText = topic.topic;

        const count = document.createElement("span");
        count.className = "topic-count";
        count.innerText = `(${topic.count})`;

        card.appendChild(title);
        card.appendChild(count);


        card.onclick = () => {

            card.classList.add("pressed");

            setTimeout(() => {

                card.classList.remove("pressed");

                currentTopic = topic.topic;
                updateCurrentLocation();

                localStorage.setItem("currentTopic", topic.topic);

                showMessages();
                loadMessage(true);

            }, 400);
        };

        el.appendChild(card);
    });
}


//BCF

function backToCategories() {

    console.log("BACK TO CATEGORY CALLED");

    const msg = document.getElementById("boardMessagesDiv");
    const boardType = localStorage.getItem("boardType");
    const noticeTemplate = localStorage.getItem("noticeTemplate");

    const location = document.getElementById("currentLocation");
    //const visited = document.getElementById("visitedUsers");

    if (location) {
      location.innerText = "";
    }

    /*
    if (visited) {
      visited.innerHTML="";
    }
    */

    if (msg) {
        msg.style.display = "none";
        msg.innerHTML = "";
    }

    document.getElementById("boardCategoriesView").style.display = "grid";
    document.getElementById("boardTopicsView").style.display = "none";
    document.getElementById("boardTopicsView").innerHTML = "";
    backToCategoriesBtn.style.display = "none";
    document.getElementById("saunaBtn").style.display = "none";
    document.getElementById("autoBtn").style.display = "none";
    document.getElementById("clearBtn").style.display = "none";

    if (
        boardType === "notice" &&
        noticeTemplate === "taloyhtio"
    ) {
        document.getElementById("saunaBtn").style.display = "block";
        document.getElementById("autoBtn").style.display = "block";
       
    }

    currentCategory = "";
    currentTopic = "";
    
    localStorage.removeItem("currentCategory");
    localStorage.removeItem("currentTopic");

    //document.getElementById("currentLocation").style.display = "none";

    //updateCurrentLocation();
}

//OSF

async function openSauna() {

    console.log("OPEN SAUNA CALLED");

    saunaEditMode = false;

    const userRole = localStorage.getItem("role");
    const boardType = localStorage.getItem("boardType");
    const noticeTemplate = localStorage.getItem("noticeTemplate");

    document.getElementById("saveSaunaBtn").style.display = "none";

    if (
        boardType === "notice" &&
        noticeTemplate === "taloyhtio" &&
        userRole === "owner"
    ) {
        document.getElementById("editSaunaBtn").style.display = "block";
        document.getElementById("deleteSaunaBtn").style.display = "none";
    } else {
        document.getElementById("editSaunaBtn").style.display = "none";
        document.getElementById("deleteSaunaBtn").style.display = "none";
    }

    const boardName = localStorage.getItem("boardName");
    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:3000/saunaSlots",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                boardName
            })
        }
    );

    const data = await response.json();

    if (!data.success) {
        alert(t("SAUNALIST_LOAD_NO_SUCCESS"));
        return;
    }

    saunaSlots = data.slots;

    // SaunaSlots puuttuvat → kysytään ownerilta
    if (data.needsCreation && userRole === "owner") {

        if (!confirm(t("CREATE_SAUNA_SLOTS"))) {
            return;
        }

        // OK → luodaan default-saunavuorot
        const created = await createSaunaSlots(boardName, token);

        if (!created) {
            return;
        }

        // Haetaan juuri luodut vuorot uudelleen
        const reloadResponse = await fetch(
            "http://localhost:3000/saunaSlots",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    boardName
                })
            }
        );

        const reloadData = await reloadResponse.json();

        if (!reloadData.success) {
            alert(t("SAUNALIST_LOAD_NO_SUCCESS"));
            return;
        }

        saunaSlots = reloadData.slots;
        }

        if (saunaSlots.length === 0) {
            alert(t("SAUNALIST_LOAD_NO_SUCCESS"));
            return;
        }

        renderSaunaTable();

        document.getElementById("saunaPopup").style.display = "flex";
}

function deleteSaunaSlots() {

    console.log("DELETE SAUNA CALLED");

    if (!confirm(t("confirmDeleteSauna"))) {
        return;
    }

    const boardName = localStorage.getItem("boardName");
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3000/deleteSaunaSlots/${boardName}`, {

        method: "DELETE",

        headers: {
            "Authorization": token
        }

    })
    .then(async (res) => {

        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.success) {

            alert(t(data?.message || "DELETE_FAILED"));
            return;

        }

        alert(t(data.message || "DELETE_SUCCESS"));

        closeSauna();

    });
}

async function createSaunaSlots(boardName, token) {

    const response = await fetch(
        "http://localhost:3000/createSaunaSlots",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                boardName
            })
        }
    );

    const data = await response.json();

    if (!data.success) {
        alert(t("SAUNA_SLOT_CREATE_NO_SUCCESS"));
        return false;
    }

    return true;
}

function renderSaunaTable() {

    const table = document.querySelector("#saunaTable");
    const tableHead = table.querySelector("thead");
    const tableBody = table.querySelector("tbody");

    tableBody.innerHTML = "";

    // Jos language puuttuu, käytetään suomea
    const language = localStorage.getItem("language") || "fi";

    const translations = {

        fi: {
            time: "Aika",
            Ke: "Ke",
            To: "To",
            Pe: "Pe",
            La: "La"
        },

        en: {
            time: "Time",
            Ke: "Wed",
            To: "Thu",
            Pe: "Fri",
            La: "Sat"
        }
    };

    const t = translations[language] || translations.fi;

    // Taulukon otsikot
    tableHead.innerHTML = `
        <tr>
            <th>${t.time}</th>
            <th>${t.Ke}</th>
            <th>${t.To}</th>
            <th>${t.Pe}</th>
            <th>${t.La}</th>
        </tr>
    `;

    const rows = {};

    saunaSlots.forEach(slot => {

        if (!rows[slot.time]) {

            rows[slot.time] = {

                Ke: {
                    familyName: "-",
                    familyName2: ""
                },

                To: {
                    familyName: "-",
                    familyName2: ""
                },

                Pe: {
                    familyName: "-",
                    familyName2: ""
                },

                La: {
                    familyName: "-",
                    familyName2: ""
                }
            };
        }

        rows[slot.time][slot.day] = {

            familyName: slot.familyName ?? "-",

            familyName2: slot.familyName2 ?? ""
        };
    });

    Object.keys(rows).forEach(time => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${time}</td>

            <td>${renderSaunaCell(rows[time].Ke, "Ke", time)}</td>

            <td>${renderSaunaCell(rows[time].To, "To", time)}</td>

            <td>${renderSaunaCell(rows[time].Pe, "Pe", time)}</td>

            <td>${renderSaunaCell(rows[time].La, "La", time)}</td>
        `;

        tableBody.appendChild(row);
    });
}

function renderSaunaCell(value, day, time) {

    if (saunaEditMode) {

        return `
            <input
                class="saunaInput" maxlength="15"
                data-day="${day}"
                data-time="${time}"
                value="${value.familyName === "-" ? "" : value.familyName}">

            <input
                class="saunaInput" maxlength="15"
                data-day="${day}"
                data-time="${time}"
                value="${value.familyName2}">
        `;

    } else {

    if (value.familyName2) {
        return `${value.familyName}<br>${value.familyName2}`;
    }

    return value.familyName;

}
}

async function saveSauna() {

    const boardName = localStorage.getItem("boardName");

    const slots = [];

    const slotMap = {};

    document.querySelectorAll(".saunaInput").forEach(input => {

        const key = `${input.dataset.day}_${input.dataset.time}`;

        if (!slotMap[key]) {

            slotMap[key] = {
                day: input.dataset.day,
                time: input.dataset.time,
                familyName: "",
                familyName2: ""
            };

        }

        if (slotMap[key].familyName === "") {

            slotMap[key].familyName = input.value;

        } else {

            slotMap[key].familyName2 = input.value;

        }

    });

    Object.values(slotMap).forEach(slot => {

        slots.push(slot);

    });

    const response = await fetch(
        "http://localhost:3000/updateSaunaSlots",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            },

            body: JSON.stringify({
                boardName,
                slots
            })
        }
    );

    const data = await response.json();

    if (data.success) {

        saunaEditMode = false;

        await openSauna();

        alert(t("SAUNA_SLOT_SAVE"));

    } else {

        alert(t("SAUNA_SLOT_SAVE_FAILED"));

    }
}

function closeSauna() {

    saunaEditMode = false;

    document.getElementById("editSaunaBtn").style.display = "none";
    document.getElementById("deleteSaunaBtn").style.display = "none";
    document.getElementById("saveSaunaBtn").style.display = "none";

    document.getElementById("saunaPopup").style.display = "none";
}

//ESF

function editSauna() {

    const userRole = localStorage.getItem("role");

    if (userRole !== "owner") {
        return;
    }

    saunaEditMode = true;

    document.getElementById("editSaunaBtn").style.display = "none";
    document.getElementById("deleteSaunaBtn").style.display = "block";
    document.getElementById("saveSaunaBtn").style.display = "block";

    renderSaunaTable();
}

async function createAutoSlots() {

    const boardName = localStorage.getItem("boardName");
    const count = Number(document.getElementById("autoCountInput").value);
    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:3000/createAutoSlots",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                boardName,
                count
            })
        }
    );

    const data = await response.json();

    if (data.success) {

        document.getElementById("autoPopup").style.display = "none";

        alert(t("PARKING_SLOTS_CREATED"));

    } else {

        alert(t("PARKING_SLOTS_CREATE_FAILED"));

    }
}

function showAutoCreate() {

    const content = document.getElementById("autoPopupContent");

    content.innerHTML = `
        <h3 class="h3">
            ${t("AUTO_TITLE")} 
        </h3>

        <input id="autoCountInput" type="number" value="5">

        <button id="createAutoPopupBtn"
                class="light-blue-btn-90"
                onclick="createAutoSlots()">
           ${t("AUTO_CREATE")}       
        </button>

        <button id="closeAutoPopupBtn"
                class="light-blue-btn-90"
                onclick="closeAutoPopup()">
            ${t("AUTO_CLOSE")}  
        </button>
    `;

    document.getElementById("autoPopup").style.display = "flex";
}

async function openAuto() {

    console.log("OPEN AUTO CALLED");

    const boardName = localStorage.getItem("boardName");
    const userRole = localStorage.getItem("role");

    const response = await fetch(
        `http://localhost:3000/autoSlots/${boardName}`
    );

    const data = await response.json();

    console.log("hep: ", data.slots.length);

    if (data.slots.length === 0) {

    if (userRole === "owner") {

        showAutoCreate();

    } else {

        alert(t("PARKING_SLOTS_NOT_CREATED"));

    }

} else {

    renderAutoSlots(data.slots);

}
}

function renderAutoSlots(slots) {

    console.log("RENDER AUTO SLOTS");

    const userRole = localStorage.getItem("role");
    const boardType = localStorage.getItem("boardType");
    const noticeTemplate = localStorage.getItem("noticeTemplate");

    autoSlots = slots;

    const content = document.getElementById("autoPopupContent");

    content.innerHTML = "";


let html = `
    <h3 class="h3">
        ${t("AUTO_TITLE")}
    </h3>

    <div class="auto-grid">
`;

slots.forEach(slot => {

    html += `
        <div class="auto-slot">
            <span class="auto-slot-name">
                ${slot.slot_name}
            </span>

            <span class="auto-slot-info">
                ${slot.info || "-"}
            </span>
        </div>
    `;

});

    html += `
        <div class="popup-buttons">
            <button id="editAutoPopupBtn" class="light-blue-btn-90" onclick="editAutoSlots()">
                ${t("AUTO_EDIT")} 
            </button>

            <button id="closeAutoPopupBtn" class="light-blue-btn-90" onclick="closeAutoPopup()">
                ${t("AUTO_CLOSES")} 
            </button>
        </div>
    `;


    content.innerHTML = html;

  const editBtn = document.getElementById("editAutoPopupBtn");

  if (
    boardType === "notice" &&
    noticeTemplate === "taloyhtio" &&
    userRole === "owner"
  ) {
    editBtn.style.display = "block";
  } else {
    editBtn.style.display = "none";
  }

    document.getElementById("autoPopup").style.display = "flex";
}

function editAutoSlots() {
    
    console.log("EDIT AUTO SLOTS");
    const content = document.getElementById("autoPopupContent");

let html = `
    <h3 class="h3">
        ${t("AUTO_TITLE")}
    </h3>

    <div class="auto-edit-grid">
`;

autoSlots.forEach(slot => {

    html += `
        <div class="auto-edit-slot">

            <input
                value="${slot.slot_name || ""}" maxlength="15"
                data-id="${slot.id}"
                class="slot-input">

            <input
                value="${slot.info || ""}" maxlength="15"
                data-id="${slot.id}"
                class="info-input">

        </div>
    `;

});

    html += `
        </div>
        <button id="saveAutoPopupBtn" class="light-blue-btn-90" onclick="saveAutoSlots()">
            ${t("AUTO_SAVE")}
        </button>

        <button id="deleteAutoPopupBtn" class="light-blue-btn-90" onclick="deleteAutoSlots()">
                ${t("AUTO_DELETE")}
            </button>

        <button id="cancelAutoPopupBtn" class="light-blue-btn-90" onclick="renderAutoSlots(autoSlots)">
            ${t("AUTO_CLOSES")} 
        </button>
    `;

    content.innerHTML = html;
}

function deleteAutoSlots() {

    console.log("DELETE AUTO CALLED");

    if (!confirm(t("confirmDeleteAuto"))) {
        return;
    }

    const boardName = localStorage.getItem("boardName");
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3000/deleteAutoSlots/${boardName}`, {

        method: "DELETE",

        headers: {
            "Authorization": token
        }

    })
    .then(async (res) => {

        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.success) {

            alert(t(data?.message || "DELETE_FAILED"));
            return;

        }

        alert(t(data.message || "DELETE_SUCCESS"));

        autoSlots = [];

        closeAutoPopup();

    });
}

async function saveAutoSlots() {

  console.log("SAVE AUTO SLOTS");

  const rows = document.querySelectorAll(".auto-edit-slot");

  const slots = [];

  rows.forEach(row => {

      const name = row.querySelector(".slot-input");
      const info = row.querySelector(".info-input");

      slots.push({
          id: name.dataset.id,
          slot_name: name.value,
          info: info.value
      });

  });

  console.log("SENDING AUTO SLOTS:", slots);

  const response = await fetch("http://localhost:3000/autoSlots", {
  method: "PUT",
  headers: {
      "Content-Type": "application/json"
  },
  body: JSON.stringify(slots)
});

const result = await response.json();



if (result.success) {
    openAuto();
}

}

function openAutoPopup() {
  document.getElementById("autoPopup").style.display = "block";
}

function closeAutoPopup() {
    document.getElementById("autoPopup").style.display = "none";
}

function initLanguage() {

  const lang = localStorage.getItem("language") || "fi";

  const langFi = document.getElementById("langFi");
  const langEn = document.getElementById("langEn");

  if (langFi) {
    langFi.classList.remove("active");
  }

  if (langEn) {
    langEn.classList.remove("active");
  }

  if (lang === "fi") {
    if (langFi) langFi.classList.add("active");
  } else {
    if (langEn) langEn.classList.add("active");
  }

  // vain index.html
  if (document.getElementById("openJoinBtn")) {
    loadIndexLanguage(lang);
  }

  // vain board.html
  if (document.getElementById("boardMessagesDiv")) {
    loadBoardLanguage(lang);
    //loadBoardCount();
  }
}

function loadCategories() {

  const selects = [
    "categorySelect",
    "cp_category"
  ];

  const role = localStorage.getItem("role");

  const ownerOnlyCategories = [
      "general information",
      "announcements"
  ];

  selects.forEach(id => {

      const select = document.getElementById(id);

      if (!select) return;

      select.innerHTML = "";

      categories.forEach(category => {

          // Piilotetaan jäseneltä vain topicin luonti-popupissa
          if (
              id === "cp_category" &&
              role !== "owner" &&
              ownerOnlyCategories.includes(category)
          ) {
              return;
          }

          const option = document.createElement("option");

          option.value = category;
          option.textContent = t(category);

          select.appendChild(option);
      });
  });
}

function loadIndexLanguage() {

  document.querySelector("#cp_boardType option[value='family']").textContent =
      t("BOARD_TYPE_FAMILY");

  document.querySelector("#cp_boardType option[value='notice']").textContent =
      t("BOARD_TYPE_NOTICE");

  document.querySelector("#cp_noticeTemplate option[value='taloyhtio']").textContent =
  t("NOTICE_TALOYHTIO");

  document.querySelector("#cp_noticeTemplate option[value='yhteiso']").textContent =
      t("NOTICE_YHTEISO");

  document.querySelector("#cp_noticeTemplate option[value='urheiluseura']").textContent =
      t("NOTICE_URHEILUSEURA");

  document.querySelector("#cp_noticeTemplate option[value='yhdistys']").textContent =
      t("NOTICE_YHDISTYS");

  setText("loginTitle", "LOGIN_TITLE");
  setText("joinTitle", "JOIN_TITLE");
  setText("createBoardPopupTitle", "CREATE_BOARD_TITLE");

  setText("openJoinBtn", "JOIN_BOARD");
  setText("openCreateBtn", "CREATE_BOARD");
  setText("openBoardBtn", "OPEN_BOARD");
  setText("boardCount", "BOARD_COUNT");

  setPlaceholder("boardName", "BOARD_NAME");
  setPlaceholder("boardUsername", "USERNAME");
  setPlaceholder("boardPassword", "PASSWORD");

  setPlaceholder("joinBoardName", "BOARD_NAME");
  setPlaceholder("joinUsername", "USERNAME");
  setPlaceholder("joinPassword", "PASSWORD");
  setPlaceholder("joinEmail", "EMAIL");

  setText("sendJoinBtn", "SEND_REQUEST");
  setText("joinCancelBtn", "CANCEL");
  setText("taulu", "BOARD_INFO");
  setText("welcome", "WELCOME_TEXT");

  setPlaceholder("cp_boardName", "BOARD_NAME");
  setPlaceholder("cp_username", "USERNAME");
  setPlaceholder("cp_password", "PASSWORD");
  setPlaceholder("cp_email", "EMAIL");

  setText("submitCreatePopupBtn", "CREATE_BOARD");
  setText("closeCreatePopupBtn", "CANCEL");
    
} 

function loadBoardLanguage() {

  setPlaceholder("cp_topic", "topic");
  setPlaceholder("cp_message", "writeMessage");
  setPlaceholder("cp_header", "Header");

  setText("createTopicTitle", "CREATE_TOPIC_TITLE");

  document.querySelector("#cp_informationTopic option[value='general information']").textContent =
      t("general information");

  document.querySelector("#cp_informationTopic option[value='announcements']").textContent =
      t("announcements");

  setText("cp_createBtn", "CREATE_BTN");
  setText("cp_members", "MEMBERS_TITLE");
  setText("cp_join", "CP_JOIN_TITLE");
  setText("cp_createBtn", "SAVE_BTN");
  setText("saunaTitle", "SAUNA_TITLE");
  setText("saveSaunaBtn", "SAUNA_SAVE");
  setText("editSaunaBtn", "SAUNA_EDIT");
  setText("deleteSaunaBtn", "SAUNA_DELETE");
  setText("closeSaunaBtn", "SAUNA_CLOSE");
  setText("createAutoPopupBtn", "AUTO_CREATE");
  setText("closeAutoPopupBtn", "AUTO_CLOSE");
  setText("cp_cancelBtn", "CANCEL");
  setText("homeBtn", "HOME");
  setText("topicBtn", "NEW_TOPIC");
  setText("leaveBoardBtn", "LEAVE_BOARD");
  setText("sendBtn", "SEND");
  setText("clearBtn", "CLEAR");
  setText("saunaBtn", "SAUNA");
  setText("settingsBtn", "SETTINGS");
  setText("members", "MEMBERS");
  setText("todayModeText", "TODAY");
  setText("editModeText", "EDIT");
  setText("autoBtn", "AUTO");
  setText("importantModeText", "IMPORTANT");
  setText("infoModeText", "INFO");
  setText("logout", "LOGOUT");
  setText("deleteBoardBtn", "DELETE_BOARD");
  setText("requestsBtn", "REQUESTS");
  setPlaceholder("boardNewMsg", "writeMessage");
  setText("backToCategoriesBtn", "BACK_CATEGORIES");
} 

function updateRequestBadge() {

const requestButton = document.getElementById("requestsBtn");

if (!requestButton) return;

const boardName = localStorage.getItem("boardName");

if (!boardName) return;

fetch(`http://localhost:3000/board/${boardName}`, {
    headers: {
        "Authorization": localStorage.getItem("token")
    }
})
.then(res => res.json())
.then(data => {

    const pendingCount = data.pendingRequests?.length || 0;

    if (pendingCount > 0) {
        requestButton.classList.add("pending");
    } else {
        requestButton.classList.remove("pending");
    }
});
}

// LMF

// =====================
// LOAD MESSAGES
// =====================

function loadMessage(forceScroll = false) {

  console.log("LOAD MESSAGES CALLED");
  
  const box = document.getElementById("boardMessagesDiv");
  if (!box) return;

  if (box.style.display === "none") return;

  if (loading) return;
  loading = true;

  const boardName = getBoardName();

  const boardType = localStorage.getItem("boardType");

  if (!boardName) {
    loading = false;
    return;
  }

  fetch(`http://localhost:3000/board/${boardName}`, {
  headers: {
    "Authorization": localStorage.getItem("token")
  }
})
  .then(res => res.json())
  .then(data => {

    const boardType = data.boardType;
    const noticeTemplate = data.noticeTemplate;

    localStorage.setItem("boardType", boardType);
    localStorage.setItem("noticeTemplate", noticeTemplate);

    categories = getCategories(boardType, noticeTemplate);

    if (boardType === "notice" && !currentTopic) {
      clearMessages();
    }

  const requestButton = document.getElementById("requestsBtn");

    updateVisitedUI(data);

    const isAtBottom =
    box.scrollTop + box.clientHeight >= box.scrollHeight - 10;

    box.innerHTML = "";

    const todayMode = document.getElementById("todayMode")?.checked;

    let messages = data.boardMessages;

    if (boardType === "notice") {

    messages = messages.filter(msg =>
        msg.category === currentCategory &&
        msg.topic === currentTopic
    );
    }

    if (todayMode) {
    const now = new Date();

    messages = messages.filter(msg => {
    const d = new Date(msg.time);

    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  });
}

updateCurrentLocation(messages);

const importantMode = document.getElementById("importantMode")?.checked;
const infoMode = document.getElementById("infoMode")?.checked;

if (importantMode) {
    messages = messages.filter(msg => msg.type === "important");
}

if (infoMode) {
    messages = messages.filter(msg => msg.type === "info");
}

const ownerCategories = [
    "general information",
    "announcements"
];

let showTopicInsideMessage =
    data.boardType === "notice" &&
    ownerCategories.includes(currentCategory);

messages.forEach(msg => {

  const div = document.createElement("div");

  if (data.boardType === "notice") {
    div.className = "notice-row";
  } else {
    div.className = "msg-row";
  }

 const editMode = document.getElementById("editMode")?.checked;

if (msg.type === "important") {
    div.classList.add("important-msg");

    if (!editMode) {
        const indicator = document.createElement("span");
        indicator.className = "important-indicator";
        indicator.textContent = "🚨";

        const messageTime = new Date(msg.time);
        const age = Date.now() - messageTime.getTime();

        if (age < 5 * 60 * 1000) {
            indicator.classList.add("active-alarm");
        }

        div.appendChild(indicator);
    }
}

if (msg.type === "info") {
    div.classList.add("info-msg");

    if (!editMode) {
        const indicator = document.createElement("span");
        indicator.className = "info-indicator";
        indicator.textContent = "ⓘ";

        const messageTime = new Date(msg.time);
        const age = Date.now() - messageTime.getTime();

        if (age < 5 * 60 * 1000) {
            indicator.classList.add("active-alarm");
        }

        div.appendChild(indicator);
    }
}

  const wrapper = document.createElement("div");
  wrapper.className = "msg-content";

  const text = document.createElement("div");
  text.className = "msg-text";

  const author = document.createElement("span");
  author.className = "msg-author";
  author.innerText = `${msg.author}:`;

  const body = document.createElement("div");
body.className = "msg-body";

const lines = msg.text.split("\n");

lines.forEach(line => {
    if (line.startsWith("Kuvaus:")) {
        const label = document.createElement("span");
        label.className = "notice-label";
        label.innerText = "Kuvaus:";

        body.appendChild(label);
        body.appendChild(
            document.createTextNode(line.substring(7))
        );

    } else if (line.startsWith("Lisätiedot:")) {
        const label = document.createElement("span");
        label.className = "notice-label";
        label.innerText = "Lisätiedot:";

        body.appendChild(label);
        body.appendChild(
            document.createTextNode(line.substring(11))
        );

    } else {
        body.appendChild(document.createTextNode(line));
    }

    body.appendChild(document.createElement("br"));
});

if (
    data.boardType === "notice" &&
    ownerCategories.includes(currentCategory)
) {
    div.classList.add("owner-message");

    if (showTopicInsideMessage) {

    const title = document.createElement("div");
    title.className = "owner-topic-title";

    if (
        (msg.category === "general information" ||
         msg.category === "announcements") &&
        msg.header
    ) {
        title.innerText = msg.header;
    } else {
        title.innerText = msg.topic;
    }

    text.appendChild(title);
}

    text.appendChild(body);
    
    } else {
      text.appendChild(author);
      text.appendChild(body);
    }

  const time = document.createElement("div");
  time.className = "msg-time";

  const date = new Date(msg.time);

  if (todayMode) {
    time.innerText = date.toLocaleTimeString("fi-FI", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
    });
  } else {
    time.innerText = date.toLocaleString("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
    });
  }

  wrapper.appendChild(text);
  wrapper.appendChild(time);

  div.appendChild(wrapper);

  //const editMode = document.getElementById("editMode")?.checked;
  const username = localStorage.getItem("boardUsername");

  const user = data.users.find(u => u.username === username);
  const owner = user?.role === "owner";

  const showEdit =
    boardType === "notice" &&
    editMode &&
    owner &&
    ownerCategories.includes(currentCategory);

  if (showEdit) {

    const editBtn = document.createElement("button");
    editBtn.innerText = "✏️";
    editBtn.className = "edit-btn";

    editBtn.onclick = () => {
        editMessage(msg);
    };

    wrapper.appendChild(editBtn);
}

  const showTrash =
    editMode && (owner || msg.author === username);
    
  if (showTrash) {
    const trash = document.createElement("button");
    trash.innerText = "🗑";
    trash.className = "trash-btn";
    trash.onclick = () => deleteMessage(msg.id);

    wrapper.appendChild(trash);   // ← tänne
  }

  div.appendChild(wrapper);  
  box.appendChild(div);
  });

    if (
    boardType === "notice" &&
    (
        currentCategory === "general information" ||
        currentCategory === "announcements"
    )
) {
    box.scrollTop = 0;
} else if (forceScroll || isAtBottom) {
    box.scrollTop = box.scrollHeight;
}

  })
  .catch(console.error)
  .finally(() => {
    loading = false;
  });
}


//UMF

// =====================
// UPDATE MESSAGE
// =====================

function updateMessage() {

  const ownerCategories = [
    "general information",
    "announcements"
  ];

  const messageEl = document.getElementById("boardNewMsg");

  if (!messageEl) return;

  const boardMessage = messageEl.value;

  const boardName = localStorage.getItem("boardName");
  const boardUsername = localStorage.getItem("boardUsername") || boardName;
  let type="normal";
  const boardType = localStorage.getItem("boardType");
  const role = localStorage.getItem("role");

  if (
    boardType === "notice" &&
    ownerCategories.includes(currentCategory)
  ) {
    alert(t("OWNER_CATEGORY_NO_MESSAGES"));
    return;
  }

  if (document.getElementById("importantMode").checked) {
    type = "important";
  }

  if (document.getElementById("infoMode").checked) { 
    type="info";
  }

let category = "";
let topic = "";

if (boardType === "notice") {
    
    category = currentCategory;
    topic = currentTopic;

    const ownerOnlyCategories = [
    "general information",
    "announcements"
    ];

if (
    boardType === "notice" &&
    ownerOnlyCategories.includes(currentCategory) &&
    role !== "owner"
) {
    alert(t("onlyOwnerCanWrite"));
    return;
}

    if (!topic) {
        //alert("Please select a topic first");
        alert(t("PleaseSelectTopicFirst"));
        return;
    }
}

  fetch("http://localhost:3000/boardMessage", {
    method: "POST",
    headers: {
  "Content-Type": "application/json",
  "Authorization": localStorage.getItem("token")
},
    body: JSON.stringify({
      boardName,
      message: boardMessage,
      category,
      topic,
      type
})
  })
  .then(res => res.json())
  .then(data => {
     
    if (!data.success) {
    return alert(t(data.message));
}

    messageEl.value = "";
    loadMessage(true);

    document.getElementById("boardNewMsg").blur();

    document.getElementById("importantMode").checked = false;
    document.getElementById("infoMode").checked = false;
    
    type="normal";
  });  
}

// LF

function loginWithPassword() {

  console.log("LOGIN WITH PASSWORD CALLED");

  const boardName = document.getElementById("boardName").value;
  const boardPassword = document.getElementById("boardPassword").value;
  const boardUsername = document.getElementById("boardUsername").value;

  if (boardName.toLowerCase() === "admin") {

    fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: boardUsername,
            password: boardPassword
        })
    })
    .then(res => res.json())
    .then(data => {

        if (!data.success) {
            alert(t(data.message));
            return;
        }

        window.location.href = "admin.html";

    });

    return;
}

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
  "Content-Type": "application/json"
  },
    body: JSON.stringify({
    boardName,
    boardUsername,
    boardPassword
  })
    })
  //.then(res => res.json())
  .then(res => {

    //console.log("Response:", res);
    //console.log("Status:", res.status);
    //console.log("OK:", res.ok);

    return res.json();
  })
  .then(async data => {

    console.log("opa tutkii: ", data.token);
    if (!data.success) {
      return alert(t("LOGIN_FAILED"));
    }

    // ✔ token talteen
    localStorage.setItem("token", data.token);
    localStorage.setItem("boardName", boardName);
    localStorage.setItem("boardUsername", boardUsername);
    localStorage.setItem("role", data.role);
    localStorage.setItem("boardType", data.boardType);
    localStorage.setItem("noticeTemplate", data.noticeTemplate);

    await fetch("http://localhost:3000/visit", {
      method: "POST",
      headers: {
      "Content-Type": "application/json"
      },
      body: JSON.stringify({
        boardName,
        boardUsername
      })
    });

    window.location.href = "board.html";
  });
} 

// =====================
// DELETE BOARD
// =====================

function deleteBoard() {

    console.log("DELETE BOARD CALLED");

    if (!confirm(t("confirmDeleteBoard"))) {
        return;
    }

    const boardName = localStorage.getItem("boardName");
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3000/delete/${boardName}`, {
        method: "DELETE",
        headers: {
            "Authorization": token
        }
    })
    .then(async (res) => {
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        alert(t(data?.message || "DELETE_FAILED"));
        return;
      }

    alert(t(data.message || "DELETE_SUCCESS"));

    const lang = localStorage.getItem("language");

    localStorage.clear();

    if (lang) {
        localStorage.setItem("language", lang);
    }

    window.location.href = "index.html";
    });
}

function leaveBoard() {

  console.log("LEAVE BOARD CALLED");

  const ok = confirm(t("LEAVE_BOARD_CONFIRM"));

  if (!ok) {
    return;
  }

  const boardName = localStorage.getItem("boardName");
  const token = localStorage.getItem("token");

  fetch(`http://localhost:3000/leaveBoard/${boardName}`, {
    method: "DELETE",
    headers: {
      "Authorization": token
    }
  })
  .then(async (res) => {
    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      alert(t(data?.message || "DELETE_FAILED"));
      return;
    }

    const lang = localStorage.getItem("language");

    localStorage.clear();

    if (lang) {
      localStorage.setItem("language", lang);
    }
    window.location.href = "index.html";
  })
  .catch(err => {
    console.error(err);
    alert(t("NETWORK_ERROR"));
  });
}


// CTF

// =====================
// CLEAR TABLE
// =====================

async function clearTable() {

  console.log("CLEAR TABLE CALLED");

  const boardName = localStorage.getItem("boardName");
  const boardType = localStorage.getItem("boardType");

  if (boardType === "notice" && !currentTopic) {
    alert(t("SELECT_TOPIC"));
    return;
  }

  if (boardType === "family") {

  if (!confirm(t("confirmRemoveMessage"))) {
    return;
  }

  } else if (boardType === "notice") {
    if (!confirm(t("confirmRemoveMessages"))) {
      return;
  }
  }

  await fetch(`http://localhost:3000/clear/${boardName}`, {
    method: "DELETE",
    headers: {
      "Authorization": localStorage.getItem("token"),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      category: currentCategory,
      topic: currentTopic
    })
  })
  .then(res => res.json())
  .then(data => {

    if (data.success) {

        loadTopicsFromDatabase(currentCategory);
        loadTopicCounts();
        loadMessage(true);

        setTimeout(() => alert(t(data.message)), 200);

        backToCategories();

    } else {

        alert(t(data.message || "CLEAR_FAILED"));

    }

});

  backToCategories();
}

//UCF

function updateCurrentLocation(messages = null) {

    console.log("UPDATE LOCATION CALLED");

    const el = document.getElementById("currentLocation");
    const boardType = localStorage.getItem("boardType");

    if (!el) return;

    let text = "";

    if (boardType === "family") {

        text = t("MESSAGES");

    } else {

        if (currentCategory) {
            text = t(currentCategory);
        }

        if (currentTopic) {
            text += " > " + currentTopic;
        }
    }

    if (messages) {

        const messageCount = messages.length;

        const importantCount = messages.filter(
            msg => msg.type === "important"
        ).length;

        const infoCount = messages.filter(
            msg => msg.type === "info"
        ).length;

        text += ` | 💬 ${messageCount} 🚨 ${importantCount} ⓘ ${infoCount}`;
    }

    el.innerText = text;
}

// =====================
// NAV
// =====================

function home() {
    sessionStorage.setItem("skipAutoLogin", "true");
    window.location.href = "index.html";   
}

function clearLoginFields() {
    console.log("CLEAR LOGIN FIELDS CALLED");
    const boardName = document.getElementById("boardName");
    const boardUsername = document.getElementById("boardUsername");
    const boardPassword = document.getElementById("boardPassword");

    if (!boardName || !boardUsername || !boardPassword) return;

    boardName.value = "";
    boardUsername.value = "";
    boardPassword.value = "";
}

function logout() {
  const lang = localStorage.getItem("language");

  localStorage.clear();

  if (lang) {
    localStorage.setItem("language", lang);
  }
  window.location.href = "index.html";
}

function loadBoardCount() {

  console.log("LOAD BOARD COUNT CALLED");

  const el = document.getElementById("boardCount");
  if (!el) return;

  const lang = localStorage.getItem("language") || "fi";

  if (lang === "fi") {
    el.innerText = "Ladataan...";
  } else {
    el.innerText = "Loading...";
  }

  fetch("http://localhost:3000/boards/count")
    .then(res => res.json())
    .then(data => {

      if (lang === "fi") {
        el.innerText = `Taulut: ${data.count ?? 0}`;
      } else {
        el.innerText = `Boards: ${data.count ?? 0}`;
      }

    })
    .catch(() => {

      if (lang === "fi") {
        el.innerText = "Taulujen haku epäonnistui!";
      } else {
        el.innerText = "Cannot get Boards!";
      }
    });
}

function deleteMessage(id) {

  if (!confirm(t("confirmRemoveMessage"))) {
    return;
}

  const boardName = localStorage.getItem("boardName");
  const token = localStorage.getItem("token");

  fetch(`http://localhost:3000/message/${boardName}/${id}`, {
    method: "DELETE",
    headers: {
    "Content-Type":"application/json",
    "Authorization":token
},
    body: JSON.stringify({
    boardName
})
  })
  .then(res => res.json())
  .then(data => {
    const edit = document.getElementById("editMode");

if (edit) {
    edit.checked = false;
    edit.dispatchEvent(new Event("change"));
}
    loadTopicCounts();

if (data.topicEmpty) {
    backToCategories();
    return;
}

loadMessage(true);
  });
}

// RVF

function renderVisitedUsers(users) {

  console.log("RENDER VISITED CALLED");

  console.log(
    "BEFORE VISITED",
    document.querySelector(".board").getBoundingClientRect().height
);


  const el = document.getElementById("visitedUsers");
  if (!el) return;

  const sorted = (users || [])
    .sort((a, b) => b.lastSeen - a.lastSeen)
    .slice(0, 5);

  const loggedUser = localStorage.getItem("boardUsername") || "";
  const lang = localStorage.getItem("language") || "fi";

  const labels = lang === "fi"
  ? {
      loggedIn: "Kirjautunut",
      lastVisited: "Viimeksi taululla"
    }
  : {
      loggedIn: "Logged in",
      lastVisited: "Last visited"
    };

  el.innerHTML =
  `👤 ${labels.loggedIn}: <b>${loggedUser}</b>&nbsp;&nbsp;&nbsp;&nbsp;🟢 ${labels.lastVisited}: ` +
  sorted.map(u => u.name).join(", ");

  console.log(
    "AFTER VISITED",
    document.querySelector(".board").getBoundingClientRect().height
);
}

function updateVisitedUI(data) {
  renderVisitedUsers(data.visitedUsers);
}

function openSettings() {

  console.log("OPEN SETTINGS CALLED");

  const boardName =
    localStorage.getItem("boardName");

  fetch(`http://localhost:3000/board/${boardName}`, {
  headers: {
    "Authorization": localStorage.getItem("token")
  }
})
  .then(res => res.json())
  .then(board => {

    document.getElementById(
        "autoDeleteDays"
      ).value =
        board.autoDeleteDays ?? 10;

      document.getElementById(
        "settingsPopup"
      ).style.display = "flex";
    });
}

function closeSettings() {

  document.getElementById(
    "settingsPopup"
  ).style.display = "none";
}

function saveSettings() {

  const boardName =
    localStorage.getItem("boardName");

  const token = localStorage.getItem("token");

  const autoDeleteDays =
    Number(
      document.getElementById(
        "autoDeleteDays"
      ).value
    );

  fetch("http://localhost:3000/settings", {
    method: "POST",
    headers:{
   "Content-Type":"application/json",
   "Authorization":token
},
    body:JSON.stringify({
    boardName,
    autoDeleteDays
})
  })
  .then(res => res.json())
  .then(data => {

    if (data.success) {
      alert(t("SAVE"));
      closeSettings();
    }
  });
}

const importantMode = document.getElementById("importantMode");

if (importantMode) {
  importantMode.addEventListener("change", function () {

    if (this.checked) {
      document.getElementById("infoMode").checked = false;
    }
    loadMessage();
  });
}

const infoMode = document.getElementById("infoMode");

if (infoMode) {
  infoMode.addEventListener("change", function () {

    if (this.checked) {
      document.getElementById("importantMode").checked = false;
    }
    loadMessage();
  });
}

document.getElementById("editMode")?.addEventListener("change", () => {
    updateEditModeUI();
    loadMessage(false);
});

const membersPopup = document.getElementById("membersPopup");

if (membersPopup) {
  membersPopup.addEventListener("click", (e) => {
    if (e.target.id === "membersPopup") {
      closeMembers();
    }
  });
}

const settingsPopup = document.getElementById("settingsPopup");

if (settingsPopup) {
  settingsPopup.addEventListener("click", (e) => {
    if (e.target.id === "settingsPopup") {
      closeSettings();
    }
  });
}

function showMembers() {
  
  console.log("SHOW MEMBERS CALLED");
  
  const boardName = localStorage.getItem("boardName");

  fetch(`http://localhost:3000/board/${boardName}`, {
    headers: {
      "Authorization": localStorage.getItem("token")
    }
  })
    .then(res => res.json())
    .then(board => {

      const el = document.getElementById("membersList");
      const popup = document.getElementById("membersPopup");

      if (!el || !popup) return;

      const members = board.users || [];
      const owners = members.filter(m => m.role === "owner");
      const others = members.filter(m => m.role !== "owner");
      const editMode = document.getElementById("editMode")?.checked;
      const owner = localStorage.getItem("role") === "owner";

      el.innerHTML =
      owners.map(m => `
        <div class="member-owner">
            ${m.username}
            <span class="member-role">(${t("M_ROLE")})</span>
        </div>
      `).join("") +

    `<div class="member-grid">
       ${others.map(m => `
    <div class="member-row">
        ${m.username}
        <span class="member-role">(${t("MM_ROLE")})</span>

        ${owner && editMode
          ? `<button
  class="member-trash-btn"
  onclick="removeMember('${m.username}')">
  🗑
</button>`
          : ""}
    </div>
`).join("")}
    </div>`;

      popup.style.display = "flex";
    });
}

function closeMembers() {
  document.getElementById("membersPopup").style.display = "none";
}

function openJoinBoard() {
  document.getElementById("joinBoardPopup").style.display = "flex";
}

function closeJoinBoard() {
  console.log("CLOSE JOIN POPUP");
  document.getElementById("joinBoardPopup").style.display = "none";
}

function sendJoinRequest() {

  const boardName = document.getElementById("joinBoardName").value;
  const username = document.getElementById("joinUsername").value;
  const password = document.getElementById("joinPassword").value;
  const email = document.getElementById("joinEmail").value;

  fetch("http://localhost:3000/joinRequest", {
    method: "POST",
    headers: {
  "Content-Type": "application/json"
},
    body: JSON.stringify({
      boardName,
      username,
      password,
      email
    })
  })
  .then(res => res.json())
  .then(data => {

    if (!data.success) {
    alert(t(data.message || "JOIN_REQUEST_FAILED"));
    return;
    }

    alert(t("REQUEST_SENT"));

    document.getElementById("joinBoardName").value = "";
    document.getElementById("joinUsername").value = "";
    document.getElementById("joinPassword").value = "";
    document.getElementById("joinEmail").value = "";

    closeJoinBoard();

})
  .catch(err => {
    console.error(err);
    alert(t("NETWORK_ERROR"));
  });

}

function openCreatePopup() {

  document.getElementById("cp_boardType").value = "family";
  document.getElementById("noticeTemplateDiv").style.display = "none";
  document.getElementById("createPopup").style.display = "block";
}

function closeCreatePopup() {
  document.getElementById("createPopup").style.display = "none";
}

function submitCreateBoard() {

  console.log("CREATE BOARD CALLED");

  const boardName = document.getElementById("cp_boardName").value;
  const boardType = document.getElementById("cp_boardType").value;
  const boardUsername = document.getElementById("cp_username").value;
  const ownerEmail = document.getElementById("cp_email").value;
  const boardPassword = document.getElementById("cp_password").value;

  let noticeTemplate = "";

  if (boardType === "notice") {
    noticeTemplate = document.getElementById("cp_noticeTemplate").value;
  }

  if (!boardName.trim()) {
    alert("Anna taululle nimi");
    return;
}

  fetch("http://localhost:3000/create", {
    method: "POST",
    headers: {
    "Content-Type": "application/json"
  },
    body: JSON.stringify({
      boardName,
      boardType,
      noticeTemplate,
      boardUsername, 
      boardPassword,
      ownerEmail,
    })
  })
  .then(r => r.json())
  .then(data => {
    alert(t(data.message));

    if (data.success) {

      loadBoardCount();      // <-- tämä
      document.getElementById("cp_boardName").value = "";
      document.getElementById("cp_boardType").value = "family";
      document.getElementById("cp_noticeTemplate").value = "taloyhtio";
      document.getElementById("cp_username").value = "";
      document.getElementById("cp_email").value = "";
      document.getElementById("cp_password").value = "";
      closeCreatePopup();

      localStorage.setItem("boardName", boardName);
      localStorage.setItem("boardPassword", boardPassword);
      localStorage.setItem("boardUsername", boardUsername);
    }
  });
}

function openTopicPopup() {

  console.log("OPEN TOPIC POPUP CURRENT:", currentCategory);

  if (!editingTopicId) {

    document.getElementById("cp_category").value = "general";

    document.getElementById("cp_header").value = "";

    document.getElementById("cp_topic").value = "";

    document.getElementById("cp_message").value = "";

    document.getElementById("cp_createBtn").innerText = t("CREATE_BTN");

  }

  document.getElementById("createTopicPopup").style.display = "flex";

  createTopicPopupCategoryChanged();

  const role = localStorage.getItem("role");

  if (
    role === "owner" &&
    (
      currentCategory === "general information" ||
      currentCategory === "announcements"
    )
  ) {
    
  }
}

function closeTopicPopup() {

  document.getElementById("createTopicPopup").style.display = "none";

  document.getElementById("cp_header").value = "";
  document.getElementById("cp_topic").value = "";
  document.getElementById("cp_message").value = "";

  //document.getElementById("cp_category").value = currentCategory;

  document.getElementById("cp_informationTopic").value = "";

  document.getElementById("cp_important").checked = false;
  document.getElementById("cp_info").checked = false;

  document.getElementById("messageTemplate").value="general";

}

async function updateTopic(id) {

console.log("UPDATE TOPIC CALLED!");

const topic = document.getElementById("cp_topic").value;
const message = document.getElementById("cp_message").value;
const category = document.getElementById("cp_category").value;
const header = document.getElementById("cp_header").value;

const response = await fetch(
    `http://localhost:3000/boardMessage/${id}`,
    {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            header,
            topic,
            message
        })
    }
);

const result = await response.json();

if (result.success) {

    currentCategory = category;
    currentTopic = topic;

    editingTopicId = null;

    const editBox = document.getElementById("editMode");

    if (editBox) {
        editBox.checked = false;
    }

    closeTopicPopup();

    await loadTopicsFromDatabase(category);
    loadMessage(true);
}
}

function submitTopic() {

  console.log("SUBMIT TOPIC CALLED");

  if (editingTopicId) {
    updateTopic(editingTopicId);
    return;
  }

  let type = "normal";

  if (document.getElementById("cp_important").checked) {
      type = "important";
  }

  if (document.getElementById("cp_info").checked) {
      type = "info";
  }

  const boardName = localStorage.getItem("boardName");
  const category = document.getElementById("cp_category").value;
  //let topic = document.getElementById("cp_topic").value;
  const header = document.getElementById("cp_header").value;
  const message = document.getElementById("cp_message").value;
  const author = localStorage.getItem("boardUsername");
  const showHeader =
    category === "general information" ||
    category === "announcements";

  let topic;

  const existingTopic =
      document.getElementById("cp_existingTopic")?.value;

  if (existingTopic) {
      topic = existingTopic;
  } else {
      topic = document.getElementById("cp_topic").value;
  }

  console.log("topic lenght: ", topic.length);

  if (topic.length > 40) {
    alert(t("TOPIC_TOO_LONG"));
    return;
  }

    if (!topic.trim()) {
    alert(t("TOPIC_MISSING"));
    return;
}

if (showHeader && !header.trim()) {
    alert(t("HEADER_MISSING"));
    return;
}

if (!message.trim()) {
    alert(t("MESSAGE_MISSING"));
    return;
  }

  fetch("http://localhost:3000/createTopic", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
    boardName,
    author,
    category,
    topic,
    header,
    message,
    type
})
  })
  .then(r => r.json())
  .then(data => {

    alert(t(data.message));

if (data.success) {


    localStorage.setItem("currentCategory", category);

    loadTopicsFromDatabase(category, topic);

    if (data.boardType === "notice") {
        loadTopicCounts();
    }

    document.getElementById("cp_header").value = "";
    document.getElementById("cp_topic").value = "";
    document.getElementById("cp_message").value = "";
    document.getElementById("messageTemplate").value="general";
    closeTopicPopup();
}
  });
}

function clearMessages() {
    document.getElementById("boardMessagesDiv").innerHTML = "";
}

//LTF

function loadTopicsFromDatabase(category, selectedTopic = "") {

    console.log("LOAD TOPICS FROM DATABASE CALLED");

    const boardName = localStorage.getItem("boardName");

    return fetch("http://localhost:3000/topics", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            boardName,
            category
        })
    })
    .then(r => r.json())
    .then(data => {

        if (data.topics.length === 0) {

            document.getElementById("boardTopicsView").innerHTML = "";

            return data;
        }

        renderTopicsMessages(data.topics);

        if (selectedTopic) {

        currentCategory = category;
        currentTopic = selectedTopic;

        localStorage.setItem("currentCategory", category);
        localStorage.setItem("currentTopic", selectedTopic);

        updateCurrentLocation();

        showMessages();

        loadTopicCounts();
        loadMessage(true);
        }

        return data;
    });

}

function openRequests() {

  console.log("OPEN REQUESTS START");
  document.getElementById("requestsPopup").style.display = "flex";
 
  loadRequests();
}

function closeRequests() {
  console.trace("CLOSE REQUESTS");
  document.getElementById("requestsPopup").style.display = "none";
}

function loadRequests() {

  console.log("LOAD REQUESTS");

  const boardName = localStorage.getItem("boardName");

  fetch(`http://localhost:3000/board/${boardName}`, {
  headers: {
    "Authorization": localStorage.getItem("token")
  }
})
    .then(res => res.json())
    .then(board => {     

  const list = document.getElementById("requestsList");
  list.innerHTML = "";

  if (!board.pendingRequests || board.pendingRequests.length === 0) {

    const text="NO_PENDING";

    list.innerHTML = `<b>${t(text)}</b>`;
    

    setTimeout(() => {
      closeRequests();
    }, 1500);

    return;
  }

  board.pendingRequests.forEach(req => {

    const div = document.createElement("div");

    div.innerHTML = `
      <div><b>Username:</b> ${req.username}</div>
      <div><b>Email:</b> ${req.email}</div>
      <br>

      <button type="button"
        onclick="acceptRequest('${req.id}', event)">
        Accept
      </button>

      <button type="button"
        onclick="rejectRequest('${req.id}')">
        Reject
      </button>

      <hr>
    `;

    list.appendChild(div);
  });

});
}

function acceptRequest(id, event) {
  
  const role = localStorage.getItem("role");
  if (role !== "owner") return;

  event?.preventDefault();
  event?.stopPropagation();

  fetch("http://localhost:3000/acceptRequest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token")
    },
    body: JSON.stringify({
      boardName: localStorage.getItem("boardName"),
      id
    })
  })
  .then(() => {
    
    loadRequests();
    updateRequestBadge();

    if (currentTopic) {
        loadMessage(false);
    }
});
}

function rejectRequest(id) {

  const boardName = localStorage.getItem("boardName");

  fetch(`http://localhost:3000/rejectRequest`, {
    method: "POST",
    headers: {
  "Content-Type": "application/json",
  "Authorization": localStorage.getItem("token")
},
    body: JSON.stringify({ boardName, id })
  })
  .then(() => {
    
    loadRequests(); 
    loadMessage(false);
});
}

const menuBtn = document.getElementById("menuBtn");
const topMenu = document.getElementById("topMenu");

if (menuBtn && topMenu) {

  menuBtn.onclick = () => {
    topMenu.classList.toggle("open");
  };
  /*
  document.addEventListener("click", function(e) {

    // Jos klikattiin menupainiketta, ei tehdä mitään
    if (menuBtn.contains(e.target)) return;

    // Jos klikattiin valikon ulkopuolelle, sulje valikko
    if (!topMenu.contains(e.target)) {
      topMenu.classList.remove("open");
    }
  });*/
  document.addEventListener("click", function(e) {

  if (menuBtn.contains(e.target)) return;

  topMenu.classList.remove("open");

});
}

const quickMessagesPopup = document.getElementById("quickMessagesPopup");

if (quickMessagesPopup) {
  quickMessagesPopup.addEventListener("click", function(e) {
    if (e.target === this) {
      closeQuickMessages();
    }
  });
}

const requestsPopup = document.getElementById("requestsPopup");

if (requestsPopup) {
  requestsPopup.addEventListener("click", function(e) {
    if (e.target === this) {
      closeRequests();
    }
  });
}

function removeMember(username) {

  if (!confirm(`${t("REMOVE_USER_CONFIRM")} ${username}`)) {
    return;
  }

  const boardName = localStorage.getItem("boardName");
  const token = localStorage.getItem("token");

  fetch("http://localhost:3000/removeMember", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      boardName,
      username
    })
  })
  .then(res => res.json())
  .then(data => {

  if (!data.success) {
    alert(t(data.message || "REMOVE_FAILED"));
    return;
  }

  alert(t(data.message));

  document.getElementById("editMode").checked = false;
  
  showMembers();
  
  loadMessage(false);
});
}

function openQuickMessages() {
  renderQuickPopup();
}

function closeQuickMessages() {
  document.getElementById("quickMessagesPopup").style.display = "none";
  const edit = document.getElementById("editMode");

  if (edit) {
    edit.checked = false;
    edit.dispatchEvent(new Event("change"));
  }
}

function renderQuickPopup(){

  console.log("SHOW QUICK MESSAGES CALLED");

  const saveBtn = document.getElementById("saveQuickBtn");

  const defaultsOption = document.getElementById("quickDefaultsOption");

  const editMode = document.getElementById("editMode")?.checked;

  const defaultsCheckbox = document.getElementById("quickDefaultsCheckbox");

  if (saveBtn) {

    saveBtn.style.display = editMode ? "inline-block" : "none";

  }

  if (defaultsOption) {

    defaultsOption.style.display = editMode ? "block" : "none";

  }

  if (defaultsCheckbox) {
    defaultsCheckbox.checked = false;
  }

  const boardName = localStorage.getItem("boardName");

  const el = document.getElementById("quickMessagesList");

  const popup = document.getElementById("quickMessagesPopup");

  if (!el || !popup) return;

  el.innerHTML = "";

  fetch(`http://localhost:3000/board/${boardName}`, {

    headers: {

      "Authorization": localStorage.getItem("token")

    }

  })

    .then(res => res.json())

    .then(board => {

      const quickMessages = board.quickMessages || [];

      quickMessagesTemplate = board.quickMessagesTemplate || [];

      const quickMessageKeys = {

        "At the store": "QUICK_AT_STORE",
        "At work": "QUICK_AT_WORK",
        "At home": "QUICK_AT_HOME",
        "Sleeping": "QUICK_SLEEPING",
        "Eating": "QUICK_EATING",
        "Coming": "QUICK_COMING",
        "Running late": "QUICK_LATE",
        "On sick leave": "QUICK_SICK_LEAVE",
        "On a break": "QUICK_BREAK",
        "At the gym": "QUICK_GYM"

      };

    if (editMode) {

      el.innerHTML = quickMessages.map((msg) => {

      let displayMsg = msg;

    if (quickMessagesTemplate.includes(msg)) {

      const key = quickMessageKeys[msg];

      if (key) {

        displayMsg = t(key);

      }

    }

    return `

      <input class="quick-input" value="${displayMsg}">

    `;

  }).join("");

} else {

  el.innerHTML = quickMessages.map((msg) => {

    let displayMsg = msg;

    if (quickMessagesTemplate.includes(msg)) {

      const key = quickMessageKeys[msg];

      if (key) {

        displayMsg = t(key);

      }

    }

    const shortMsg = displayMsg.length > 39

      ? displayMsg.substring(0, 39) + "..."

      : displayMsg;

    return `

      <div class="quick-row"
           onclick="sendQuickMessage(this)">

        ${shortMsg}

      </div>

    `;

  }).join("");

}

      popup.style.display = "flex";

    });

}

function sendQuickMessage(el) {

    const msg = el.textContent.trim();

    el.classList.add("pressed");

    setTimeout(() => {
        el.classList.remove("pressed");
    }, 400);

    setTimeout(() => {
        document.getElementById("boardNewMsg").value = msg;
        updateMessage();
        closeQuickMessages();
    }, 800);
}

function saveQuickMessages() {

  const inputs = document.querySelectorAll(".quick-input");

  let quickMessages;

  const defaultsCheckbox =
    document.getElementById("quickDefaultsCheckbox");

  if (defaultsCheckbox?.checked) {

    quickMessages = quickMessagesTemplate.slice();

  } else {

    quickMessages = Array.from(inputs)
      .map(input => input.value.trim());

  }

  if (quickMessages.some(msg => msg === "")) {
    alert(t("QUICK_MESSAGE_EMPTY"));
    return;
  }

  const boardName = localStorage.getItem("boardName");

  fetch("http://localhost:3000/quickMessages/saveAll", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token")
    },
    body: JSON.stringify({
      boardName,
      quickMessages
    })
  })
  .then(res => res.json())
  .then(data => {

    if (!data.success) {
      alert(t(data.message || "SAVE_FAILED"));
      return;
    }

    const edit = document.getElementById("editMode");

    if (edit && edit.checked) {
      edit.checked = false;
      edit.dispatchEvent(new Event("change"));
    }

    const defaults = document.getElementById("quickDefaultsCheckbox");

    if (defaults) {
      defaults.checked = false;
    }

    closeQuickMessages();
    loadMessage(false);

  })
  .catch(err => {
    console.error(err);
    alert(t("SAVE_ERROR"));
  });

}

function updateEditModeUI() {
    const editMode = document.getElementById("editMode")?.checked;
    const role = localStorage.getItem("role");
    const sendBtn = document.getElementById("sendBtn");
    const leaveBtn = document.getElementById("leaveBoardBtn");
    const settingsBtn = document.getElementById("settingsBtn");
    const deleteBoardBtn = document.getElementById("deleteBoardBtn");

  if (!sendBtn) return;

  if (leaveBtn) {
    leaveBtn.style.display =
    (role === "member" && editMode)
    ? ""
    : "none";
  }

  clearBtn.style.display =
    (role === "owner" &&
     editMode &&
     document.getElementById("boardMessagesDiv").style.display !== "none")
    ? ""
    : "none";

  settingsBtn.style.display =
    (role === "owner" && editMode)
    ? ""
    : "none";

  deleteBoardBtn.style.display =
    (role === "owner" && editMode)
    ? ""
    : "none";
  }

function loadTopicCounts() {

  console.log("LOAD TOPIC COUNT CALLED");

    const boardName = localStorage.getItem("boardName");

    fetch("http://localhost:3000/topicCounts", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            boardName
        })
    })
    .then(r => r.json())
    .then(data => {

    if (!data.success) return;

    categories.forEach(category => {

        const c = data.counts.find(
            item => item.category === category
        );

        const count = c ? c.count : 0;

        const card = document.querySelector(
            `[data-category="${category}"]`
        );

        if (card) {
            card.innerHTML = `${t(category)} (${count})`;
        }

    });

});
}

function changeCreateBoardType() {

    const boardType = document.getElementById("cp_boardType").value;

    document.getElementById("noticeTemplateDiv").style.display =
        boardType === "notice" ? "block" : "none";
}

/*
function createTopicPopupCategoryChanged() {

    const category = document.getElementById("cp_category").value;
    
    const topicInput = document.getElementById("cp_topic");

    topicInput.style.display = "block";
    topicInput.placeholder = t("topic");

    const showHeader =
    category === "general information" ||
    category === "announcements";

    document.getElementById("cp_header").style.display =
    showHeader ? "block" : "none";  
}*/

function createTopicPopupCategoryChanged() {

    const category = document.getElementById("cp_category").value;
    currentCategory=category;
    const role = localStorage.getItem("role");

    const topicInput = document.getElementById("cp_topic");

    const showOwnerTools =
        role === "owner" &&
        (
            category === "general information" ||
            category === "announcements"
        );

    topicInput.style.display = "block";

    topicInput.placeholder =
        showOwnerTools ? t("new_topic") : t("topic");

    document.getElementById("cp_header").style.display =
        showOwnerTools ? "block" : "none";

    const templateSection = document.getElementById("templateSection");

    if (templateSection) {
        templateSection.style.display =
            showOwnerTools ? "block" : "none";
    }

    const existingTopic = document.getElementById("cp_existingTopic");

    if (existingTopic) {

        if (showOwnerTools) {
            loadTopicsForCreatePopup(category);
        } else {
            existingTopic.style.display = "none";
        }

    }
    document.getElementById("messageTemplate").value="general";
}

function loadTopicsForCreatePopup(category) {

  const boardName = localStorage.getItem("boardName");

  return fetch("http://localhost:3000/topics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      boardName,
      category
    })
  })
  .then(r => r.json())
  .then(data => {

    const select = document.getElementById("cp_existingTopic");

select.innerHTML = `
  <option value="">${t("SELECT_EXISTING_TOPIC")}</option>
`;

    data.topics.forEach(item => {

      const option = document.createElement("option");

      option.value = item.topic;
      option.textContent = item.topic;

      select.appendChild(option);

    });

    select.style.display = "block";

    return data;
  });
}

function selectExistingTopic() {

    const select = document.getElementById("cp_existingTopic");
    const topicInput = document.getElementById("cp_topic");

    if (select.value) {
        topicInput.style.display = "none";
    } else {
        topicInput.style.display = "block";
    }
}