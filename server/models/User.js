const pool = require("../queries");

module.exports = class User {
  static register(name, email, password) {
    return new Promise((res, rej) => {
      pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, password],
        (error, results) => {
          if (error) {
            rej(error);
          }
          res(results);
        }
      );
    });
  }

  static login(email, password) {
    return new Promise((res, rej) => {
      pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email],
        (error, results) => {
          if (error) {
            rej(error);
          }

          res(results.rows[0]);
        }
      );
    });
  }

  static getAll() {
    return new Promise((res, rej) => {
      pool.query("SELECT id, name, avatar FROM users", (error, results) => {
        if (error) {
          rej(error);
        }

        res(results.rows);
      });
    });
  }

  static getById(id) {
    return new Promise((res, rej) => {
      pool.query(
        "SELECT id, name, email, avatar FROM users WHERE id = $1",
        [id],
        (error, results) => {
          if (error) {
            rej(error);
          }

          res(results.rows[0]);
        }
      );
    });
  }

  static update(userId, name, email, avatar) {
    return new Promise((res, rej) => {
      pool.query(
        "UPDATE users SET name = $1, email = $2, avatar = $3 WHERE id = $4",
        [name, email, avatar, userId],
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
