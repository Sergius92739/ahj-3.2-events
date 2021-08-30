export default class Filterer {
  clean(inputValue) {
    this.inputValue = inputValue;
    return this.inputValue.trim();
  }

  byFirstChar(data, search) {
    this.data = data.filter((e) => !e.pinned && e.taskName
      .toLowerCase()
      .startsWith(search.toLowerCase()));
    return this.data;
  }
}
