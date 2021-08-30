import Tracker from '../Tracker';

const testTracker = new Tracker();
document.body.innerHTML = '<div class="tracker"></div>';

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

test('Метод bindToDOM должен привязать контейнер к классу', () => {
  testTracker.bindToDOM(document.querySelector('.tracker'));
  expect(document.body.firstElementChild.className).toBe('tracker');
});

test('Метод bindToDOM должен выбросить ошибку', () => {
  expect(() => testTracker.bindToDOM(null)).toThrowError(new Error('container is not HTMLElement'));
});

test('Метод drawUI генерирует html-разметку', () => {
  testTracker.drawUI();
  expect(testTracker.container.firstElementChild.className).toBe('tracker__body');
  expect(testTracker.container.firstElementChild.children[0].className).toBe('tracker__wrapper');
  expect(testTracker.container.firstElementChild.children[0].children[0].className).toBe('tracker__content');
  expect(testTracker.container.querySelector('.tracker__content').children[0].className).toBe('tracker__title');
  expect(testTracker.container.querySelector('.tracker__content').children[1].className).toBe('main__input');
  expect(testTracker.container.querySelector('.tracker__content').children[2].className).toBe('error_mes d_none');
  expect(testTracker.container.querySelector('.tracker__content').children[3].className).toBe('tasks__section');
  expect(testTracker.container.querySelector('.tracker__content').children[3].children[0].className).toBe('tasks__title');
  expect(testTracker.container.querySelector('.tracker__content').children[3].children[1].className).toBe('tasks__list pinned');
  expect(testTracker.container.querySelector('.tasks__list.pinned').children[0].className).toBe('no_found');
  expect(testTracker.container.querySelectorAll('.tasks__section')[1].children[0].textContent).toBe('All tasks:');
  expect(testTracker.container.querySelectorAll('.tasks__section')[1].children[1].textContent.trim()).toBe('No tasks found');
});

test('Метод checkInput должен удалить класс d_none у элемента error_mes при пустом поле ввода', () => {
  const event = new KeyboardEvent('keyup', { code: 'Enter' });
  testTracker.container.querySelector('.main__input').dispatchEvent(event);
  testTracker.checkInput('   ', event);
  expect(testTracker.container.querySelector('.error_mes').className).toBe('error_mes');
});

test('Метод addTaskToMemory должен добавить объект задачи в память', () => {
  testTracker.addTaskToMemory('Написать тесты к этой задаче');
  const result = [{ pinned: false, taskName: 'Написать тесты к этой задаче' }];
  expect(testTracker.memory).toEqual(result);
});

test('Метод buildAllTasksList должен вставить задачу в блок с классом "tasks__list all"', () => {
  testTracker.buildAllTasksList(testTracker.memory);
  const received = 'Написать тесты к этой задаче';
  expect(testTracker.taskListAllEl.querySelector('.task__text').textContent).toBe(received);
});

test('Метод buildPinnedTasksList должен вставить задачу в блок с классом "tasks__list pinned"', () => {
  testTracker.memory[0].pinned = true;
  testTracker.buildPinnedTasksList(testTracker.memory);
  const received = 'Написать тесты к этой задаче';
  expect(testTracker.memory[0].pinned).toBeTruthy();
  expect(testTracker.taskListPinnedEl.querySelector('.task__text').textContent).toBe(received);
});

test('Метод showFilteredTasks должен отфильтровать задачи в DOM по началу строки', () => {
  testTracker.addTaskToMemory('Пофиксить баги');
  testTracker.addTaskToMemory('переделать класс Tracker');
  testTracker.addTaskToMemory('Решить третью задачу');
  testTracker.input.value = 'п';
  testTracker.showFilteredTasks();
  expect(testTracker.taskListAllEl.querySelectorAll('.tasks__item').length).toBe(2);
});

test('Метод onBlur должен добавить класс d_none элементам error_mes и no_found при потере фокуса', () => {
  const event = new FocusEvent('blur');
  testTracker.container.querySelector('.main__input').dispatchEvent(event);
  testTracker.onBlur();
  expect(testTracker.errorMes.className).toBe('error_mes d_none');
  expect(testTracker.noFound.className).toBe('no_found d_none');
});

test('Метод onCheckBoxClick должен вызвать колбеки при клике на элемент task__label и добавить класс d_none элементу no_found', () => {
  const event = new MouseEvent('click');
  testTracker.container.querySelector('.tasks__list.all').querySelector('.task__input').dispatchEvent(event);
  testTracker.buildPinnedTasksList = jest.fn();
  testTracker.buildAllTasksList = jest.fn();
  testTracker.onCheckBoxClick(event);
  expect(testTracker.buildPinnedTasksList).toHaveBeenCalled();
  expect(testTracker.buildAllTasksList).toHaveBeenCalled();
  expect(testTracker.noPinned.className).toBe('no_found d_none');
});

test('Метод addTaskToDOM должен при нажатии Enter вызвать колбеки', () => {
  const event = new KeyboardEvent('keyup', { code: 'Enter' });
  testTracker.container.querySelector('.main__input').dispatchEvent(event);
  testTracker.addTaskToMemory = jest.fn();
  testTracker.buildAllTasksList = jest.fn();
  testTracker.checkInput = jest.fn();
  testTracker.checkInput.mockReturnValue(true);
  testTracker.addTaskToDOM(event);
  expect(testTracker.addTaskToMemory).toHaveBeenCalled();
  expect(testTracker.buildAllTasksList).toHaveBeenCalled();
  expect(testTracker.input.value).toBe('');
});

test('Метод drawUI должен выбросить ошибку', () => {
  testTracker.container = null;
  expect(() => testTracker.drawUI()).toThrowError(new Error('container not bind to DOM'));
});

test('Метод checkBinding должен выбросить ошибку', () => {
  expect(() => testTracker.checkBinding()).toThrow();
});
