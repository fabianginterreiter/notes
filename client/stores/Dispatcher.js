"use strict"

var __next_objid=0;

class Dispatcher {
  constructor(playload) {
    this._callbacks = {};
    this._payload = playload;
    this._takeover = null;
  }

  _objectId(object) {
    if (object == null) {
      return null;
    }

    if (object.__obj_id == null) {
      object.__obj_id = ++__next_objid;
    }
    return object.__obj_id;
  }

  addChangeListener(object, callback) {
    var id = this._objectId(object);
    this._callbacks[id] = callback;
    return id;
  }

  removeChangeListener(object) {
    var id = this._objectId(object);
    delete this._callbacks[id];
  }

  dispatch() {
    var payload = this.getObject();

    if (this._takeover && this._callbacks[this._takeover]) {
      return this._callbacks[this._takeover](payload);
    }

    for (var id in this._callbacks) {
      this._callbacks[id](payload);
    }
  }

  setObject(payload) {
    this._payload = payload;
    this.dispatch();
  }

  getObject() {
    return this._payload;
  }

  take(object) {
    if (this._takeover) {
      return;
    }

    if (!object.__obj_id) {
      return;
    }

    if (!this._callbacks[object.__obj_id]) {
      return;
    }

    this._takeover = object.__obj_id;
  }

  release(object) {
    if (this._takeover === object.__obj_id) {
      this._takeover = null;  
    }
  }
}

module.exports = Dispatcher;