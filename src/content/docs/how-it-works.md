---
title: How it works
description: AI writes the test once. Every run after that replays the saved steps, without AI.
---

Testpilot splits testing into two moments: **writing** a test, where an AI agent helps, and **running** it, where no AI is involved at all.

## 1. Describe

You tell the agent what to check, in plain words, the way you would tell a colleague:

> Sign in with `{{username}}` and `{{password}}`, open Reports and check the total.

`{{username}}` and `{{password}}` are variables from your environment. The AI only ever sees their names; the values are filled in when the browser types them.

## 2. Fly

The agent drives a real browser. Every action it takes becomes a **step**: what to do, which element, what to expect, with a screenshot. You watch, correct the agent in the chat, and save.

A step is structured data, not generated code. That is what makes the next part possible.

## 3. Autopilot

From then on, a run replays the saved steps on a browser worker: in the cloud, or on your own machine with Testpilot Desktop. No AI is called, so a run:

- **costs nothing** in AI usage,
- **gives the same answer every time**, and
- **runs in parallel**, as many tests at once as you have worker slots.

## When the page changes

If a step's element can no longer be found, the run fails at that step and the agent proposes a fix under **Fixes to review**. Nothing is saved until you choose **Use new locator** or **Keep as failed**.

## Where to next

- [Getting started](../getting-started/): run Testpilot on your own machine.
- [Using Testpilot](../using-testpilot/): write a test with AI and run many at once.
- [Test machine setup](../test-machine-setup/): prepare a Windows machine for Testpilot Desktop.
