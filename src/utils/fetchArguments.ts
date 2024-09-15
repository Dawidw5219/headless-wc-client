export function getFetchArguments() {
  return {
    cache: process.env.NODE_ENV === "development" || !process.env.NODE_ENV ? "no-store" : "default",
  };
}
