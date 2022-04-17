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

  var queue = "task_queue";

  // This makes sure the queue is declared before attempting to consume from it
  channel.assertQueue(queue, {
    durable: true,
  });

  channel.consume(
    queue,
    function (msg) {
      var secs = msg.content.toString().split(".").length - 1;

      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function () {
        console.log(" [x] Done");
        channel.ack(msg);
      }, secs * 1000);
    },
    {
      // automatic acknowledgment mode,
      // see ../confirms.html for details
      noAck: false,
    }
  );

  process.on("SIGINT", async () => {
    await connection.close();

    process.exit(0);
  });
}

start();
