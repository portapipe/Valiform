# Valiform
Validate any form automagically with native HTML5 tags and properties

Just include in your file and you're done! Use the HTML5 validation (like 'required','min','max' or type like 'email','number','integer') to have a cross-browser auto validation like HTML5 in modern browser.

And if you're using Bootstrap, it will use popovers to creare a more cool alert!


In the script tag you can pass two parameters:
* 'override_html5_validation' to disable the built-in browser validation and use just Valiform
* 'debug' to increse the console logs and check if everything is fine (disable it in production!)
* 'skip_no_name' to skip the fields without the name attribute


You can localize the messages with javascript or adding the Valiform_messages.js file. There is a 'lang' parameter where you can specify which language you need (it must be included in the Valiform_messages.js file! If it doesn't exist please add it and pull your request in this project!)


## Code inclusion
```html
<script
    src="Valiform.js"
    charset="utf-8"
    override_html5_validation="true"
    debug="false"
    skip_no_name="true"
    >
</script>

<!-- OPTIONAL VALIFORM LOCALIZED MESSAGES -->
<script src="Valiform_messages.js" lang="en"></script>

```
