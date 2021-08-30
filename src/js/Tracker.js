import Task from './Task';
import Filterer from './Filterer';

export default class Tracker {
  constructor() {
    this.container = null;
    this.input = null;
    this.noPinned = null;
    this.noFound = null;
    this.errorMes = null;
    this.taskListAllEl = null;
    this.taskListPinnedEl = null;
    this.memory = [];
    this.filterer = new Filterer();
    this.clean = null;
  }

  init() {
    this.drawUI();
    this.addsListners();
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  drawUI() {
    this.checkBinding();
    this.container.innerHTML = `
    <div class="tracker__body">
      <div class="tracker__wrapper">
        <div class="tracker__content">
          <h1 class="tracker__title">TOP Tasks</h1>
          <input class="main__input" type="text" placeholder="Enter the task">
          <div class="error_mes d_none">Поле ввода должно содержать не менее одного символа.</div>
          <div class="tasks__section">
            <h2 class="tasks__title">Pinned:</h2>
            <ul class="tasks__list pinned">
              <div data-found="pinned" class="no_found">
                <div class="no_found__text">No Pinned tasks</div>
              </div>
            </ul>
          </div>
          <div class="tasks__section">
            <h2 class="tasks__title">All tasks:</h2>
            <ul class="tasks__list all">
              <div data-found="all" class="no_found d_none">
                <div class="no_found__text">No tasks found</div>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>`;
    this.input = this.container.querySelector('.main__input');
    this.errorMes = this.container.querySelector('.error_mes');
    this.taskListAllEl = this.container.querySelector('.tasks__list.all');
    this.taskListPinnedEl = this.container.querySelector('.tasks__list.pinned');
  }

  addsListners() {
    this.input.addEventListener('keyup', (event) => this.addTaskToDOM(event));
    this.input.addEventListener('blur', () => this.onBlur());
    this.input.addEventListener('input', () => this.showFilteredTasks());
    this.container.addEventListener('click', (event) => this.onCheckBoxClick(event));
  }

  checkInput(inputValue, event) {
    this.clean = this.filterer.clean(inputValue);
    if (this.clean === '' && event.code === 'Enter') {
      this.errorMes.classList.remove('d_none');
      return false;
    }
    this.errorMes.className = 'error_mes d_none';
    return true;
  }

  addTaskToMemory(taskName) {
    this.memory.push(new Task(taskName));
  }

  buildAllTasksList(data) {
    this.taskListAllEl.innerHTML = `<div data-found="all" class="no_found d_none">
                                      <div class="no_found__text">No tasks found</div>
                                    </div>`;
    this.noFound = this.container.querySelector('[data-found="all"]');
    data.forEach((e) => {
      if (!e.pinned) {
        this.taskListAllEl.insertAdjacentHTML('beforeend', Task.template(e.taskName));
      }
    });
  }

  buildPinnedTasksList(data) {
    this.taskListPinnedEl.innerHTML = `<div data-found="pinned" class="no_found">
                                         <div class="no_found__text">No Pinned tasks</div>
                                       </div>`;
    this.noPinned = this.container.querySelector('[data-found="pinned"]');
    data.forEach((e) => {
      if (e.pinned) {
        this.taskListPinnedEl.insertAdjacentHTML('beforeend', Task.template(e.taskName));
      }
    });
    this.taskListPinnedEl.querySelectorAll('.task__input').forEach((e) => {
      e.checked = true;
    });
  }

  addTaskToDOM(event) {
    if (this.checkInput(this.input.value, event)) {
      if (event.code === 'Enter') {
        this.addTaskToMemory(this.clean);
        this.buildAllTasksList(this.memory);
        this.input.value = '';
      }
    }
  }

  showFilteredTasks() {
    this.buildAllTasksList(this.filterer.byFirstChar(this.memory, this.input.value));
    const filter = this.filterer.byFirstChar(this.memory, this.input.value).length;
    if (!filter && this.input.value) {
      this.noFound.classList.remove('d_none');
    }
  }

  onBlur() {
    if (!this.errorMes.classList.contains('d_none')) {
      this.errorMes.classList.add('d_none');
    }
    if (!this.noFound.classList.contains('d_none')) {
      this.noFound.classList.add('d_none');
    }
  }

  onCheckBoxClick(event) {
    if (event.target.closest('.tasks__list.all') && event.target.checked) {
      const pinDOM = event.target.closest('.tasks__item').querySelector('.task__text');
      const pinMemory = this.memory.find((e) => e.taskName === pinDOM.textContent && !e.pinned);
      pinMemory.pinned = true;
      this.buildPinnedTasksList(this.memory, pinDOM);
      this.buildAllTasksList(this.memory);
      this.noPinned.classList.add('d_none');
    }
    if (event.target.closest('.tasks__list.pinned') && !event.target.checked) {
      const pinDOM = event.target.closest('.tasks__item').querySelector('.task__text');
      const pinMemory = this.memory.find((e) => e.taskName === pinDOM.textContent && e.pinned);
      pinMemory.pinned = false;
      this.buildPinnedTasksList(this.memory, pinDOM);
      this.buildAllTasksList(this.memory);
      this.noPinned.classList.add('d_none');
      if (this.taskListPinnedEl.children.length === 1) {
        this.noPinned.classList.remove('d_none');
      }
    }
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('container not bind to DOM');
    }
  }
}
