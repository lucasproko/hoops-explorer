
class MockLocalStorage {

  private internal: Record<string, string> = {};
  get(key: string) {
    return this.internal[key];
  }
  set(key: string, val: string) {
    this.internal[key] = val;
    return true;
  }
}
const ls = new MockLocalStorage();
export default ls;
