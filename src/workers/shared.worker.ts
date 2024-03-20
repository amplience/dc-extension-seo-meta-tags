const sw = self as unknown as SharedWorkerGlobalScope;

const ports: MessagePort[] = [];

sw.onconnect = (event) => {
  const [port] = event.ports;
  ports.push(port);

  port.addEventListener("message", ({ data }: { data: WorkerMessage }) => {
    console.log("hello");
    ports.forEach((port) => port.postMessage(data));
  });

  port.start();
};
