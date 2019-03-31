const ApplicationPolicy = require('./application');

module.exports = class PostPolicy extends ApplicationPolicy {
  new() {
    return (this._isMember() || this._isAdmin());
  }

  create() {
    return this.new();
  }

  edit() {
    return (this._isOwner() || this._isAdmin());
  }

  update() {
    this.edit();
  }

  destroy() {
    this.update();
  }
};
