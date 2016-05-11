# Tomatimer
A loose and straightforward [pomodoro timer](https://en.wikipedia.org/wiki/Pomodoro_Technique) for Atom.

[![apm version](https://img.shields.io/apm/v/tomatimer.svg)](https://atom.io/packages/tomatimer)
[![build status](https://travis-ci.org/Yu1989/atom-tomatimer.svg?branch=master)](https://travis-ci.org/Yu1989/atom-tomatimer)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Install
`$ apm install tomatimer`

## Usage
- Commands in *Command Palette*:
  - `Tomatimer: Start` Start Tomatimer.
  - `Tomatimer: Stop` Stop Tomatimer.
  - `Tomatimer: Reset` Restart current session.
  - `Tomatimer: Pause Or Resume` Pause or resume current session.
    - Once you start typing in Atom, Tomatimer will resume automatically if it has been paused.
- Once started, look for a timer on status bar, that consists of an hourglass icon and a time.
  - Click icon to view your Tomatimer historical stats.
  - Click time to pause/resume current session.
  - Timer counts 25 minutes before a dialog freezes Atom and reminds you to take a break.
- Whenever you feel ready (a 5-minute break is recommended), click *Back to work* to start a new session.

## Keyboard Shortcuts
- <kbd>ctrl-alt-t</kbd> `Tomatimer: Start`
- <kbd>ctrl-alt-s</kbd> `Tomatimer: Stop`
- <kbd>ctrl-alt-r</kbd> `Tomatimer: Reset`
- <kbd>ctrl-alt-p</kbd> `Tomatimer: Pause Or Resume`

## Screenshots
Timer on status bar

![Timer](https://github.com/Yu1989/atom-tomatimer/blob/master/screenshots/timer.png?raw=true)

*Take a break* dialog

![Dialog](https://github.com/Yu1989/atom-tomatimer/blob/master/screenshots/dialog.png?raw=true)

Usage stats

![Stats](https://github.com/Yu1989/atom-tomatimer/blob/master/screenshots/stats.png?raw=true)

## Todo
- More tests
- Currently, statistics are stored separately for each project (Atom default behavior). Utilize local storage or write to file to make it truly global.
