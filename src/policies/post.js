const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {
  constructor(user, record) {
    super();
    this.user = user;
    this.record = record;
  }

  new() {
    return (this._isMember() || this._isAdmin());
  }

  create() {
    return this.new();
  }

  edit() {
    console.log("DEBUG: postPolicy.edit -> user id = " + this.user.id);
    console.log("DEBUG: postPolicy.edit -> post userId = " + this.record.userId);
    return (this._isOwner() || this._isAdmin());
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
};
