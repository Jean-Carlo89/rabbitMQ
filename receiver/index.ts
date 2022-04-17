import amqp, { connect } from "amqplib";
import { channel } from "diagnostics_channel";

async function start() {
  //** conect

  const options = {
    hostname: "localhost",
    port: 5672,
    username: "admin",
    password: "123456",
  };

  let connection: amqp.Connection;
  let channel: amqp.Channel;

  connection = await amqp.connect(options);

  channel = await connection.createChannel();

  const queue = "hello";

  channel.assertQueue(queue, {
    durable: false,
  });

  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

  channel.consume(
    queue,
    (msg) => {
      console.log(" [x] Received %s", msg.content.toString());
    },
    {
      noAck: true,
    }
  );

  process.on("SIGINT", () => {
    connection.close();

    process.exit(0);
  });
}

start();
