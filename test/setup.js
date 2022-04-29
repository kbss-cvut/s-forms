import enzyme, { shallow, mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { act } from "react-dom/test-utils";
import { setGlobalConfig } from "@storybook/testing-react";
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

setGlobalConfig(globalStorybookConfig);
