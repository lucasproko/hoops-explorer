import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Mocking:
import ClipboardJS from 'clipboard';
jest.mock("clipboard")
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
jest.mock("react-bootstrap/OverlayTrigger")


enzyme.configure({ adapter: new Adapter() });
