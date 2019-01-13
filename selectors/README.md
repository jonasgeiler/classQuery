Selectors are the last part of a classQuery and specify the element where the action happens!  

## Structure

They consist of 2 parts, seperated with a hyphen (-):

---

#### How to select the element
For example: 'class', 'id' or 'name'.  
Look at the sub-pages of this page for more info!

#### The element's id/class/name/...
For example: 'veryImportantLink'  
You can also have underscores (_) and hyphens (-) here.  
Because this is the last part, the script just takes the rest of the classQuery!

---

## Limitations

- It's not possible to have multiple classes/ids/names/... !

## Examples

- Select all elements with class='modal':  `class-modal`
- Select the element with id='very-important-link':  `id-very-important-link`
- Select all elements with name='skayo':  `name-skayo`
- Select all links (`<a href="#">link</a>`):  `tag-a`
- Select the same element where the classQuery is (modify itself): `self`
- Select the element's parent-element: `parent`