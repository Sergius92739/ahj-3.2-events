import Filterer from '../Filterer';

const filter = new Filterer();
const arr = [
  { taskName: 'homework', pinned: false },
  { taskName: 'Home', pinned: false },
  { taskName: 'walk', pinned: false },
  { taskName: 'enything', pinned: false },
];

test('Метод clean должен убрать пробелы в начале и в конце строки', () => {
  expect(filter.clean('  aaaaa   ')).toBe('aaaaa');
});

test('Метод byFirstChar должен вернуть массив объектов, в которых свойства taskName начинаются с переданного символа', () => {
  expect(filter.byFirstChar(arr, 'h')).toEqual([
    { taskName: 'homework', pinned: false },
    { taskName: 'Home', pinned: false },
  ]);
  expect(filter.byFirstChar(arr, 'w')).toEqual([
    { taskName: 'walk', pinned: false },
  ]);
});
