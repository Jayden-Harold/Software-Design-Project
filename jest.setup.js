global.fetch = require('node-fetch');  //to tell Jest to include fetch before any test runs.
import fetch, { Request, Response, Headers } from 'node-fetch';

if (!global.fetch) global.fetch = fetch;
if (!global.Request) global.Request = Request;
if (!global.Response) global.Response = Response;
if (!global.Headers) global.Headers = Headers;

//Mock Firebase globally
jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(() => ({
      where: jest.fn(),
      get: jest.fn()
    })),
}));