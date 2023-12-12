
import { setupServer } from "msw/node";
import 'text-encoding-polyfill'; 
import { configure } from "@testing-library/dom";

global.TextEncoder = require("util").TextEncoder;

configure({
  testIdAttribute: "data-testid",
});
const server =
  setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

export { server };