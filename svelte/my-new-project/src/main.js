import App from "./App.html";

const app = new App({
  target: document.body,
  data: {
    name: "world",
    promise: delay(400, "this app will self-destruct")
  }
});

function delay(ms, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

setTimeout(() => {
  app.set({ name: "bobbles" });
}, 1000);

setTimeout(() => {
  app.destroy();
}, 2000);

app.on("state", ({ changed, current, previous }) => {
  console.log("state", { changed, current, previous });
});

app.on("update", ({ changed, current, previous }) => {
  console.log("update", { changed, current, previous });
});

export default app;
