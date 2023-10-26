import {
  deploy,
  storage,
  transfer1,
} from "../components";

function init() {
  deploy.addTasks();
  storage.addTasks();
  transfer1.addTasks();
}

module.exports = { init }
