// Lets you FORCE the slow, empty and error states in front of the room.
// Off unless DEMO_STATES=true is set on the server, so it does nothing on a real deployment.
//   ?demo=slow   waits 2.5 s, so the skeleton (loading.js) shows
//   ?demo=error  throws, so the error boundary (error.js) shows
//   ?demo=empty  pretends there is nothing to show
export async function demoState(value) {
  if (process.env.DEMO_STATES !== "true") return null;
  if (value === "slow") await new Promise((resolve) => setTimeout(resolve, 2500));
  if (value === "error") throw new Error("Demo error: forced so the error state can be shown");
  return value === "empty" ? "empty" : null;
}
