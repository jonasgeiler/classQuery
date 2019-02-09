# setAttribute

## Description

Set the attribute on an element to a specific value.

## Arguments

If you use external arguments, use the argument's name.  
If you use non-external arguments, use the order of the arguments as written here:

#### attributeName

The name of the attribute to set.
For example 'disabled'.

#### attributeValue

The value to set the attribute to.
For example 'true' (when attributeName is 'disabled').


## Examples

- Set language attribute on the HTML tag when clicked on a button:
```html
<html lang="en">
<body>
<button class="cq_click_setAttribute-lang-en_tag-html">Switch to English</button>
<button class="cq_click_setAttribute-lang-de_tag-html">Switch to German</button>
<button class="cq_click_setAttribute-lang-fr_tag-html">Switch to French</button>
</body>
</html>
```
- Set a link when double clicked on a button:
```html
<a name="link" href="#" target="_blank">This is a link</a>

<button class="cq_click_setAttribute--_name-link" data-attributeName="href" data-attributeValue="https://google.com">Change link</button>
```