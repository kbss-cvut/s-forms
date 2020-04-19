import enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

enzyme.configure({ adapter: new Adapter() });

global.shallow = shallow;
global.mount = mount;
