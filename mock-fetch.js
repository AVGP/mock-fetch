(function install(global) {
  'use strict';

  if (global._fetch === undefined) {

    // Save original fetch
    global._fetch = global.fetch;

    class Response {
      constructor(expectedResponse) {
        this.expectedJson = expectedResponse.json;
        this.expectedText = expectedResponse.text;
        this.expectedStatus = expectedResponse.status || 200;
        this.expectedStatusText = expectedResponse.statusText || "OK";
        this.expectedOK = 200 <= this.expectedStatus && this.expectedStatus < 300;
      }

      json() {
        if(!this.expectedOK) throw new Error(this.statusText || 'Not OK');
        return Promise.resolve(this.expectedJson || JSON.parse(expectedText));
      }

      text() {
        if(!this.expectedOK) throw new Error(this.statusText || 'Not OK');
        return Promise.resolve(this.expectedText || JSON.stringify(expectedJson));
      }

      get status() {
        return this.expectedStatus;
      }

      get statusText() {
        return this.expectedStatusText;
      }

      get ok() {
        return this.expectedOK;
      }
    }

    class MockFetch {
      constructor() {
        this.expectations = [];
      }

      expect(request, expectedResponse) {
        this.expectations.push({
          request: ((typeof request === 'string' || request instanceof RegExp) ? { url: request } : request),
          response: new Response(expectedResponse),
        });
        return this;
      }

      clear() {
        this.expectations = [];
        return this;
      }

      fetch(input, init) {
        init = init || {};
        const matchingExpectation = this.expectations.find(expectation => {
          if (input.match(expectation.request.url)) {
            return !expectation.request ||
                   ['method', 'body'].every((k) => expectation.request[k] === init[k]);
          }
          return false;
        });

        if (matchingExpectation === undefined)
          // "input" was unexpected: let the original fetch handle it
          return global._fetch(input, init);

        return Promise.resolve(matchingExpectation.response);
      }
    }

    // Inject a mock fetch in place of origin one
    global.fetch = (function () {
      const unique = new MockFetch();

      function fetch(input, init) {
        return unique.fetch(input, init)
      }
      fetch.expect = unique.expect.bind(unique);
      fetch.clearExpectations = () => unique.clear();

      return fetch;
    } ());
  }
}) (window);
