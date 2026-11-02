---
title: Test machine setup
description: Prepare a Windows PC or VM so Testpilot Desktop can run tests on it.
---

A test machine is a Windows PC (or VM) where Testpilot Desktop runs tests on your behalf. Testpilot drives real windows on that machine, so it must stay awake, unlocked and signed in. This page walks through the setup. Testpilot Desktop checks most of these items for you and links back here when one is not met.

## Install

1. Download the zip from the "Get Testpilot Desktop" link in the admin console (Test machines).
2. Unzip it anywhere you like, for example `C:\Testpilot`.
3. Run `Testpilot.Desktop.exe`.
4. In the admin console open Test machines, choose Add machine, and enter the pairing code shown there (for example `K7Q-48M`). A code works once and expires after 10 minutes.

The machine appears as Online as soon as pairing succeeds.

## Connected is not the same as ready

A paired machine always connects, even if some checks below are not met yet. The checks screen in Testpilot Desktop never blocks you: required items that still fail stay listed with their Fix buttons under a warning, and you can continue.

The machine runs tests only while it is ready:

- its screen is unlocked right now (a locked screen, or a disconnected remote session, counts as locked), and
- the required items are OK: Windows UI Automation available, sleep disabled, and screen lock off, and
- "Accept new sessions" is on in Testpilot Desktop's Settings.

Admin › Test machines shows where each machine stands:

- Online · Ready: testers can run tests on it.
- Online · Screen locked: connected, but the screen is locked. It runs no tests until someone unlocks it.
- Online · Not ready: connected, but a required item is not OK. The machine's details list which ones.
- Paused: connected, but "Accept new sessions" is off on the machine.
- Offline: not connected.

If more than one applies, the first in this order is shown: Offline, Paused, Not ready, Screen locked. Testpilot Desktop reports a lock or unlock at once, so the status changes within seconds.

## Keep the user signed in

Tests drive an interactive desktop session. If the Windows user signs out, or the machine restarts and waits at the sign-in screen, Testpilot cannot open or control any window. Use a dedicated Windows user for testing and keep it signed in.

## Auto sign-in

After a restart the machine should sign in on its own and start Testpilot Desktop without anyone present.

Pick one of the two ways:

- `netplwiz`: press Win+R, run `netplwiz`, untick "Users must enter a user name and password to use this computer", then enter the password. On newer Windows 11 builds you may first need to turn off "Require Windows Hello sign-in for Microsoft accounts" in Settings, Accounts, Sign-in options.
- Sysinternals Autologon: download it from Microsoft, run `Autologon.exe`, enter the user, domain and password, and choose Enable. It keeps the password as an LSA secret.

Security trade-off: anyone who can power on the machine gets a signed-in desktop. Both methods store the password on the machine as an LSA secret, and a local administrator or SYSTEM can recover it, so Autologon is not safer than `netplwiz` in that respect. The real protection is the account: use a dedicated, low-privilege test account that has no access to production data or other systems, never an admin or personal account, and keep the machine physically or network secured (for example a locked room or a private VM).

## Disable sleep and the screen lock

A sleeping machine drops its connection, and a locked screen blocks UI automation: while the screen is locked the machine stays connected but runs no tests.

- Sleep: Settings, System, Power, set "Screen and sleep" to Never. Testpilot Desktop's health check can apply this fix for you.
- Screen lock: turn off "Require sign-in" after sleep (Settings, Accounts, Sign-in options), turn off the lock-screen screen saver, and make sure no policy locks the screen after inactivity. The app can fix this one too.

## Resolution, window size and scaling

- Use a fixed screen resolution, for example 1920x1080, and do not change it between runs.
- Apps tested by the Visual driver (screenshots and OCR instead of the accessibility tree) depend on layout, so also keep their window size and position fixed.
- Set display scaling to 100% (Settings, System, Display, Scale). Other values work for most apps, but 100% gives the most repeatable coordinates and screenshots. Testpilot Desktop shows a warning, not an error, when scaling is not 100%.

## Web tests on this machine

A paired machine can also run web tests in a visible browser. Members choose the machine in **Run on**; nothing else is installed on it.

- **Microsoft Edge** must be installed. It is standard on Windows 10 and 11. Testpilot Desktop carries its own copy of the worker and does not download a browser.
- In Testpilot Desktop, Settings has **Run web tests on this machine**. It is on by default. Turn it off if the machine should only run desktop tests.
- While a web test runs, an Edge window opens and the Desktop main screen says **Running a web test**. The window is real, so please don't use the mouse or keyboard on the machine until it finishes.
- A locked screen means no tests run. The machine shows as Screen locked and is disabled in **Run on**. Follow "Disable sleep and the screen lock" and "Auto sign-in" so it stays ready.
- The machine runs one web test at a time. While it runs one, it shows as **Busy** in **Run on** and nobody else can choose it. If two people choose it at the same moment, the second sees "That machine is running another test. Choose another or try again later."
- To use it, open a test in the editor (Test setup) or the **Run tests** dialog in the Repository, and choose the machine in **Run on**. The list shows only machines that are paired, that you may use, and whose Desktop runs web tests. A machine that is not ready appears disabled with its reason. The dialog then says "Web tests run in a browser on <machine name>."
- In the editor, switching **Run on** keeps your current browser until the new one is open. If the machine cannot take the test, you stay where you were and Test setup says why.
- Don't close the Edge window by hand. The test that owns it stops. To stop web tests from the machine, turn off **Run web tests on this machine** or pause new sessions.

### Check that it works

- In the admin console, Test machines shows **Runs web tests: Yes** for the machine.
- In Testpilot Desktop, Health shows Browser as ready for web tests.
- Browser **fail** means Edge or the bundled worker is missing or did not start. Install or repair Edge, then turn **Run web tests on this machine** off and on again to retry.

## Network and firewall

Testpilot Desktop only makes outbound connections to your Testpilot server, over HTTPS and secure WebSocket (`wss://`) on port 443. No inbound port is needed. If the machine sits behind a firewall or proxy, allow outbound TCP 443 to the server host and allow WebSocket upgrades.

## Start with Windows

Testpilot Desktop registers itself to start when the test user signs in (Settings, "Start with Windows", on by default). It does this when setup finishes and checks it again on every launch, so moving the app to a new folder is picked up the next time you start it. Together with auto sign-in, the machine then comes back Online by itself after a restart. If Windows refuses the change, Settings shows a note under the toggle.

Fallback, only if your organisation blocks the per-user Run key: put a shortcut to `Testpilot.Desktop.exe` in the Startup folder (Win+R, `shell:startup`) of the test user and turn "Start with Windows" off, so it does not start twice.

## Updating

There is no auto-update yet. To update, close Testpilot Desktop, download the new zip, and replace the old files. The machine stays paired. Settings shows the installed version.

## Unpairing

- On the web: open Test machines in the admin console and remove the machine. This takes effect immediately; the Desktop shows "Removed" and stops reconnecting.
- In the Desktop: Unpair only forgets the pairing on this machine. The machine entry remains on the server until an admin removes it there.
