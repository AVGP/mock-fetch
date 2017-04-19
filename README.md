# Mock Fetch

Javascript mocking library for [Fetch](https://fetch.spec.whatwg.org/)

## Installation

mock-fetch is available as a bower component; use the following
command to get it:

```
bower install mock-fetch
```

## Prerequisites

- *An ES6-enabled web browser*: mock-fetch is written in ECMAScript 6,
  leveraging notably classes and arrow functions.

- *A Fetch-enabled web brower*: mock-fetch falls back to the fetch
  implementation initially provided for unexpected URLs.

## Usage

Assuming that the bower configuration being used obtains components in
the "bower_components" directory, and it is being served at the root
of your web site: include the following script tag in your HTML page,
at a location preceding the use of the mock:

```html
<script src="/bower_components/mock-fetch/mock-fetch.js"></script>
<script>
  // Setup the expectations

  // for requests to any url ending with .json we will return {"msg": "Wow"}
  fetch.expect(/.+\.json$/, { json: { msg: 'Wow' } });
  
  // for requests to http://example.org/qotd we will respond with the text "Insert witty remark here"
  fetch.expect(/^http:\/\/example.org\/quotd/, { text: 'Insert witty remark here' });
  // for requests to any other url, we will return 404
  fetch.expect(/.*/, { status: 404, statusText: 'Not found' });
  
  // Code that uses fetch:
  
  fetch('http://example.org/quotd').then(res => res.text()).then(console.log) // Will output "Insert witty remark here"
  fetch('http://example.org/stuff.json').then(res => res.json()).then(console.log) // Will output { msg: 'Wow' }
  // ...
  
</script>
```
