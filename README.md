# Rakuten Cloud Platform PoC

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)


# ENV file syntax
- POSTGRES_USER=
- POSTGRES_PASSWORD=
- JFROG_APIKEY=
- ARTIFACTORY_BASE_URL=
- JFROG_USER=
- VALID_ARTIFACTS=application/x-gzip,application/x-tar,application/x-gtar,application/x-tgz,application/gzip


# Start a server
Install dependencies:
```
npm install
```

Start server
```
npm start
```
The JFrog test API exposed are as follows:
- PUT `/artifacts`

	To upload a bundle

	Accepts: `multipart/form-data`:
	- `file`: Rakuten-bundle-file. eg. omnicare-v1.2.tar.gz
	- `bundle`: name of bundle, name of application or the application submitted by vendor e.g. omnicare
	- `org`: Organization. i.e. repository name
	- `revision`: The revision for testing purpose. It will be auto-managed after implementation
- GET `/artifacts/{org}/{bundle}/{revision}`

	To download a bundle

	Accepts: `*/*`

	example: `http://localhost:3000/artifacts/rakuten-poc-bundle/omnicare/3.1` to fetch the v3.1 bundle of omnicare under rakuten-poc-bundle repository


# Documentation
---
title: rakuten-jfrog-loopback v1.0.0
language_tabs:
  - javascript: JavaScript
  - javascript--nodejs: Node.JS
language_clients:
  - javascript: request
  - javascript--nodejs: ""
toc_footers: []
includes: []
search: false
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="rakuten-jfrog-loopback">rakuten-jfrog-loopback v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

code

Base URLs:

* <a href="http://localhost:3000">http://localhost:3000</a>

<h1 id="rakuten-jfrog-loopback-artifactscontroller">ArtifactsController</h1>

## ArtifactsController.downloadArtifact

<a id="opIdArtifactsController.downloadArtifact"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/octet-stream'
};

fetch('http://localhost:3000/artifacts/{org}/{bundle}/{revision}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/octet-stream'
};

fetch('http://localhost:3000/artifacts/{org}/{bundle}/{revision}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /artifacts/{org}/{bundle}/{revision}`

<h3 id="artifactscontroller.downloadartifact-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|org|path|string|true|none|
|bundle|path|string|true|none|
|revision|path|string|true|none|

> Example responses

> 200 Response

<h3 id="artifactscontroller.downloadartifact-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|The file content|string|

<aside class="success">
This operation does not require authentication
</aside>

## ArtifactsController.uploadArtifact

<a id="opIdArtifactsController.uploadArtifact"></a>

> Code samples

```javascript
const inputBody = '{}';
const headers = {
  'Content-Type':'multipart/form-data'
};

fetch('http://localhost:3000/artifacts',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {};
const headers = {
  'Content-Type':'multipart/form-data'
};

fetch('http://localhost:3000/artifacts',
{
  method: 'PUT',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /artifacts`

> Body parameter

```yaml
{}

```

<h3 id="artifactscontroller.uploadartifact-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|Upload an artifact|

<h3 id="artifactscontroller.uploadartifact-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of ArtifactsController.uploadArtifact|None|

<aside class="success">
This operation does not require authentication
</aside>

