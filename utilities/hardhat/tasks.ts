import {
  deploy,
  storage,
} from "../components";

function init() {
  deploy.addTasks();
  storage.addTasks();
}

module.exports = { init }
