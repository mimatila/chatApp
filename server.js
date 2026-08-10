const express = require("express");
const cors = require("cors");
const app = express();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "mimatila",
  password: "Ollikuhta70",
  database: "chatApp",
  waitForConnections: true,
  connectionLimit: 10
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("MariaDB connected!");
    conn.release();
  } catch (err) {
    console.error(err);
  }
})();

// 🔥 CORS ENSIN
app.use(cors());

// sitten JSON parsing
app.use(express.json());

app.post("/login", async (req, res) => {

  const { boardName, boardUsername, boardPassword } = req.body;

  try {

    // Hae käyttäjä ja board yhdellä kyselyllä
    const [rows] = await pool.query(
  `SELECT users.id,
       users.password,
       users.role,
       users.username,
       boards.boardType,
       boards.noticeTemplate
   FROM users
   JOIN boards
     ON users.board_id = boards.id
   WHERE boards.name = ?
     AND BINARY users.username = BINARY ?`,
  [boardName, boardUsername]
);
     
  /*ei käsitelty messagea frontendissä, ei tarvia käännöstä*/

  if (rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Board or user not found"
    });
  }

  const user = rows[0];

  const ok = await bcrypt.compare(
  boardPassword,
  user.password
);

if (!ok) {
  return res.status(401).json({
    success: false,
    message: "Invalid login"
  });
}

  const token = crypto.randomUUID();

  await pool.query(
    "UPDATE users SET token = ? WHERE id = ?",
    [token, user.id]
  );

  res.json({
  success: true,
  token,
  username: user.username,
  role: user.role,
  boardType: user.boardType,
  noticeTemplate: user.noticeTemplate
  });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Database error"
    });
  }
});

