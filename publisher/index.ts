import amqp from "amqplib";

async function start() {
  const server = "amqp://admin:123456@localhost:5672";

  const options = {
    hostname: "localhost",
    port: 5672,
    username: "admin",
    password: "123456",
  };
  let connection: amqp.Connection;
  let channel: amqp.Channel;
  connection = await amqp.connect(server, function (error0, connection) {
    if (error0) {
      throw error0;
    }
  });

  try {
    channel = await connection.createChannel();
  } catch (e) {
    console.log(e);
    console.log("Erro criando channel");
  }

  var queue = "hello";
  var msg = "Hello world";

  channel.assertQueue(queue, {
    durable: false,
  });

  try {
    channel.sendToQueue(queue, Buffer.from(msg));

    console.log(" [x] Sent %s", msg);
  } catch (e) {
    console.log(e);
    console.log("Erro enviando msg pra fila");
  }

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 10000);
}

start();
