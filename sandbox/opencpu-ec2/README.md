OpenCPU on EC2 Demo
===================

This demo page shows how to use the opencpu client-side javascript library to make multiple calls to OpenCPU and maintain a statefull application. This means the output from one ajax call is passed as input to another ajax call by passing the session object. 

The first step generates N random variables. 
The second step computes the variance of the generated random values. 

This demo requires an existing OpenCPU instance running on EC2. See the wiki.

## Install Front-end Libraries

```
bower install
```

## Update OpenCPU URL

Set the public OpenCPU URL in the first line of the script block in `index.html`

```js
ocpu.seturl("//54.84.225.145/ocpu/library/stats/R");
```

## Run server

```
python -m SimpleHTTPServer
```

Then open file in browser

```
open http://localhost:8000
``` 