app.post("/create", async (req, res) => {

  const {
    boardName,
    boardType,
    noticeTemplate,
    boardUsername,
    boardPassword,
    ownerEmail
  } = req.body;

  const quickMessages = [
    "Kaupassa",
    "Töissä",
    "Kotona",
    "Nukkumassa",
    "Syömässä",
    "Tulossa",
    "Myöhässä",
    "Sairas",
    "Tauolla",
    "Kuntosalilla"
  ];

  const reservedNames = ["admin"];

  if (reservedNames.includes(boardName.toLowerCase())) {
    return res.json({
        success: false,
        message: "BOARD_NAME_RESERVED"
    });
  }

  const connection = await pool.getConnection();

  try {

    await connection.beginTransaction();

    // Onko board jo olemassa?
    const [boards] = await connection.query(
      "SELECT id FROM boards WHERE name = ?",
      [boardName]
    );

    if (boards.length > 0) {
      await connection.rollback();

      return res.status(400).json({
      success: false,
      message: "BOARD_EXISTS"
  });
}

    // Luo board
const [boardResult] = await connection.query(
  "INSERT INTO boards (name, boardType, noticeTemplate) VALUES (?, ?, ?)",
  [
    boardName,
    boardType,
    boardType === "notice" ? noticeTemplate : null
  ]
);

const boardId = boardResult.insertId;

  const autoDays = (boardType === "notice") ? 30 : 10;

  // Luo settings oletusarvolla 10 päivää
  await connection.query(
  `INSERT INTO settings
  (board_id, autoDeleteDays)
  VALUES (?, ?)`,
  [boardId, autoDays]
  );

  const hash = await bcrypt.hash(boardPassword, 10);
  
  // Luo owner
  await connection.query(
  `INSERT INTO users
   (board_id, username, password, email, role, token)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [
    boardId,
    boardUsername,
    hash,
    ownerEmail,
    "owner",
    null
  ]
);

  // Lisää quickMessages
  for (const msg of quickMessages) {
    await connection.query(
      `INSERT INTO quickMessages
      (board_id, message)
      VALUES (?, ?)`,
      [
        boardId,
        msg
      ]
    );
  }

  await connection.commit();

  res.json({
  success: true,
  message: "BOARD_CREATED"
  });

  } catch (err) {

    await connection.rollback();

    console.error(err);

    res.status(500).json({
    success: false,
    message: "DATABASE_ERROR"
  });

  } finally {

    connection.release();

  }
});

app.delete("/delete/:boardName", async (req, res) => {

  const boardName = req.params.boardName;

  const user = await authUser(req, boardName);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "LOGIN_AGAIN"
    });
  }

  if (user.role !== "owner") {
    return res.status(403).json({
      success: false,
      message: "NOT_OWNER"
    });
  }

  const connection = await pool.getConnection();

  try {

    await connection.beginTransaction();

    // Hae board_id
    const [boards] = await connection.query(
      "SELECT id FROM boards WHERE name = ?",
      [boardName]
    );

    if (boards.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "BOARD_NOT_FOUND"
      });
    }

    const boardId = boards[0].id;

    await connection.query(
  "DELETE FROM boards WHERE id = ?",
  [boardId]
);

    await connection.commit();

    res.json({
      success: true,
      message: "BOARD_DELETED"
    });

  } catch (err) {

    await connection.rollback();

    console.error(err);

    res.status(500).json({
      success: false,
      message: "DATABASE_ERROR"
    });

  } finally {

    connection.release();
  }
});

app.delete("/admin/boards", async (req,res)=>{

    try {

        await pool.query(
            "DELETE FROM boards"
        );

        res.json({
            success:true
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            success:false
        });
    }

});

app.delete("/admin/board/:id", async (req, res) => {

    try {

        const id = req.params.id;

        await pool.query(
            "DELETE FROM boards WHERE id = ?",
            [id]
        );

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success:false
        });
    }

});

app.delete("/leaveBoard/:boardName", async (req, res) => {

  const boardName = req.params.boardName;

  const user = await authUser(req, boardName);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "LOGIN_AGAIN"
    });
  }

  const connection = await pool.getConnection();

  try {

    await connection.beginTransaction();

    await connection.query(
      "DELETE FROM users WHERE id = ?",
      [user.id]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "USER_REMOVED"
    });

  } catch (err) {

    await connection.rollback();

    console.error(err);

    res.status(500).json({
      success: false,
      message: "DATABASE_ERROR"
    });

  } finally {

    connection.release();
  }
});

app.put("/boardMessage/:id", async (req, res) => {

    const { id } = req.params;

    const {
        topic,
        message
    } = req.body;

    try {

        const sql = `
            UPDATE boardMessages
            SET topic = ?, text = ?
            WHERE id = ?
        `;

        const [result] = await pool.query(
            sql,
            [topic, message, id]
        );

        res.json({
            success: true,
            message: "Updated"
        });

    } catch (error) {

        console.error("UPDATE ERROR:", error);

        res.status(500).json({
            success: false
        });
    }
});

app.post("/boardMessage", async (req, res) => {

  const token = req.headers.authorization;

  const {
    boardName,
    category,
    topic,
    message,
    type
  } = req.body;

  const [users] = await pool.query(
    `
    SELECT id, username, board_id
    FROM users
    WHERE token = ?
    `,
    [token]
);

if (users.length === 0) {
    return res.status(401).json({
        success:false,
        message:"Invalid token"
    });
}

const user = users[0];

const author = user.username;

 const [boards] = await pool.query(
    "SELECT id, boardType FROM boards WHERE name = ?",
    [boardName]
);

if (boards.length === 0) {
    return res.json({
        success: false,
        message: "BOARD_NOT_FOUND"
    });
}

const boardId = boards[0].id;
const boardType = boards[0].boardType;

const [settings] = await pool.query(
    "SELECT autoDeleteDays FROM settings WHERE board_id = ?",
    [boardId]
);

const autoDeleteDays = settings[0]?.autoDeleteDays ?? 30;

await cleanup(boardId, autoDeleteDays);

  // TÄHÄN TOPIC-TARKISTUS

  if (boardType === "notice") {

  const [topics] = await pool.query(
    `
    SELECT id
    FROM boardMessages
    WHERE board_id = ?
    AND category = ?
    AND topic = ?
    LIMIT 1
    `,
    [
      boardId,
      category,
      topic
    ]
  );


  if (topics.length === 0) {
    return res.json({
      success: false,
      message: "Topic not found"
    });
  }
  }

  // vasta nyt tallennetaan viesti

  await pool.query(
    `
    INSERT INTO boardMessages
    (id, board_id, author, time, text, type, category, topic)
    VALUES (UUID(), ?, ?, NOW(), ?, ?, ?, ?)
    `,
    [
      boardId,
      author,
      message,
      type,
      category,
      topic
    ]
  );


  res.json({
    success: true,
    message: "Message added"
  });

});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.get("/board/:boardName", async (req, res) => {

  const boardName = req.params.boardName;

  try {

    // Hae board
    const [boards] = await pool.query(
  "SELECT id, boardType, noticeTemplate FROM boards WHERE name = ?",
  [boardName]
);

    if (boards.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Taulua ei löydy"
      });
    }

    const boardId = boards[0].id;

 
    const [settings] = await pool.query(
      "SELECT autoDeleteDays FROM settings WHERE board_id = ?",
      [boardId]
    );

const autoDeleteDays = settings[0]?.autoDeleteDays ?? 30;

//await cleanup(boardId, autoDeleteDays);


    // Hae käyttäjät
    const [users] = await pool.query(
      `SELECT username, email, role, token
       FROM users
       WHERE board_id = ?`,
      [boardId]
    );

    // Hae viestit
   const [boardMessages] = await pool.query(
  `SELECT id, author, time, text, type, category, topic, header
   FROM boardMessages
   WHERE board_id = ?
   ORDER BY time`,
  [boardId]
);

    // Hae liittymispyynnöt
    const [pendingRequests] = await pool.query(
      `SELECT id, username, password, email, status, time
       FROM pendingRequests
       WHERE board_id = ?`,
      [boardId]
    );

    // Hae pikaviestit
    const [quickMessages] = await pool.query(
      `SELECT message
       FROM quickMessages
       WHERE board_id = ?
       ORDER BY id`,
      [boardId]
    );

    // Hae viimeksi nähdyt käyttäjät
    const [visitedUsers] = await pool.query(
      `SELECT name, lastSeen
       FROM visitedUsers
       WHERE board_id = ?`,
      [boardId]
    );

    // Rakennetaan sama JSON kuin ennen
    const board = {

      boardType: boards[0].boardType,

      noticeTemplate: boards[0].noticeTemplate,

      users,
      boardMessages,
      pendingRequests,
      autoDeleteDays:
      settings.length > 0
      ? settings[0].autoDeleteDays
      : 10,
      quickMessages:
      quickMessages.map(q => q.message),
      visitedUsers
    };

    res.json(board);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Database error"
    });
  }
});

app.post("/loadMessages", async (req, res) => {

    const {
        boardName,
        category,
        topic
    } = req.body;

    try {

        // hae board_id
        const [boards] = await pool.query(
            "SELECT id FROM boards WHERE name = ?",
            [boardName]
        );

        if (boards.length === 0) {
            return res.json({
                success: false,
                message: "Board not found"
            });
        }

        const boardId = boards[0].id;

        // hae vain tämän topicin viestit
        const [boardMessages] = await pool.query(
            `
            SELECT id,
                   author,
                   time,
                   text,
                   type
            FROM boardMessages
            WHERE board_id = ?
              AND category = ?
              AND topic = ?
            ORDER BY time
            `,
            [
                boardId,
                category,
                topic
            ]
        );

        res.json({
            success: true,
            boardMessages
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
});

app.delete("/clear/:boardName", async (req, res) => {

  const boardName = req.params.boardName;

  try {

    const user = await authUser(req, boardName);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "LOGIN_AGAIN"
      });
    }

    if (user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "NO_PERMISSION"
      });
    }

    // Hae board_id
    const [boards] = await pool.query(
      "SELECT id, boardType FROM boards WHERE name = ?",
      [boardName]
    );

    if (boards.length === 0) {
      return res.status(404).json({
        success: false,
        message: "BOARD_NOT_FOUND"
      });
    }

    const boardId = boards[0].id;
    const boardType = boards[0].boardType;

    // Poista kaikki viestit
    const { category, topic } = req.body;

if (boardType === "notice") {

  await pool.query(
    `DELETE FROM boardMessages
     WHERE board_id = ?
     AND category = ?
     AND topic = ?`,
    [
      boardId,
      category,
      topic
    ]
  );

} else {

  await pool.query(
    "DELETE FROM boardMessages WHERE board_id = ?",
    [boardId]
  );

}

    res.json({
      success: true,
      message: "MESSAGES_CLEARED"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "DATABASE_ERROR"
    });
  }
});

app.get("/boards/count", async (req, res) => {

  try {

    const [rows] = await pool.query(
      "SELECT COUNT(*) AS count FROM boards"
    );

    res.json({
      count: rows[0].count
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Database error"
    });
  }
});

app.post("/quickMessages/saveAll", async (req, res) => {

  const { boardName, quickMessages } = req.body;

  try {

    const user = await authUser(req, boardName);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "LOGIN_AGAIN"
      });
    }

    // Hae board_id
    const [boards] = await pool.query(
      "SELECT id FROM boards WHERE name = ?",
      [boardName]
    );

    if (boards.length === 0) {
  return res.status(404).json({
    success: false,
    message: "BOARD_NOT_FOUND"
  });
}

    const boardId = boards[0].id;

    // Päivitä pikaviesti
    const [rows] = await pool.query(
  `SELECT id
   FROM quickMessages
   WHERE board_id = ?
   ORDER BY id`,
  [boardId]
);

if (!Array.isArray(quickMessages) || quickMessages.length !== 10) {
  return res.status(400).json({
    success: false,
    message: "INVALID_QUICK_MESSAGES"
  });
}

if (quickMessages.some(msg => msg.trim() === "")) {
  return res.status(400).json({
    success: false,
    message: "QUICK_MESSAGE_EMPTY"
  });
}

for (let i = 0; i < quickMessages.length; i++) {

  await pool.query(
    `UPDATE quickMessages
     SET message = ?
     WHERE id = ?
     AND board_id = ?`,
    [
      quickMessages[i],
      rows[i].id,
      boardId
    ]
  );

}

    res.json({
    success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "DATABASE_ERROR"
    });
  }
});

app.delete("/message/:boardName/:id", async (req, res) => {

  const { boardName, id } = req.params;

  try {

    const user = await authUser(req, boardName);

    if (!user) {
      return res.status(401).json({
        success: false
      });
    }

    // Hae viesti
    const [rows] = await pool.query(
      `SELECT
      boardMessages.author,
      boardMessages.board_id
      FROM boardMessages
      JOIN boards
        ON boardMessages.board_id = boards.id
      WHERE boards.name = ?
      AND boardMessages.id = ?`,
      [boardName, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false
      });
    }

    const message = rows[0];

    // Owner saa poistaa kaiken,
    // muut vain omat viestinsä
    if (
      user.role !== "owner" &&
      message.author !== user.username
    ) {
      return res.status(403).json({
        success: false,
        message: "Ei oikeuksia"
      });
    }

    // Poista viesti
    await pool.query(
      `DELETE FROM boardMessages
       WHERE id = ?`,
      [id]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Database error"
    });
  }
});

app.post("/visit", async (req, res) => {

  const { boardName, boardUsername } = req.body;

  try {

    // Hae board_id
    const [boards] = await pool.query(
      "SELECT id FROM boards WHERE name = ?",
      [boardName]
    );

    if (boards.length === 0) {
      return res.status(404).json({
        success: false
      });
    }

    const boardId = boards[0].id;

    // Onko käyttäjä jo olemassa?
    const [rows] = await pool.query(
      `SELECT id
       FROM visitedUsers
       WHERE board_id = ?
       AND name = ?`,
      [boardId, boardUsername]
    );

    if (rows.length > 0) {

      // Päivitä aika
      await pool.query(
        `UPDATE visitedUsers
         SET lastSeen = ?
         WHERE board_id = ?
         AND name = ?`,
        [Date.now(), boardId, boardUsername]
      );

    } else {

      // Lisää uusi
      await pool.query(
        `INSERT INTO visitedUsers
        (board_id, name, lastSeen)
        VALUES (?, ?, ?)`,
        [boardId, boardUsername, Date.now()]
      );

    }

    // Säilytetään vain 5 uusinta
    await pool.query(
      `DELETE FROM visitedUsers
       WHERE board_id = ?
       AND id NOT IN (
         SELECT id
         FROM (
           SELECT id
           FROM visitedUsers
           WHERE board_id = ?
           ORDER BY lastSeen DESC
           LIMIT 5
         ) AS latest
       )`,
      [boardId, boardId]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Database error"
    });
  }
});

app.post("/settings", async (req, res) => {

  const {
    boardName,
    autoDeleteDays
  } = req.body;

  try {

    const user = await authUser(req, boardName);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Kirjaudu uudelleen"
      });
    }

    if (user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Ei oikeuksia"
      });
    }

    // Hae board_id
    const [boards] = await pool.query(
      "SELECT id FROM boards WHERE name = ?",
      [boardName]
    );

    if (boards.length === 0) {
      return res.status(404).json({
        success: false
      });
    }

    const boardId = boards[0].id;

    // Päivitä asetus
    await pool.query(
      `UPDATE settings
       SET autoDeleteDays = ?
       WHERE board_id = ?`,
      [
        Number(autoDeleteDays),
        boardId
      ]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Database error"
    });
  }
});

app.post("/joinRequest", async (req, res) => {

  const { boardName, username, password, email } = req.body;

  try {

    // Hae board
    const [boards] = await pool.query(
      "SELECT id FROM boards WHERE name = ?",
      [boardName]
    );

    if (boards.length === 0) {
  return res.status(404).json({
    success: false,
    message: "BOARD_NOT_FOUND"
  });
}

    const boardId = boards[0].id;

    // Onko käyttäjä jo olemassa?
    const [users] = await pool.query(
      `SELECT id
       FROM users
       WHERE board_id = ?
       AND username = ?`,
      [boardId, username]
    );

    if (users.length > 0) {
  return res.json({
    success: false,
    message: "USERNAME_EXISTS"
  });
}

    // Onko liittymispyyntö jo olemassa?
    const [requests] = await pool.query(
      `SELECT id
       FROM pendingRequests
       WHERE board_id = ?
       AND (username = ? OR email = ?)`,
      [boardId, username, email]
    );

    if (requests.length > 0) {
  return res.json({
    success: false,
    message: "REQUEST_PENDING"
  });
}

    // Lisää liittymispyyntö
    
const hash = await bcrypt.hash(password, 10);

await pool.query(
  `INSERT INTO pendingRequests
  (id, board_id, username, password, email, status, time)
  VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [
    crypto.randomUUID(),
    boardId,
    username,
    hash,          // ← hash, ei password
    email,
    "pending",
    new Date()
  ]
);

    res.json({
  success: true,
  message: "REQUEST_SENT"
});

  } catch (err) {

    console.error(err);

    res.status(500).json({
  success: false,
  message: "DATABASE_ERROR"
  });
  }
});

