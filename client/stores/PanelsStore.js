import Dispatcher from './Dispatcher';

class PanelsStores extends Dispatcher {
  constructor() {
    super({
      categories:true,
      tags:true,
      notes:true
    });
  }

  setCategories(value) {
    super.getObject().categories = value;
    super.dispatch();
  }

  setTags(value) {
    super.getObject().tags = value;
    super.dispatch();
  }

  setNotes(value) {
    super.getObject().notes = value;
    super.dispatch();
  }
}

module.exports = new PanelsStores();