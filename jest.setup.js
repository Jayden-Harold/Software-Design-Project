global.fetch = require('node-fetch');  //to tell Jest to include fetch before any test runs.
import fetch, { Request, Response, Headers } from 'node-fetch';

if (!global.fetch) global.fetch = fetch;
if (!global.Request) global.Request = Request;
if (!global.Response) global.Response = Response;
if (!global.Headers) global.Headers = Headers;