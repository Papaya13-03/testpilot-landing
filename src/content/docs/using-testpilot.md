---
title: Using Testpilot
description: Write a test with the AI agent, run many tests at once, and review fixes.
---

## Write a test with AI

1. **My environments**: create an environment and set its Web URL (the site you want to test). Add variables for logins; the AI only sees their names, never their values. Every environment also has a built-in `{{base_url}}`, its Web URL: the agent opens pages as `{{base_url}}/login`, so a test runs against whichever environment you pick. A variable you name `base_url` yourself takes precedence over the built-in one.
2. **Repository**: create a Web test, select it, and choose **Build with AI**. Pick the environment, then tell the agent what to do, for example "Sign in with `{{username}}` and `{{password}}`, then open Reports".
3. Each action becomes a step with a screenshot. When it looks right, use **Run from start**. Runs replay the saved steps without AI.

:::tip[Secrets]
A variable marked secret is never sent to the AI, logged or shown. A screenshot taken after typing may still show a value if the page itself displays it (password fields are masked).
:::

## Browser options

In the editor, open **Browser options** (under Environment):

- **Device**: Desktop Chrome, Desktop Safari, Pixel 7, iPhone 14 or iPad Mini.
- **Service workers**: Allow (default) or Block.
- **Start offline**: the browser starts without a network.
- **Permissions**: geolocation, notifications, camera and so on, granted before the page loads.

Changing an option restarts the session. While you chat, the agent can also go offline or online, change device, grant permissions, clear storage, reload, and check that a service worker is running.

## Run many tests

1. In the Repository, tick the tests to run (or run them all) and press **Run N selected** (or **Run all**).
2. In the **Run tests** dialog, pick one of your environments and press **Run N tests**. Only automated web tests run; the others are skipped with a reason.
3. You land on **Runs**, with live progress (Passed, Failed, Running, Queued). Open any row to see each step and its screenshot; a failed row also shows the error. Screenshots are kept for 30 days.
4. **Stop run** ends a running run. **Re-run failed** starts a new run with only the tests that failed (and the stopped ones, when there are any).

Runs share worker slots with AI editor sessions, and the project's **max parallel** limit counts both. A run uses as many lanes as there are runnable tests, free worker slots and free project slots.

- **More lanes**: with the default max parallel of 2, a run of 50 tests runs 2 at a time. An admin raises **Max parallel** in **Admin › Projects** and registers enough worker slots for it.
- **Open editor tabs hold slots**: each AI editor tab you keep open holds one slot until you close it, so close editor tabs before a big run.
- **Stopped** means a test got no result: someone pressed Stop, the worker stopped responding, the server restarted, or no browser slot was free. Re-run them with **Re-run failed and stopped**.

## Review fixes

When a step's element can no longer be found, the AI proposes a new locator under **Fixes to review**. Press **Use new locator** to save it, or **Keep as failed** to leave the test as it is. Nothing is saved without your choice.

## Run on your own machine

To watch a test in a real Edge window on a paired Windows machine, pick the machine in **Run on** (the editor's Test setup, or the **Run tests** dialog). The machine must be Ready: not locked and not paused. See [Test machine setup](../test-machine-setup/#web-tests-on-this-machine).

## Run a worker on another machine

Use this when tests need a different network or a more powerful machine.

On the worker machine, with Docker:

```sh
docker build -f apps/worker/Dockerfile -t testpilot-worker .
docker run --rm -p 4100:4100 -e WORKER_TOKEN=<same token as the web app> -e WORKER_SLOTS=3 testpilot-worker
```

Or with Node and pnpm, from a clone of the repository:

```sh
pnpm install
pnpm --filter worker exec playwright install chromium
pnpm --filter worker build
WORKER_TOKEN=<same token as the web app> WORKER_HOST=0.0.0.0 WORKER_SLOTS=3 pnpm --filter worker start
```

Then:

1. `WORKER_TOKEN` must be exactly the same value on the web app and the worker (24 characters or more).
2. Open port 4100 on the worker machine's firewall, for the web app's address only. The worker has no HTTPS, so use a private network or VPN and never expose it to the internet.
3. In the admin console, **Workers › Register worker**: a name, the base URL (`http://<worker-ip>:4100`) and the slots.
4. The Workers page shows the worker as Online within about 15 seconds.

Each open editor session, Run from start, and lane of a batch run uses one slot. If every slot is busy, people see "No worker available. Please contact your admin."
