import { init, ContentFieldExtension } from "dc-extensions-sdk";
import { broadcastValue } from "./broadcastValue";

describe("broadcastValue", () => {
  it("Should broadcast message", async () => {
    const sdk = await init<ContentFieldExtension>();
    const channel = new BroadcastChannel("SEO");

    jest.spyOn(channel, "postMessage");

    broadcastValue(channel, sdk, "test value");

    expect(channel.postMessage).toHaveBeenCalledWith({
      type: "description",
      sources: ["/content"],
      value: "test value",
    });
  });
});
