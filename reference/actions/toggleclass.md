# toggleClass

## Description

Toggles one or more classes on an element.  
If the element already has the class, remove it.
If the element doesn't have the class, add it.

## Arguments

If you use external arguments, use the argument's name.  
If you use non-external arguments, use the order of the arguments as written here:

#### classes

A list of classes to toggle.
Space-separated if external argument.
Hyphen-separated if non-external argument.


## Examples

- Toggle the class 'active' at double click on self: `cq_dblclick_toggleClass-active_self`
- Toggle the classes 'active' and 'awesome' at double click on self: `cq_dblclick_toggleClass-active-awesome_self`
- Toggle the class 'is-active' at double click on self:
```html
<li class="cq_dblclick_toggleClass--_self" data-classes="is-active">Menu Item</li>
```