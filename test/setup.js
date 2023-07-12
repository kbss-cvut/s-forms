import enzyme, { shallow, mount } from "enzyme";
import Adapter from "@cfaester/enzyme-adapter-react-18";
import { act } from "react-dom/test-utils";
import { setProjectAnnotations } from "@storybook/react";
import * as globalStorybookConfig from "../.storybook/preview.js";

enzyme.configure({ adapter: new Adapter() });

global.shallow = shallow;
global.mount = mount;

global.waitForComponentToPaint = async (wrapper) => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();
  });
};

setProjectAnnotations(globalStorybookConfig);
