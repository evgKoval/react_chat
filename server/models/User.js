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

  // static checkEmail(email) {
  //   return new Promise((res, rej) => {
  //     pool.query(
  //       "SELECT COUNT(email) FROM users WHERE email = $1",
  //       [email],
  //       (error, results) => {
  //         if (error) {
  //           rej(error);
  //         }
  //         res(results.rows[0].count);
  //       }
  //     );
  //   });
  // }

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

  static getUserById(id) {
    return new Promise((res, rej) => {
      pool.query(
        "SELECT * FROM users WHERE id = $1",
        [id[0]],
        (error, results) => {
          if (error) {
            rej(error);
          }
          console.log(results);
          res(results.rows);
        }
      );
    });
  }
};
