const pool = require("../queries");

module.exports = class Chat {
  static getAll() {
    return new Promise((res, rej) => {
      pool.query("SELECT * FROM chats", (error, results) => {
        if (error) {
          rej(error);
        }

        res(results.rows);
      });
    });
  }

  static store(name, createdBy) {
    return new Promise((res, rej) => {
      pool.query(
        "INSERT INTO chats (name, created_by) VALUES ($1, $2) RETURNING *",
        [name, createdBy],
        (error, results) => {
          if (error) {
            rej(error);
          }

          res(results.rows[0]);
        }
      );
    });
  }

  static storeUser(chatId, usersId) {
    return new Promise((res, rej) => {
      pool.query(
        "INSERT INTO chat_users (chat_id, user_id) VALUES ($1, $2)",
        [chatId, usersId],
        (error, results) => {
          if (error) {
            rej(error);
          }

          res(results);
        }
      );
    });
  }

  static getMessages(chatId, userId) {
    return new Promise((res, rej) => {
      pool.query(
        "SELECT m.id, m.created_at, m.text, m.edited, m.type, u.email, u.name, u.avatar, CASE WHEN m.user_id = $1 THEN 'true' ELSE 'false' END AS own FROM messages m LEFT JOIN users u ON m.user_id = u.id WHERE m.chat_id = $2 ORDER BY m.created_at",
        [userId, chatId],
        (error, results) => {
          if (error) {
            rej(error);
          }

          res(results.rows);
        }
      );
    });
  }

  static sendText(chatId, userId, text) {
    return new Promise((res, rej) => {
      pool.query(
        "INSERT INTO messages (chat_id, user_id, text) VALUES ($1, $2, $3)",
        [chatId, userId, text],
        (error, results) => {
          if (error) {
            rej(error);
          }

          res(results);
        }
      );
    });
  }
};
