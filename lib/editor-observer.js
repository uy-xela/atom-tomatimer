'use babel'

import {EventEmitter} from 'events'

class EditorObserver extends EventEmitter {

  /**
   * Start observing editors
   */
  start () {
    this.linesAdded = 0
    this.linesDeleted = 0
    this.editors = this.editors || {}

    atom.workspace.observeTextEditors(editor => {
      if (this.editors[editor.id] != null) return

      this.editors[editor.id] = {
        lineCount: editor.getLineCount(),
        listeners: [] // Event listener disposables
      }
      let disposable = editor.onDidStopChanging(() => this.onDidStopChanging(editor))
      this.editors[editor.id].listeners.push(disposable)
      disposable = editor.onDidDestroy(() => this.onDidDestroy(editor))
      this.editors[editor.id].listeners.push(disposable)
    })
  }

  // TODO
  dispose () {}

  /**
   * Get stats for current session, including numbers of lines added and deleted
   */
  getStats () {
    return {linesAdded: this.linesAdded, linesDeleted: this.linesDeleted}
  }

  /**
   * Handlers for editor events
   */

  onDidStopChanging (editor) {
    const editorInfo = this.editors[editor.id]
    if (editorInfo == null) return // Only respond to active editors

    this.emit('editor_did_change')

    // Update editor info
    const prevLineCount = editorInfo.lineCount
    editorInfo.lineCount = editor.getLineCount()
    const diff = editorInfo.lineCount - prevLineCount
    diff > 0 ? this.linesAdded += diff : this.linesDeleted -= diff
  }

  onDidDestroy (editor) {
    for (let disposable of this.editors[editor.id].listeners) disposable.dispose()
    delete this.editors[editor.id]
  }
}

export default EditorObserver
