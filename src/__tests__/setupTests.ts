import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Mocking:
import ClipboardJS from 'clipboard';
jest.mock("clipboard")

enzyme.configure({ adapter: new Adapter() });
