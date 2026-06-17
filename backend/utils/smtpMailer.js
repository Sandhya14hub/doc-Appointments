const tls = require("tls");

function getMailConfig() {
  const host =
    process.env.MAIL_HOST ||
    process.env.EMAIL_HOST;

  const port = Number(
    process.env.MAIL_PORT ||
      process.env.EMAIL_PORT
  );

  const user =
    process.env.MAIL_USER ||
    process.env.EMAIL_USER ||
    process.env.MAIL_FROM;

  const password =
    process.env.MAIL_APP_PASSWORD ||
    process.env.MAIL_SECURITY_KEY ||
    process.env.MAIL_PASSWORD ||
    process.env.MAIL_PASS ||
    process.env.EMAIL_PASSWORD;

  const fromName =
    process.env.MAIL_FROM_NAME ||
    process.env.EMAIL_FROM_NAME;

  if (!host || !port || !user || !password || !fromName) {
    throw new Error(
      "Mail settings are not configured. Set MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_APP_PASSWORD, and MAIL_FROM_NAME in backend/.env."
    );
  }

  return {
    fromName,
    host,
    password,
    port,
    user,
  };
}

function escapeBody(text) {
  return String(text)
    .replace(/\r?\n/g, "\r\n")
    .replace(/^\./gm, "..");
}

function buildMessage({
  fromName,
  fromEmail,
  subject,
  text,
  to,
}) {
  return [
    `From: ${fromName} <${fromEmail}>`,
    `To: <${to}>`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    escapeBody(text),
    "",
  ].join("\r\n");
}

function createResponseReader(socket) {
  let buffer = "";
  let currentLines = [];
  let failure = null;
  const responseQueue = [];
  const waiters = [];

  function flushResponse(response) {
    if (waiters.length > 0) {
      const { resolve } = waiters.shift();
      resolve(response);
      return;
    }

    responseQueue.push(response);
  }

  socket.on("data", (chunk) => {
    buffer += chunk.toString("utf8");

    let lineBreakIndex = buffer.indexOf("\r\n");

    while (lineBreakIndex !== -1) {
      const line = buffer.slice(0, lineBreakIndex);
      buffer = buffer.slice(lineBreakIndex + 2);

      if (line) {
        currentLines.push(line);
      }

      if (/^\d{3} /.test(line)) {
        flushResponse(currentLines.join("\n"));
        currentLines = [];
      }

      lineBreakIndex = buffer.indexOf("\r\n");
    }
  });

  socket.on("error", (error) => {
    failure = error;

    while (waiters.length > 0) {
      const { reject } = waiters.shift();
      reject(error);
    }
  });

  socket.on("close", () => {
    if (!failure) {
      failure = new Error("SMTP connection closed unexpectedly");
    }

    while (waiters.length > 0) {
      const { reject } = waiters.shift();
      reject(failure);
    }
  });

  return {
    read() {
      if (failure) {
        return Promise.reject(failure);
      }

      if (responseQueue.length > 0) {
        return Promise.resolve(responseQueue.shift());
      }

      return new Promise((resolve, reject) => {
        waiters.push({
          reject,
          resolve,
        });
      });
    },
  };
}

function getStatusCode(response) {
  const firstLine = String(response).split(/\r?\n/)[0] || "";
  return firstLine.slice(0, 3);
}

async function sendCommand(socket, reader, command, expectedCodes) {
  socket.write(`${command}\r\n`);

  const response = await reader.read();
  const statusCode = getStatusCode(response);

  if (!expectedCodes.includes(statusCode)) {
    throw new Error(
      `SMTP command failed (${command}): ${response}`
    );
  }

  return response;
}

async function sendMail({
  subject,
  text,
  to,
}) {
  const {
    fromName,
    host,
    password,
    port,
    user,
  } = getMailConfig();

  const socket = tls.connect({
    host,
    port,
    servername: host,
  });
  const reader = createResponseReader(socket);

  socket.setTimeout(30000, () => {
    socket.destroy(new Error("SMTP connection timed out"));
  });

  await new Promise((resolve, reject) => {
    socket.once("secureConnect", resolve);
    socket.once("error", reject);
  });

  const greeting = await reader.read();

  if (getStatusCode(greeting) !== "220") {
    throw new Error(`SMTP greeting failed: ${greeting}`);
  }

  await sendCommand(socket, reader, "EHLO localhost", ["250"]);
  await sendCommand(socket, reader, "AUTH LOGIN", ["334"]);
  await sendCommand(
    socket,
    reader,
    Buffer.from(user).toString("base64"),
    ["334"]
  );
  await sendCommand(
    socket,
    reader,
    Buffer.from(password).toString("base64"),
    ["235"]
  );
  await sendCommand(
    socket,
    reader,
    `MAIL FROM:<${user}>`,
    ["250"]
  );
  await sendCommand(
    socket,
    reader,
    `RCPT TO:<${to}>`,
    ["250", "251"]
  );
  await sendCommand(socket, reader, "DATA", ["354"]);

  const message = buildMessage({
    fromEmail: user,
    fromName,
    subject,
    text,
    to,
  });

  socket.write(`${message}\r\n.\r\n`);

  const dataResponse = await reader.read();

  if (getStatusCode(dataResponse) !== "250") {
    throw new Error(`SMTP data rejected: ${dataResponse}`);
  }

  await sendCommand(socket, reader, "QUIT", ["221"]);

  socket.end();
}

module.exports = {
  sendMail,
};
