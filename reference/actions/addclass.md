# addClass

## Description

Adds one or more classes to an element.

## Arguments

If you use external arguments, use the argument's name.  
If you use non-external arguments, use the order of the arguments as written here:

#### classes

A list of classes to add.  
Space-separated if external argument.  
Hyphen-separated if non-external argument.


## Examples

- Add the class 'active' at double click on self: `cq_dblclick_addClass-active_self`  
- Add the classes 'active' and 'awesome' at double click on self: `cq_dblclick_addClass-active-awesome_self`  
- Add the class 'is-active' at double click on self:  
  ```html  
  <li class="cq_dblclick_addClass--_self" data-classes="is-active">Menu Item</li>  
  ```