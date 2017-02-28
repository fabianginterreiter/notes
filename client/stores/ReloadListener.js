import Dispatcher from './Dispatcher';

class ReloadListener extends Dispatcher {
  constructor() {
    super({});
  }
}

module.exports = new ReloadListener();