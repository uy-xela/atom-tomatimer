'use babel'

import {EventEmitter} from 'events'

export default class StatsView extends EventEmitter {
  constructor () {
    super()
    this.element = document.createElement('div')
  }

  /**
   * Render stats view modal
   * @param  {Object} {session, today, history} - Stats to render
   */
  render ({session, today, history}) {
    this.element.innerHTML = `
      <div class="tomatimer-stats">
        <h1 id='tomatimer-title'><span class='icon icon-hourglass'></span></h1>
        ${this.currentSession(session)}
        ${this.today(today)}
        ${this.history(history)}
        ${this.closeButton()}
      </div>
    `
    document.getElementById('close-btn').addEventListener('click', () => this.emit('close_clicked'))
  }

  /**
   * Return html snippet of current session
   * @param  {Object} {linesAdded, linesDeleted} - Data to render
   * @return {string} Html
   */
  currentSession ({linesAdded, linesDeleted}) {
    return `
      <h2>Current Session</h2>
      <p>
        <span class='tomatimer-number'>${linesAdded}</span> lines added &
        <span class='tomatimer-number'>${linesDeleted}</span> lines deleted.
      </p>
    `
  }

  /**
   * Return html snippet of today's stats
   * @param  {Object} {completions, linesAdded, linesDeleted} - Data to render
   * @return {string} Html
   */
  today ({completions, linesAdded, linesDeleted}) {
    return `
      <h2>Today</h2>
      <p><span class='tomatimer-number'>${completions}</span> sessions completed.</p>
      <p>
        <span class='tomatimer-number'>${linesAdded}</span> lines added &
        <span class='tomatimer-number'>${linesDeleted}</span> lines deleted.
      </p>
    `
  }

  /**
   * Return html snippet of historical stats
   * @param  {Object} {completions, linesAdded, linesDeleted} - Data to render
   * @return {string} Html
   */
  history ({completions, linesAdded, linesDeleted}) {
    return `
      <h2>History</h2>
      <p><span class='tomatimer-number'>${completions}</span> sessions completed.</p>
      <p>
        <span class='tomatimer-number'>${linesAdded}</span> lines added &
        <span class='tomatimer-number'>${linesDeleted}</span> lines deleted.
      </p>
    `
  }

  /**
   * Return html snippet of a close button
   * @return {string} Html
   */
  closeButton () {
    return `
      <div class='block' id='close-btn'>
        <button class='btn'>Close</button>
      </div>
    `
  }

  getElement () { return this.element }
}
