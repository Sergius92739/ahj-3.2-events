import Task from '../Task';

const task = new Task('Сделать ДЗ');

test('Инстанс класса должен содержать корректные свойства', () => {
  expect(task.taskName).toBe('Сделать ДЗ');
  expect(task.pinned).toBeFalsy();
});

test('Метод template должен вернуть html-разметку', () => {
  expect(Task.template().length).toBe(265);
  expect(Task.template('Решить ДЗ').includes('Решить ДЗ')).toBeTruthy();
  expect(Task.template().includes('<li class="tasks__item">')).toBeTruthy();
  expect(Task.template().includes('<label class="task__label">')).toBeTruthy();
  expect(Task.template().includes('<div class="task__text"></div>')).toBeTruthy();
  expect(Task.template().includes('<input class="task__input" type="checkbox">')).toBeTruthy();
  expect(Task.template().includes('<div class="task__checkbox"></div>')).toBeTruthy();
  expect(Task.template().includes('</label>')).toBeTruthy();
  expect(Task.template().includes('</li>')).toBeTruthy();
});
