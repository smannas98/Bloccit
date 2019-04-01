module.exports = class ApplicationPolicy {
  // #1
  constructor(user, record) {
    this.user = user;
    this.record = record;
  }

  // #2
  _isMember() {
    return this.user && this.user.role == "member";
  }

  _isOwner() {
    console.log("DEBUG: _isOwner");
    console.log("Record:");
    console.log(this.record);
    console.log("\nUser:");
    console.log(this.user);
    console.log("\n-------------\n\n");
    return this.record && this.user && this.record.userId == this.user.id;
  }

  _isAdmin() {
    return this.user && this.user.role == "admin";
  }

  _isGuest() {
    return this.user && this.user.role == 'guest';
  }

  // #3
  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  show() {
    return true;
  }

  // #4
  edit() {
    return this.new() && this.record && (this._isOwner() || this._isAdmin());
  }

  update() {
    return this.edit();
  }

  // #5
  destroy() {
    return this.update();
  }
};
