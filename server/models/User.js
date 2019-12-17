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

  static getUserById(id) {
    return new Promise((res, rej) => {
      pool.query(
        "SELECT * FROM users WHERE id = $1",
        [id[0]],
        (error, results) => {
          if (error) {
            rej(error);
          }

          res(results.rows);
        }
      );
    });
  }
};
