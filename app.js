let loading = false;
let refreshInterval = null;
let categories = [];
let currentCategory = "";
let currentTopic = "";
//let currentButtonsCache = [];

console.log("APP.JS VERSION 123");
console.log("APP START");

const boardDescriptions = {
    fi: {
        family: "🏠 Perhetaulu",
        taloyhtio: "🏢 Taloyhtiön ilmoitustaulu",
        urheiluseura: "⚽ Urheiluseuran ilmoitustaulu",
        tyopaikka: "💼 Työpaikan ilmoitustaulu",
        yhdistys: "🤝 Yhdistyksen ilmoitustaulu"
    },

    en: {
        family: "🏠 Family board",
        taloyhtio: "🏢 Housing company board",
        urheiluseura: "⚽ Sports club board",
        tyopaikka: "💼 Workplace board",
        yhdistys: "🤝 Association board"
    }
};

const messages = {
    fi: {   
        ADMIN_LOGIN_FAILED: "Virheellinen admin-käyttäjänimi tai salasana.",
        BOARD_NOT_FOUND: "Taulua ei löytynyt.",
        onlyOwnerCanWrite: "Vain omistaja voi kirjoittaa tähän ketjuun.",
        PleaseSelectTopicFirst: "Valitse aihe ensin.",
        confirmRemoveMessage: "Haluatko poistaa tämän viestin?",
        confirmRemoveMessages: "Haluatko poistaa tämän viestiketjun?",
        LOGIN_FAILED: "Kirjautuminen epäonnistui.",
        BOARD_EXISTS: "Taulu on jo olemassa.",
        REMOVE_USER_CONFIRM: "Poistetaanko käyttäjä?",
        BOARD_CREATED: "Taulu luotu.",
        DATABASE_ERROR: "Tietokantavirhe.",
        SAVE: "Tallennettu.",
        LOGIN_AGAIN: "Kirjaudu uudelleen.",
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
        BOARD_TYPE_FAMILY: "perhe",
        BOARD_TYPE_NOTICE: "ilmoitus",
        NO_TOPICS_IN_CATEGORY: "Ei aiheita tässä kategoriassa",
        BOARD_NAME_RESERVED: "Taulun nimi on varattu.",
        confirmDeleteBoard: "Oletko varma että haluat poistaa taulun?",
        information: "info",
        general: "yleinen",
        maintenance: "huolto",
        events: "tapahtumat",
        announcement: "ilmoitukset",
        recommendations: "suositukset",
        topic: "Aihe",
        topics: "Aiheet",
        writeMessage: "Kirjoita viesti...",
        training: "harjoitukset",
        meetings: "kokoukset",
        "select topic": "valitse aihe",
        "general information": "yleiset tiedot",
        announcements: "tiedotteet",
        LOGIN_TITLE: "Kirjaudu Taululle",
        JOIN_TITLE: "Liity Taululle",
        CREATE_BOARD_TITLE: "Luo Taulu",
        OPEN_BOARD: "Avaa Taulu",
        JOIN_BOARD: "Liity Taululle",
        CREATE_BOARD: "Luo Taulu",
        BOARD_NAME: "Taulun nimi",
        USERNAME: "Käyttäjänimi",
        PASSWORD: "Salasana",
        EMAIL: "Sähköposti",
        SEND_REQUEST: "Lähetä Pyyntö",
        CANCEL: "Peru",
        CREATE_TOPIC_TITLE: "Luo uusi aihe",
        CREATE: "Luo",
        NEW_TOPIC: "Uusi aihe",
        SEND: "Lähetä",
        CLEAR: "Tyhjennä",
        SETTINGS: "Asetukset",
        MEMBERS: "Jäsenet",
        TODAY: "tänään",
        EDIT: "muokkaa",
        IMPORTANT: "tärkeä",
        INFO: "tiedoksi",
        LOGOUT: "Kirjaudu ulos",
        DELETE_BOARD: "Poista taulu",
        REQUESTS: "Pyynnöt",
        NOTICE_TALOYHTIO: "taloyhtiö",
        NOTICE_TYOPAIKKA: "työpaikka",
        NOTICE_URHEILUSEURA: "urheiluseura",
        NOTICE_YHDISTYS: "yhdistys"
        },
    en: {
        ADMIN_LOGIN_FAILED: "Invalid admin username or password.",
        BOARD_NOT_FOUND: "Board not found.",
        onlyOwnerCanWrite: "Only the owner can write to this chain.",
        PleaseSelectTopicFirst: "Select topic first.",
        confirmRemoveMessage: "You want to remove this message?",
        confirmRemoveMessages: "You want to remove this message chain?",
        LOGIN_FAILED: "Login failed.",
        BOARD_EXISTS: "Board already exists.",
        BOARD_CREATED: "Board created.",
        REMOVE_USER_CONFIRM: "Remove user?",
        DATABASE_ERROR: "Database error.",
        LOGIN_AGAIN: "Please login again.",
        NO_PERMISSION: "No permission.",
        SAVE: "Save done.",
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
        SAVE_ERROR: "Error saving.",
        INVALID_QUICK_MESSAGES: "Invalid quick messages.",
        NOT_OWNER: "Only owner can do this.",
        BOARD_DELETED: "Board deleted.",
        LEAVE_BOARD_CONFIRM: "Are you sure you want to leave this board?\n\nYour user account will be removed from this board.",
        USER_REMOVED: "User removed.",
        DELETE_FAILED: "Delete failed (no permission or server error).",
        NETWORK_ERROR: "Network error.",
        BOARD_TYPE_FAMILY: "family",
        BOARD_TYPE_NOTICE: "notice",
        information: "information",
        general: "general",
        maintenance: "maintenance",
        events: "events",
        topic: "Topic",
        topics: "Topics",
        writeMessage: "Write message...",
        announcement: "announcements",
        recommendations: "recommendations",
        training: "training",
        meetings: "meetings",
        "select topic": "select topic",
        "general information": "general information",
        announcements: "announcements",
        LOGIN_TITLE: "Login Board",
        JOIN_TITLE: "Join Board",
        CREATE_BOARD_TITLE: "Create Board",
        OPEN_BOARD: "Open Board",
        JOIN_BOARD: "Join Board",
        CREATE_BOARD: "Create Board",
        BOARD_NAME: "Board Name",
        USERNAME: "Username",
        PASSWORD: "Password",
        EMAIL: "Email",
        SEND_REQUEST: "Send Request",
        CANCEL: "Cancel",
        CREATE_TOPIC_TITLE: "Create New Topic",
        CREATE: "Create",
        NEW_TOPIC: "New Topic",
        SEND: "Send",
        CLEAR: "Clear",
        SETTINGS: "Settings",
        MEMBERS: "Members",
        TODAY: "today",
        EDIT: "edit",
        IMPORTANT: "important",
        INFO: "info",
        LOGOUT: "Logout",
        DELETE_BOARD: "Delete Board",
        REQUESTS: "Requests",
        NOTICE_TALOYHTIO: "housing company",
        NOTICE_TYOPAIKKA: "workplace",
        NOTICE_URHEILUSEURA: "sports club",
        NOTICE_YHDISTYS: "association"
        }
    };

