
class MockLocalStorage {

  private internal: Record<string, string> = {};
  get(key: string) {
    return this.internal[key];
  }
  set(key: string, val: string) {
    this.internal[key] = val;
    return true;
  }
  remove(key: string) {
    const exists = this.internal.hasOwnProperty(key);
    delete this.internal[key];
    return exists;
  }
}
const ls = new MockLocalStorage();
export default ls;
