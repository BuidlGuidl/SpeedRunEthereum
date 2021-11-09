// ⏳ We'll assume the connection is not available if we can't poll within that timeout
const PROVIDER_START_CONNECTION_TIMEOUT_MS = 4000;

export const providerPromiseWrapper = provider =>
  new Promise((resolve, reject) => {
    const connectionFailTimeout = setTimeout(() => {
      reject(new Error(`couldn't connect using the provider`));
    }, PROVIDER_START_CONNECTION_TIMEOUT_MS);

    provider.on("poll", () => {
      provider.off("poll");
      clearTimeout(connectionFailTimeout);
      resolve(provider);
    });
  });
