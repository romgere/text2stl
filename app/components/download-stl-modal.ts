import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface DownloadSTLModalArgs {
  onHide?: () => void;
  downloadSTL?: () => void;
}

const DOWNLOAD_WAIT_TIME = 5000;

export default class DownloadSTLModal extends Component<DownloadSTLModalArgs> {
  @tracked _canDownload = false;

  get canDownload() {
    return this._canDownload;
  }

  constructor(owner: unknown, args: DownloadSTLModalArgs) {
    super(owner, args);
    setTimeout(() => (this._canDownload = true), DOWNLOAD_WAIT_TIME);
  }

  @action
  selectAll({ target }: { target: HTMLTextAreaElement }) {
    target.select();
  }
}
