# circadia.js
Simple JavaScript module to enable night/dark mode in front end web projects. Zero dependencies. Adjusts text color to ensure readability based on contrast ratios between background and foreground.

Currently works for static web pages. More features to come...stay tuned. Feature requests and suggestions for improvement always welcome.

### How to use:
Simply add the `circadia.js` file to your project and add the following `script` element to your HTML file:
```html
<script src="/PATH/TO/FILE/circadia.js" type="text/javascript"></script>
```
In another JavaScript file, first create an instance of the `Circadia` class:
```javascript
let circadia = new Circadia();
```
Then, call the following methods to activate or deactivate the dark theme on your webpage, respectively:
```javascript
circadia.activate();

circadia.deactivate();
```
The activation state is stored in the browser's cache and is preserved when the page is reloaded or when the browser restarts.
