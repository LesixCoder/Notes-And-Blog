function myPromise(constructor) {
  var self = this;
  self.status = "pending";
  self.value = undefined;
  self.reason = undefined;
  function resolve(value) {
    if(self.status = "pending") {
      self.value = value;
      self.status = "resolved";
    }
  }
  function reject(reason) {
    if(self.status = "pending") {
      self.reason = reason;
      self.status = "rejected";
    }
  }
  try {
    constructor(resolve, reject);
  } catch(e) {
    reject(e);
  }
}