const categories_family = [];

const categories_taloyhtio = [
    "information",
    "general",
    "maintenance",
    "events"
];

/*yleiset tiedot, tiedotteet*/

const categories_tyopaikka = [
    "information",
    "general",
    "recommendations",
    "events"
];

const categories_urheiluseura = [
    "information",
    "general",
    "training",
    "events"
];

const categories_yhdistys = [
    "information",
    "announcement",
    "general",
    "meetings",
    "events"
];

document.addEventListener("DOMContentLoaded", () => {

  const el = document.getElementById("boardCount");

  loadBoardCount();

  initApp();
});

function showCategories() {

    const el = document.getElementById("boardCategoriesView");

    el.style.display = "grid";
    el.style.height = "100%";

    document.getElementById("boardTopicsView").style.display = "none";
    document.getElementById("boardMessagesDiv").style.display = "none";
    document.getElementById("backToCategoriesBtn").style.display = "none";
}

function showTopics() {

    document.getElementById("boardCategoriesView").style.display = "none";
    document.getElementById("boardTopicsView").style.display = "grid";
    document.getElementById("boardMessagesDiv").style.display = "none";
    document.getElementById("backToCategoriesBtn").style.display = "block";
    
}

function showMessages() {
       
    document.getElementById("boardCategoriesView").style.display = "none";
    document.getElementById("boardTopicsView").style.display = "none";
    document.getElementById("boardMessagesDiv").style.display = "block";
    
}

