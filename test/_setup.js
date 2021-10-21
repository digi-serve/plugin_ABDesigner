import { JSDOM } from "jsdom";
import webix from "./_mock/webix";

// Set web browser environment
const dom = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>");
global.window = dom.window;
global.document = dom.window.document;
global.FileReader = global.window.FileReader;
global.Blob = global.window.Blob;

// Set webix globally
global.$$ = webix;