app.post("/acceptRequest", async (req, res) => {

  const { boardName, id } = req.body;

  const connection = await pool.getConnection();

  try {

    await connection.beginTransaction();

    // Hae liittymispyyntö
    const [rows] = await connection.query(
      `SELECT
          pendingRequests.*,
          boards.id AS board_id
       FROM pendingRequests
       JOIN boards
         ON pendingRequests.board_id = boards.id
       WHERE boards.name = ?
         AND pendingRequests.id = ?`,
      [boardName, id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false
      });
    }

    const request = rows[0];

    // Lisää käyttäjä
    await connection.query(
  `INSERT INTO users
   (board_id, username, email, password, role, token)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [
    request.board_id,
    request.username,
    request.email,
    request.password,   // tämä on jo hash
    "member",
    null
  ]
);

    // Poista liittymispyyntö
    await connection.query(
      `DELETE FROM pendingRequests
       WHERE id = ?`,
      [id]
    );

    await connection.commit();

    res.json({
      success: true
    });

  } catch (err) {

    await connection.rollback();

    console.error(err);

    res.status(500).json({
      success: false
    });

  } finally {

    connection.release();
  }
});

app.post("/rejectRequest", async (req, res) => {

  const { boardName, id } = req.body;
  const token = req.headers.authorization;

  try {

    // Tarkista että token kuuluu ownerille tässä boardissa
    const [owners] = await pool.query(
      `SELECT users.id
       FROM users
       JOIN boards
         ON users.board_id = boards.id
       WHERE boards.name = ?
         AND users.token = ?
         AND users.role = 'owner'`,
      [boardName, token]
    );

    if (owners.length === 0) {
      return res.status(403).json({
        success: false
      });
    }

    // Poista liittymispyyntö
    const [result] = await pool.query(
      `DELETE pendingRequests
       FROM pendingRequests
       JOIN boards
         ON pendingRequests.board_id = boards.id
       WHERE boards.name = ?
         AND pendingRequests.id = ?`,
      [boardName, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false
      });
    }

    res.json({
      success: true,
      message: "Request rejected"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Database error"
    });
  }
});

app.post("/authCheck", async (req, res) => {

  console.log("AUTHCHECK CALLED");

  const { boardName } = req.body;

  try {

    const user = await authUser(req, boardName);

    if (!user) {
      return res.status(401).json({
        success: false
      });
    }

    res.json({
      success: true,
      username: user.username,
      role: user.role
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Database error"
    });
  }
});

async function authUser(req, boardName) {

    const token = req.headers.authorization;

    if (!token) {
        return null;
    }

    const [rows] = await pool.query(
        `
        SELECT 
            users.id,
            users.username,
            users.role,
            users.board_id
        FROM users
        JOIN boards
            ON users.board_id = boards.id
        WHERE boards.name = ?
          AND users.token = ?
        `,
        [boardName, token]
    );

    if (rows.length === 0) {
        return null;
    }

    return rows[0];
}

app.post("/removeMember", async (req, res) => {

  const { boardName, username } = req.body;

  try {

    const owner = await authUser(req, boardName);

    if (!owner || owner.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "ONLY_OWNER_REMOVE"
      });
    }

    const [boards] = await pool.query(
      "SELECT id FROM boards WHERE name = ?",
      [boardName]
    );

    if (boards.length === 0) {
      return res.status(404).json({
        success: false,
        message: "BOARD_NOT_FOUND"
      });
    }

    const boardId = boards[0].id;

    const [result] = await pool.query(
      `DELETE FROM users
       WHERE board_id = ?
       AND username = ?
       AND role = 'member'`,
      [boardId, username]
    );


    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: "MEMBER_NOT_FOUND"
      });
    }


    res.json({
      success: true,
      message: "MEMBER_REMOVED"
    });


  } catch(err) {

    console.error(err);

    res.status(500).json({
      success:false,
      message:"DATABASE_ERROR"
    });
  }
});

app.post("/createTopic", async (req, res) => {

  const {
    boardName,
    author,
    category,
    topic,
    header,
    message,
    type
  } = req.body;

  const allowSameTopic =
    category === "general information" ||
    category === "announcements";

  if (topic.length > 40) {
    return res.json({
      success: false,
      message: "TOPIC_TOO_LONG"
    });
  }

  try {

    // Hae board_id
    const [boards] = await pool.query(
      "SELECT id FROM boards WHERE name = ?",
      [boardName]
    );

    if (boards.length === 0) {
      return res.status(404).json({
        success: false,
        message: "BOARD_NOT_FOUND"
      });
    }

    const boardId = boards[0].id;

    if (!allowSameTopic) {

    const [existing] = await pool.query(
        `
        SELECT id
        FROM boardMessages
        WHERE board_id = ?
        AND category = ?
        AND topic = ?
        LIMIT 1
        `,
        [
            boardId,
            category,
            topic
        ]
    );

    if (existing.length > 0) {
        return res.json({
            success: false,
            message: "TOPIC_ALREADY_EXISTS"
        });
    }
}


    // Hae käyttäjän rooli
    const [users] = await pool.query(
      `SELECT role
       FROM users
       WHERE board_id = ?
         AND username = ?`,
      [boardId, author]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "USER_NOT_FOUND"
      });
    }

    const user = users[0];

    // Informationia saa lisätä vain owner
    const ownerOnlyCategories = [
    "general information",
    "announcements"
];

if (
    ownerOnlyCategories.includes(category) &&
    user.role !== "owner"
) {
    return res.status(403).json({
        success: false,
        message: "ONLY_OWNER_INFORMATION"
    });
}

    // Lisää viesti
    await pool.query(
      `INSERT INTO boardMessages
      (id, board_id, author, time, text, type, category, topic,header)
      VALUES (UUID(), ?, ?, NOW(), ?, ?, ?, ?, ?)`,
      [
        boardId,
        author,
        message,
        type,
        category,
        topic,
        header
      ]
    );

    res.json({
      success: true,
      message: "TOPIC_CREATED"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "DATABASE_ERROR"
    });
  }
});

app.post("/topics", async (req,res)=>{

  const { boardName, category } = req.body;

  const [rows] = await pool.query(
    `
    SELECT DISTINCT topic
    FROM boardMessages
    WHERE board_id = (
      SELECT id FROM boards WHERE name = ?
    )
    AND category = ?
    AND topic IS NOT NULL
    `,
    [boardName, category]
  );

  res.json({
    topics: rows.map(r => r.topic)
  });
});

app.post("/topicCounts", async (req, res) => {

    const { boardName } = req.body;

    const sql = `
        SELECT category, COUNT(DISTINCT topic) AS count
        FROM boardMessages
        WHERE board_id = (
            SELECT id FROM boards WHERE name = ?
        )
        GROUP BY category
    `;

    try {

        const [result] = await pool.query(sql, [boardName]);

        res.json({
            success: true,
            counts: result
        });

    } catch (err) {

        console.log(err);

        res.json({
            success: false
        });
    }
});

app.get("/admin/boards", async (req, res) => {

    try {

        const [rows] = await pool.query(`
            SELECT
    b.id,
    b.name,

    u.username,
    u.email,

    (
        SELECT COUNT(*)
        FROM users
        WHERE board_id = b.id
    ) AS userCount

FROM boards b

LEFT JOIN users u
    ON b.id = u.board_id
   AND u.role = 'owner'

ORDER BY b.name
        `);

        res.json({
            success: true,
            boards: rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "DATABASE_ERROR"
        });
    }
});

app.post("/admin/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        const [rows] = await pool.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            return res.json({
                success: false,
                message: "ADMIN_LOGIN_FAILED"
            });
        }

        const user = rows[0];

        // Varmistetaan että käyttäjä on admin
        if (user.role !== "admin") {
            return res.json({
                success: false,
                message: "ADMIN_LOGIN_FAILED"
            });
        }

        const ok = await bcrypt.compare(password, user.password);

        if (!ok) {
            return res.json({
                success: false,
                message: "ADMIN_LOGIN_FAILED"
            });
        }

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "DATABASE_ERROR"
        });
    }
});

/*
function cleanup(board) {
  const days = board.autoDeleteDays ?? 10;
  const cutoff = Date.now() - days * 86400000;

  board.boardMessages =
    board.boardMessages.filter(m =>
      new Date(m.time).getTime() > cutoff
    );
}*/

async function cleanup(boardId, autoDeleteDays) {

    await pool.query(
        `
        DELETE FROM boardMessages
        WHERE board_id = ?
        AND category NOT IN ('general information', 'announcements')
        AND time < DATE_SUB(NOW(), INTERVAL ? DAY)
        `,
        [boardId, autoDeleteDays]
    );

}

app.post("/saunaSlots", async (req, res) => {

    try {

        const { boardName } = req.body;

        const user = await authUser(req, boardName);

        if (!user) {
            return res.status(401).json({
                success: false
            });
        }

        const [existing] = await pool.query(
            `SELECT COUNT(*) AS count
             FROM saunaSlots
             WHERE board_id = (
                 SELECT id
                 FROM boards
                 WHERE name = ?
             )`,
            [boardName]
        );

        const [slots] = await pool.query(
            `SELECT day, time, familyName
             FROM saunaSlots
             WHERE board_id = (
                 SELECT id
                 FROM boards
                 WHERE name = ?
             )
             ORDER BY day, time`,
            [boardName]
        );

        res.json({
            success: true,
            slots,
            needsCreation: existing[0].count === 0
        });

    } catch (err) {

        console.error("SAUNA SLOTS ERROR:", err);

        res.status(500).json({
            success: false
        });
    }
});

app.post("/createSaunaSlots", async (req, res) => {

    try {

        const { boardName } = req.body;

        const user = await authUser(req, boardName);

        if (!user || user.role !== "owner") {
            return res.status(403).json({
                success: false
            });
        }

        await pool.query(
            `INSERT INTO saunaSlots
                (board_id, day, time, familyName)
             SELECT
                (SELECT id FROM boards WHERE name = ?),
                day,
                time,
                NULL
             FROM defaultSaunaSlots`,
            [boardName]
        );

        console.log("DEFAULT SAUNA SLOTS COPIED");

        res.json({
            success: true
        });

    } catch (err) {

        console.error("CREATE SAUNA SLOTS ERROR:", err);

        res.status(500).json({
            success: false
        });
    }
});

app.post("/updateSaunaSlots", async (req, res) => {

    try {

        const { boardName, slots } = req.body;

        const token = req.headers.authorization;


        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Missing token"
            });
        }


        // Haetaan käyttäjä tokenilla
        const [users] = await pool.query(
            `
            SELECT id, board_id, role
            FROM users
            WHERE token = ?
            `,
            [token]
        );


        if (users.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });

        }


        const user = users[0];


        // Owner tarkistus
        if (user.role !== "owner") {

            return res.status(403).json({
                success: false,
                message: "ONLY_OWNER_EDIT"
            });

        }


        // Tarkistetaan board
        const [boards] = await pool.query(
            `
            SELECT id
            FROM boards
            WHERE name = ?
            `,
            [boardName]
        );


        if (boards.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Board not found"
            });

        }


        const boardId = boards[0].id;


        // Tarkistetaan että käyttäjä kuuluu tähän boardiin
        if (user.board_id !== boardId) {

            return res.status(403).json({
                success: false,
                message: "Wrong board"
            });

        }


        // Tarkistetaan data
        if (!slots || !Array.isArray(slots)) {

            return res.status(400).json({
                success: false,
                message: "Invalid sauna data"
            });

        }


        // Päivitetään sauna-ajat
        for (const slot of slots) {

            await pool.query(
                `
                UPDATE saunaSlots
                SET familyName = ?
                WHERE board_id = ?
                AND day = ?
                AND time = ?
                `,
                [
                    slot.familyName || null,
                    boardId,
                    slot.day,
                    slot.time
                ]
            );

        }


        res.json({
            success: true
        });


    } catch (err) {

        console.error("UPDATE SAUNA ERROR:", err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});

app.post("/createAutoSlots", async (req, res) => {

    const { boardName, count } = req.body;

    try {

        const user = await authUser(req, boardName);

        if (!user || user.role !== "owner") {
            return res.status(403).json({
                success:false,
                message:"ONLY_OWNER"
            });
        }


        const [boards] = await pool.query(
            "SELECT id FROM boards WHERE name = ?",
            [boardName]
        );


        if (boards.length === 0) {
            return res.json({
                success:false,
                message:"BOARD_NOT_FOUND"
            });
        }


        const boardId = boards[0].id;

        const [existing] = await pool.query(
    "SELECT COUNT(*) AS count FROM autoSlots WHERE board_id = ?",
    [boardId]
);

if (existing[0].count > 0) {
    return res.json({
        success:false,
        message:"ALREADY_CREATED"
    });
}


        for (let i = 1; i <= count; i++) {

            await pool.query(
                `INSERT INTO autoSlots
                 (board_id, slot_name, info)
                 VALUES (?, ?, NULL)`,
                [
                    boardId,
                    String(i)
                ]
            );

        }


        res.json({
            success:true
        });


    } catch(err) {

        console.error(err);

        res.status(500).json({
            success:false,
            message:"DATABASE_ERROR"
        });

    }

});

app.get("/autoSlots/:boardName", async (req, res) => {

    const { boardName } = req.params;

    try {

        const [boards] = await pool.query(
            "SELECT id FROM boards WHERE name = ?",
            [boardName]
        );

        if (boards.length === 0) {
            return res.json({
                success:false,
                message:"BOARD_NOT_FOUND"
            });
        }

        const boardId = boards[0].id;

        const [slots] = await pool.query(
            `SELECT id, slot_name, info
             FROM autoSlots
             WHERE board_id = ?
             ORDER BY id`,
            [boardId]
        );

        res.json({
            success:true,
            slots
        });

    } catch(err) {

        console.error(err);

        res.status(500).json({
            success:false
        });

    }
});

app.put("/autoSlots", async (req, res) => {

    const slots = req.body;

    try {

        for (const slot of slots) {

            await pool.query(
                `
                UPDATE autoSlots
                SET slot_name = ?, info = ?
                WHERE id = ?
                `,
                [
                    slot.slot_name,
                    slot.info,
                    slot.id
                ]
            );

        }

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});

app.listen(3000, () => {
  console.log("Serveri käynnissä portissa 3000");
});