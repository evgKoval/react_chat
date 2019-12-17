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
};
