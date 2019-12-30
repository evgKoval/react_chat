const https = require("https");
const fs = require("fs");
const express = require("express");
const env = require("env2")(__dirname + "/.env");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes");
const fileUpload = require("express-fileupload");
const app = express();
const server = require("http").Server(app);
// const server = https.createServer(
//   {
//     key: fs.readFileSync("/etc/letsencrypt/live/reactchats.com/privkey.pem"),
//     cert: fs.readFileSync("/etc/letsencrypt/live/reactchats.com/cert.pem"),
//     ca: fs.readFileSync("/etc/letsencrypt/live/reactchats.com/chain.pem"),
//     requestCert: false,
//     rejectUnauthorized: false
//   },
//   app
// );
const io = require("socket.io")(server);
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors());
app.use("/", router);

const PORT = process.env.PORT || 5000;

const pool = require("./queries");

io.on("connection", socket => {
  socket.on("leave chat", ({ chatId }) => {
    socket.leave(chatId);
  });

  let access = false;

  socket.on("get access", ({ chatId, userId }) => {
    pool.query(
      "SELECT * FROM chat_users WHERE chat_id = $1 AND user_id = $2",
      [chatId, userId],
      (error, results) => {
        if (error) {
          throw error;
        }

        if (results.rows.length == 0) {
          socket.emit("get access", false);
        } else {
          socket.emit("get access", true);
        }
      }
    );
  });

  socket.on("get messages", ({ userId, chatId }) => {
    socket.join(chatId);

    pool.query(
      "SELECT m.id, m.created_at, m.text, m.edited, m.type, u.email, u.name, u.avatar, CASE WHEN m.user_id = $1 THEN 'true' ELSE 'false' END AS own FROM messages m LEFT JOIN users u ON m.user_id = u.id WHERE m.chat_id = $2 ORDER BY m.created_at",
      [userId, chatId],
      (error, results) => {
        if (error) {
          throw error;
        }

        socket.emit("get messages", results.rows);
      }
    );
  });

  socket.on("chat message", ({ userId, chatId, text }) => {
    pool.query(
      "INSERT INTO messages (chat_id, user_id, text) VALUES ($1, $2, $3) RETURNING *",
      [chatId, userId, text],
      (error, results) => {
        if (error) {
          throw error;
        }

        pool.query(
          "SELECT m.id, m.created_at, m.text, m.edited, m.type, m.chat_id, u.email, u.name, u.avatar, 'false' AS own FROM messages m LEFT JOIN users u ON m.user_id = u.id WHERE m.id = $1",
          [results.rows[0].id],
          (error, results) => {
            if (error) {
              throw error;
            }

            socket.broadcast.to(chatId).emit("chat message", results.rows[0]);
          }
        );
      }
    );
  });

  socket.on("edit message", ({ text, messageId, chatId }) => {
    pool.query(
      "UPDATE messages SET text = $1, edited = true WHERE id = $2 RETURNING *",
      [text, messageId],
      (error, results) => {
        if (error) {
          throw error;
        }

        pool.query(
          "SELECT m.id, m.created_at, m.text, m.edited, m.type, u.email, u.name, u.avatar, 'false' AS own FROM messages m LEFT JOIN users u ON m.user_id = u.id WHERE m.id = $1",
          [results.rows[0].id],
          (error, results) => {
            if (error) {
              throw error;
            }

            socket.broadcast.to(chatId).emit("edit message", results.rows[0]);
          }
        );
      }
    );
  });

  socket.on("delete message", ({ messageId, chatId }) => {
    pool.query(
      "DELETE FROM messages WHERE id = $1 RETURNING *",
      [messageId],
      (error, results) => {
        if (error) {
          throw error;
        }

        // socket.broadcast.to(chatId).emit("delete message", results.rows[0].id);
        io.sockets.in(chatId).emit("delete message", results.rows[0].id);
      }
    );
  });

  socket.on("chat file", ({ file, fileType, fileName, userId, chatId }, cb) => {
    const base64data = Buffer.from(file, "binary");

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: "messages/" + fileName,
      Body: base64data,
      ACL: "public-read"
    };

    s3.upload(params, function(err, data) {
      if (err) {
        throw err;
      }

      console.log(`File uploaded successfully. ${data.Location}`);
      cb();
    });

    pool.query(
      "INSERT INTO messages (chat_id, user_id, text, type) VALUES ($1, $2, $3, $4) RETURNING *",
      [chatId, userId, fileName, fileType],
      (error, results) => {
        if (error) {
          throw error;
        }

        pool.query(
          "SELECT m.id, m.created_at, m.text, m.edited, m.type, u.email, u.name, u.avatar, 'false' AS own FROM messages m LEFT JOIN users u ON m.user_id = u.id WHERE m.id = $1",
          [results.rows[0].id],
          (error, results) => {
            if (error) {
              throw error;
            }

            socket.broadcast.to(chatId).emit("chat message", results.rows[0]);
          }
        );
      }
    );
  });
});

server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));
