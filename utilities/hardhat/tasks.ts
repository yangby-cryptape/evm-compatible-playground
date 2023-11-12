import * as components from "../components";

function init() {
  components.deploy.addTasks();
  components.storage.addTasks();
  components.transfer1.addTasks();
  components.transfern.addTasks();
}

module.exports = { init }
