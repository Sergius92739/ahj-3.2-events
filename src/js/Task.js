export default class Task {
  constructor(taskName) {
    this.taskName = taskName;
    this.pinned = false;
  }

  static template(str = '') {
    return `<li class="tasks__item">
              <label class="task__label">
                <div class="task__text">${str}</div>
                <input class="task__input" type="checkbox">
                <div class="task__checkbox"></div>
              </label>
            </li>`;
  }
}
