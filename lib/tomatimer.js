'use babel';

import TomatimerView from './tomatimer-view';
import { CompositeDisposable } from 'atom';

export default {

  tomatimerView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.tomatimerView = new TomatimerView(state.tomatimerViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.tomatimerView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'tomatimer:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.tomatimerView.destroy();
  },

  serialize() {
    return {
      tomatimerViewState: this.tomatimerView.serialize()
    };
  },

  toggle() {
    console.log('Tomatimer was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  start() {
    console.log('Tomatimer was started')
  },

  pause() {
    console.log('Tomatimer was paused')
  },

  reset() {
    console.log('Tomatimer was reset')
  }
};
