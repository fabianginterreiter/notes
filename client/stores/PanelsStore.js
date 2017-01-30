import Dispatcher from './Dispatcher';
import cookie from 'react-cookie';

class PanelsStores extends Dispatcher {
  constructor() {
    super({
      categories: cookie.load('categories') === 'false' ? false : true,
      tags: cookie.load('tags') === 'false' ? false : true,
      notes: cookie.load('notes') === 'false' ? false : true
    });
  }

  setCategories(value) {
    super.getObject().categories = value;
    super.dispatch();
    cookie.save('categories', value.toString());
  }

  setTags(value) {
    super.getObject().tags = value;
    super.dispatch();
    cookie.save('tags', value.toString());
  }

  setNotes(value) {
    super.getObject().notes = value;
    super.dispatch();
    cookie.save('notes', value.toString());
  }
}

module.exports = new PanelsStores();