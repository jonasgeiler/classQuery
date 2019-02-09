# removeClass

## Description

Removes one or more classes from an element.

## Arguments

If you use external arguments, use the argument's name.  
If you use non-external arguments, use the order of the arguments as written here:

#### classes

A list of classes to remove.  
Space-separated if external argument.  
Hyphen-separated if non-external argument.


## Examples

- Remove the class 'active' from self at double click: `cq_dblclick_removeClass-active_self`  
- Remove the classes 'active' and 'awesome' from self at double click: `cq_dblclick_removeClass-active-awesome_self`  
- Remove the class 'is-active' from self at double click:  
  ```html  
  <li class="cq_dblclick_removeClass--_self" data-classes="is-active">Menu Item</li>  
  ```