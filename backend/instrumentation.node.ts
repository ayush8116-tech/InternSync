if (process.env.NODE_ENV === "development") {
  process.on("uncaughtException", (err: NodeJS.ErrnoException) => {
    if (err.code === "ECONNRESET" || err.message === "aborted") return;
    throw err;
  });
}
