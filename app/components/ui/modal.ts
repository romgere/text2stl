import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import UIkit from 'uikit';
import { action } from '@ember/object';

interface ModalArgs {
  onHide?: () => void;
}

export default class UiModal extends Component<ModalArgs> {
  openModal = modifier((element: HTMLDivElement) => {
    UIkit.modal(element).show();
  });

  @action
  onHide() {
    this.args.onHide?.();
  }
}