function renderCategories() {

    const el = document.getElementById("boardCategoriesView");

    const categories = [
        "Info",
        "Yleinen",
        "Huolto",
        "Tapahtumat"
    ];

    el.innerHTML = categories.map(category => {

        return `
            <div class="category-card"
                 onclick="selectCategory('${category}')">
                ${category}
            </div>
        `;

    }).join("");
}

function selectCategory(category) {

    console.log("Selected category:", category);

    showTopics();

}
/*
@media(max-width: 600px) {

    #boardCategoriesView {
        grid-template-columns: 1fr;
    }

}*/

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

  console.log("INITAPP CALLED");

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

function home() {
    sessionStorage.setItem("skipAutoLogin", "true");
    window.location.href = "index.html";
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

function initBoard() {

  console.log("INITBOARD CALLED");

  let boardName = localStorage.getItem("boardName");

  if (!boardName) {
    window.location.href = "index.html";
    return;
  }

  const role = localStorage.getItem("role");

  const boardType = localStorage.getItem("boardType");
  const noticeTemplate = localStorage.getItem("noticeTemplate");

  categories = selectCategories(boardType, noticeTemplate);

  if (boardType === "notice") {
  renderCategoriesGrid();
  } 

  const savedCategory = localStorage.getItem("currentCategory") || "information";
  currentCategory = savedCategory;
  
  loadCategories();

  document.getElementById("categorySelect").value = savedCategory;
  
  currentTopic = "";

  document.getElementById("topicSelect").innerHTML =
    '<option value="">select topic</option>';

  clearMessages();

  const ownerButtons = [
    "requestsBtn",
    "settingsBtn",
    "deleteBoardBtn"
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

if (refreshInterval) clearInterval(refreshInterval);

const refreshTime = boardType === "notice" ? 60000 : 15000;

refreshInterval = setInterval(() => {
  
  if (!document.hidden) {
    loadMessage(false);
  }
}, refreshTime);

const topicSummary = document.getElementById("topicSummary");

if (boardType === "notice") {

    clearMessages();

    if (boardType === "notice") {
    showCategories();
}

    //loadTopicsFromDatabase(currentCategory);

    loadTopicCounts();

} else {

    topicSummary.style.display = "none";
    loadMessage(true);

}

if (boardType === "notice") {
    document.getElementById("noticeControls").style.display = "flex";
    document.getElementById("topicBtn").style.display = "block";
} else {
    document.getElementById("noticeControls").style.display = "none";
    document.getElementById("topicBtn").style.display = "none";
}
}

function changeTopic() {

    currentTopic =
        document.getElementById("topicSelect").value;

        console.log("SELECTED TOPIC:", currentTopic);

    if (currentTopic) {
        loadMessage(true);
    } else {
        clearMessages();
    }
}

function initLanguageButtons() {

    const langFi = document.getElementById("langFi");
    const langEn = document.getElementById("langEn");

    if (langFi) {
        langFi.onclick = () => {
            console.log("FI clicked");
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

function selectCategories(boardType, noticeTemplate) {

    if (boardType === "notice") {

        switch (noticeTemplate) {

            case "taloyhtio":
                return categories_taloyhtio;

            case "tyopaikka":
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

function renderCategoriesGrid() {

    const grid = document.getElementById("boardCategoriesView");

    if (!grid) return;

    grid.innerHTML = "";

    categories.forEach(category => {

        const card = document.createElement("div");

        card.className = "category-card";
        card.textContent = t(category);

        card.onclick = () => {
        openCategory(category);
        };
        grid.appendChild(card);

    });

}

function renderTopicsGrid(topics) {

    const el = document.getElementById("boardTopicsView");

    if (!el) return;

    el.innerHTML = "";

    topics.forEach(topic => {

        const card = document.createElement("div");

        card.className = "topic-card";
        card.textContent = topic;

        card.onclick = () => {

            currentTopic = topic;

            localStorage.setItem(
                "currentTopic",
                topic
            );

            showMessages();

            loadMessage(true);
        };

        el.appendChild(card);

    });
}

function backToCategories() {

    console.log("BACK CLICKED");

    const msg = document.getElementById("boardMessagesDiv");

    if (msg) {
        msg.style.display = "none";
        msg.innerHTML = "";
    }

    document.getElementById("boardCategoriesView").style.display = "grid";
    document.getElementById("boardTopicsView").style.display = "none";

    document.getElementById("boardTopicsView").innerHTML = "";

    currentTopic = "";
    localStorage.removeItem("currentTopic");
}

function openCategory(category) {

    currentCategory = category;

    localStorage.setItem(
        "currentCategory",
        category
    );

    showTopics();

    loadTopicsFromDatabase(category);
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
     loadBoardCount();
   }
}

function loadCategories() {

    const selects = [
        "categorySelect",
        "cp_category"
    ];

    selects.forEach(id => {

        const select = document.getElementById(id);

        if (!select) return;

        select.innerHTML = "";

        categories.forEach(category => {

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

    document.querySelector("#cp_noticeTemplate option[value='tyopaikka']").textContent =
        t("NOTICE_TYOPAIKKA");

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

    setPlaceholder("boardName", "BOARD_NAME");
    setPlaceholder("boardUsername", "USERNAME");
    setPlaceholder("boardPassword", "PASSWORD");

    setPlaceholder("joinBoardName", "BOARD_NAME");
    setPlaceholder("joinUsername", "USERNAME");
    setPlaceholder("joinPassword", "PASSWORD");
    setPlaceholder("joinEmail", "EMAIL");

    setText("sendJoinBtn", "SEND_REQUEST");
    setText("joinCancelBtn", "CANCEL");

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

    setText("createTopicTitle", "CREATE_TOPIC_TITLE");

    document.querySelector("#cp_informationTopic option[value='general information']").textContent =
        t("general information");

    document.querySelector("#cp_informationTopic option[value='announcements']").textContent =
        t("announcements");

    setText("cp_createBtn", "CREATE");
    setText("cp_cancelBtn", "CANCEL");

    setText("topicBtn", "NEW_TOPIC");
    setText("sendBtn", "SEND");
    setText("clearBtn", "CLEAR");
    setText("settingsBtn", "SETTINGS");
    setText("members", "MEMBERS");

    setText("todayModeText", "TODAY");
    setText("editModeText", "EDIT");
    setText("importantModeText", "IMPORTANT");
    setText("infoModeText", "INFO");

    setText("logout", "LOGOUT");
    setText("deleteBoardBtn", "DELETE_BOARD");
    setText("requestsBtn", "REQUESTS");

    setPlaceholder("boardNewMsg", "writeMessage");
} 

// =====================
// LOAD MESSAGES
// =====================

function loadMessage(forceScroll = false) {

  console.log("loadMessage START");
  
  const box = document.getElementById("boardMessagesDiv");
  if (!box) return;

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

  return fetch(`http://localhost:3000/board/${boardName}`)
  .then(res => res.json())
  .then(data => {

   console.log("MESSAGES FROM DB:", data.boardMessages.length);
  const boardType = data.boardType;
  const noticeTemplate = data.noticeTemplate;
  localStorage.setItem("boardType", boardType);
  localStorage.setItem("noticeTemplate", noticeTemplate);

  categories = selectCategories(boardType, noticeTemplate);

  //loadCategories();

  if (boardType === "notice" && !currentTopic) {
    clearMessages();
  }

  const requestButton = document.getElementById("requestsBtn");

  const quickBtn = document.getElementById("quickMessagesBtn");

if (quickBtn) {
    if (data.boardType === "notice") {
        quickBtn.style.display = "none";
    } else {
        quickBtn.style.display = "inline";
    }
}

  if (requestButton) {
    if (data.pendingRequests.length > 0) {
      requestButton.classList.add("pending");
    } else {
    requestButton.classList.remove("pending");
    }
  }

    updateQuickUI(data);

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

messages.forEach(msg => {

  const div = document.createElement("div");

  if (data.boardType === "notice") {
    div.className = "notice-row";
  } else {
    div.className = "msg-row";
  }

  if (msg.type === "important") {
    div.classList.add("important-msg");
  }

  if (msg.type === "info") {
    div.classList.add("info-msg");
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
  body.innerText = msg.text;

  text.appendChild(author);
  text.appendChild(body);

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

  const editMode = document.getElementById("editMode")?.checked;
  const username = localStorage.getItem("boardUsername");

  const user = data.users.find(u => u.username === username);
  const owner = user?.role === "owner";

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

    if (forceScroll || isAtBottom) {
      box.scrollTop = box.scrollHeight;
    }
  })
  .catch(console.error)
  .finally(() => {
    console.log("loadMessage END");
    loading = false;
  });
}

// =====================
// UPDATE MESSAGE
// =====================

function updateMessage() {

  const messageEl = document.getElementById("boardNewMsg");

  if (!messageEl) return;

  const boardMessage = messageEl.value;

  const boardName = localStorage.getItem("boardName");
  const boardUsername = localStorage.getItem("boardUsername") || boardName;
  let type="normal";
  const boardType = localStorage.getItem("boardType");
  const role = localStorage.getItem("role");

  if (document.getElementById("importantMode").checked) {
    type = "important";
  }

  if (document.getElementById("infoMode").checked) { 
    type="info";
  }

let category = "";
let topic = "";

if (boardType === "notice") {
    /*
    category = document.getElementById("categorySelect").value;
    topic = document.getElementById("topicSelect").value;
    */
    category = currentCategory;
    topic = currentTopic;

    if (
    boardType === "notice" &&
    currentCategory === "information" &&
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
    author: boardUsername,
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

function loginWithPassword() {

  const boardName = document.getElementById("boardName").value;
  const boardPassword = document.getElementById("boardPassword").value;
  const boardUsername = document.getElementById("boardUsername").value;

   console.log("boardName =", boardName);
console.log("username =", boardUsername);
console.log("password =", boardPassword);
console.log("'" + boardName + "'");

  if (boardName.toLowerCase() === "admin") {

    console.log("ADMIN LOGIN");

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
  .then(res => res.json())
  .then(async data => {

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


// =====================
// CLEAR TABLE
// =====================

async function clearTable() {

  const boardName = localStorage.getItem("boardName");
  const boardType = localStorage.getItem("boardType");

  if (boardType === "notice" && !currentTopic) {
    alert("Select topic first");
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
    }
    //setTimeout(() => alert(t(data.message)), 100);
    setTimeout(() => alert(t(data.message)), 200);
  });
}

// =====================
// NAV
// =====================

function logout() {
  const lang = localStorage.getItem("language");

  localStorage.clear();

  if (lang) {
    localStorage.setItem("language", lang);
  }
  window.location.href = "index.html";
}

function loadBoardCount() {

  const el = document.getElementById("boardCount");
  if (!el) return;

  const lang = localStorage.getItem("language") || "fi";

  console.log("Board count language:", lang);

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
        el.innerText = "Taulujen haku epäonnistui";
      } else {
        el.innerText = "Cannot get Boards";
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
    document.getElementById("editMode").checked = false;
    loadMessage(true);
  });
}

function renderVisitedUsers(users) {
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
}

function updateQuickUI(data) {
  renderVisitedUsers(data.visitedUsers);
}

function openSettings() {
  console.log("OPEN SETTINGS TRIGGERED BY CLICK");

  const boardName =
    localStorage.getItem("boardName");

  fetch(`http://localhost:3000/board/${boardName}`)
    .then(res => res.json())
    .then(board => {

      document.getElementById(
        "autoDeleteDays"
      ).value =
        board.autoDeleteDays ?? 10;

      document.getElementById(
        "settingsPopup"
      ).style.display = "block";
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

  });
}

const infoMode = document.getElementById("infoMode");

if (infoMode) {
  infoMode.addEventListener("change", function () {

    if (this.checked) {
      document.getElementById("importantMode").checked = false;
    }

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
  
  console.log("SHOW MEMBERS TRIGGERED BY CLICK");
  
  const boardName = localStorage.getItem("boardName");

  fetch(`http://localhost:3000/board/${boardName}`)
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
            <span class="member-role">(${m.role})</span>
        </div>
      `).join("") +

    `<div class="member-grid">
       ${others.map(m => `
    <div class="member-row">
        ${m.username}
        <span class="member-role">(${m.role})</span>

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

      popup.style.display = "block";
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

  const boardName = document.getElementById("cp_boardName").value;
  const boardType = document.getElementById("cp_boardType").value;
  const boardUsername = document.getElementById("cp_username").value;
  const ownerEmail = document.getElementById("cp_email").value;
  const boardPassword = document.getElementById("cp_password").value;

  let noticeTemplate = "";

  if (boardType === "notice") {
    noticeTemplate = document.getElementById("cp_noticeTemplate").value;
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
  document.getElementById("createTopicPopup").style.display = "flex";
  createTopicPopupCategoryChanged();
}

function closeTopicPopup() {
    document.getElementById("createTopicPopup").style.display = "none";
}

function submitTopic() {

  let type="normal";

  const boardName = localStorage.getItem("boardName");
  const category = document.getElementById("cp_category").value;
  //let topic = document.getElementById("cp_topic").value;
  const message = document.getElementById("cp_message").value;
  const author = localStorage.getItem("boardUsername");

  let topic;

  if (category === "information") {
    topic = document.getElementById("cp_informationTopic").value;
  } else {
    topic = document.getElementById("cp_topic").value;
  }

  if (topic.length > 40) {
    alert(t("TOPIC_TOO_LONG"));
    return;
  }

   if (category !== "information" && !topic.trim()) {
    alert(t("TOPIC_MISSING"));
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
    message,
    type
})
  })
  .then(r => r.json())
  .then(data => {

    alert(t(data.message));

if (data.success) {

    closeTopicPopup();

    currentCategory = category;
    document.getElementById("categorySelect").value = category;
    localStorage.setItem("currentCategory", category);

    loadTopicsFromDatabase(category, topic);

    if (data.boardType === "notice") {
        loadTopicCounts();
    }

    document.getElementById("cp_category").value = "general";
    document.getElementById("cp_topic").value = "";
    document.getElementById("cp_message").value = "";
}
  });
 
}

function changeCategory() {

    currentCategory = document.getElementById("categorySelect").value;

    localStorage.setItem("currentCategory", currentCategory);

    currentTopic = "";

    document.getElementById("topicSelect").innerHTML =
        '<option value="">Select topic</option>';

    clearMessages();

    loadTopicsFromDatabase(currentCategory);
}

function clearMessages() {
    document.getElementById("boardMessagesDiv").innerHTML = "";
}

function loadTopicsFromDatabase(category, selectedTopic = "") {

    console.log("loadTopicsFromDatabase");

    console.log("CATEGORY:", category);
console.log("CURRENT CATEGORY:", currentCategory);

    const boardName = localStorage.getItem("boardName");

    fetch("http://localhost:3000/topics", {
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

        console.log("TOPICS END");

        if (data.topics.length === 0) {

            document.getElementById("boardTopicsView").innerHTML = "";

            alert(t("NO_TOPICS_IN_CATEGORY"));

            backToCategories();

            return;
        }

        renderTopicsGrid(data.topics);


        if (selectedTopic) {

            currentTopic = selectedTopic;

            loadTopicCounts();

            loadMessage(true);
        }

    });
}

function openRequests() {

  console.log("OPEN REQUESTS");
  document.getElementById("requestsPopup").style.display = "block";
 
  loadRequests();
}

function closeRequests() {
  console.trace("CLOSE REQUESTS");
  document.getElementById("requestsPopup").style.display = "none";
}

function loadRequests() {

  console.log("LOAD REQUESTS");

  const boardName = localStorage.getItem("boardName");

  fetch(`http://localhost:3000/board/${boardName}`)
    .then(res => res.json())
    .then(board => {

  const list = document.getElementById("requestsList");
  list.innerHTML = "";

  if (!board.pendingRequests || board.pendingRequests.length === 0) {

    list.innerHTML = "<b>No pending requests.</b>";

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
    loadMessage(false);
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

  document.addEventListener("click", function(e) {

    // Jos klikattiin menupainiketta, ei tehdä mitään
    if (menuBtn.contains(e.target)) return;

    // Jos klikattiin valikon ulkopuolelle, sulje valikko
    if (!topMenu.contains(e.target)) {
      topMenu.classList.remove("open");
    }

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

  console.log("SHOW QUICK MESSAGES TRIGGERED BY CLICK");

  const saveBtn = document.getElementById("saveQuickBtn");
  const editMode = document.getElementById("editMode")?.checked;

  if (saveBtn) {
    saveBtn.style.display = editMode ? "inline-block" : "none";
  }

  const boardName = localStorage.getItem("boardName");
  const el = document.getElementById("quickMessagesList");
  const popup = document.getElementById("quickMessagesPopup");

  if (!el || !popup) return;

  el.innerHTML = "";

  fetch(`http://localhost:3000/board/${boardName}`)
    .then(res => res.json())
    .then(board => {
      const quickMessages = board.quickMessages || [];

      if (editMode) {

  el.innerHTML =
    quickMessages.map((msg) => `
      <input class="quick-input" value="${msg}">
    `).join("");

} else {

  el.innerHTML =
    quickMessages.map((msg) => {

      const shortMsg = msg.length > 39 
        ? msg.substring(0, 39) + "..."
        : msg;

      return `
      <div class="quick-row"
          onclick="sendQuickMessage(this)">
          ${shortMsg}
      </div>
      `;

    }).join("");
    }

      popup.style.display = "block";
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

  const quickMessages = Array.from(inputs)
    .map(input => input.value.trim());

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
    ? "block"
    : "none";
  }

  if (settingsBtn) {
  settingsBtn.style.display =
  (role === "owner" && editMode)
    ? "block"
    : "none";
}

if (deleteBoardBtn) {
  deleteBoardBtn.style.display =
  (role === "owner" && editMode)
    ? "block"
    : "none";
}
}

function loadTopicCounts() {

  console.log("=== loadTopicCounts ===");

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
    console.log("COUNTS END");
    if (!data.success) return;

    const order = categories;

    const visibleCategories = order;

let text = t("topics") + ": ";

visibleCategories.forEach(category => {

    const c = data.counts.find(item => item.category === category);

    if (c) {
        text += `${t(c.category)} (${c.count})  `;
    }
});

    document.getElementById("topicSummary").textContent = text;
});
}


function changeCreateBoardType() {

    const boardType = document.getElementById("cp_boardType").value;

    document.getElementById("noticeTemplateDiv").style.display =
        boardType === "notice" ? "block" : "none";
}

function createTopicPopupCategoryChanged() {

    const category = document.getElementById("cp_category").value;

    const topicInput = document.getElementById("cp_topic");
    const infoSelect = document.getElementById("cp_informationTopic");

    if (category === "information") {

        topicInput.style.display = "none";
        infoSelect.style.display = "block";

    } else {

        topicInput.style.display = "block";
        infoSelect.style.display = "none";

        topicInput.value = "";
        topicInput.placeholder = t("topic");
    }
}

