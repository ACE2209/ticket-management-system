/* eslint-disable @typescript-eslint/no-require-imports */
const Ably = require("ably");

async function publishMessage() {
  // Kết nối tới Ably
  const ably = new Ably.Realtime("0nbAoQ.jOV2aQ:FJ0fW6HwEep4PYs89qbPUCwKOVr5J8I-a_bN6nniiW8");

  ably.connection.once("connected", async () => {
    console.log("✅ Connected to Ably!");

    // Gửi thông báo mới lên kênh 'get-started'
    const channel = ably.channels.get("get-started");
    await channel.publish("first", "test cai nua ne");

    console.log("📤 Message sent!");
    ably.connection.close();
  });
}

publishMessage();
