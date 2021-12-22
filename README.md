# Tomatimer (not maintained any more)
[![apm version](https://img.shields.io/apm/v/tomatimer.svg?style=flat-square)](https://atom.io/packages/tomatimer)
[![build status](https://img.shields.io/travis/Yu1989/atom-tomatimer/master.svg?style=flat-square)](https://travis-ci.org/Yu1989/atom-tomatimer)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

A loose and straightforward [pomodoro timer](https://en.wikipedia.org/wiki/Pomodoro_Technique) (also known as tomato timer) for [Atom](https://atom.io).


## Install
```
$ apm install tomatimer
```

## Usage
- Commands in *Command Palette*:
  - `Tomatimer: Start` Start Tomatimer.
  - `Tomatimer: Stop` Stop Tomatimer.
  - `Tomatimer: Reset` Restart current session.
  - `Tomatimer: Pause Or Resume` Pause or resume current session.
    - Typing in Atom automatically resumes the timer.
- Once started, look for a timer on status bar, that consists of an hourglass icon and a time.
  - Click icon to view your Tomatimer historical stats.
  - Click time to pause/resume current session.
  - Timer counts 25 minutes (configurable) before a dialog freezes Atom and reminds you to take a break.
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
- More specs
