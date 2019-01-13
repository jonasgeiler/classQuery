Events are the first part of a class query (if you exclude "cq") and specify when to execute the classQuery.

## Structure

The structure of the event-part is very simple.
It's actually just one word.
'click', for example, executes the classQuery when the element gets clicked.
'input', for example, executes the classQuery when you type something in.
'init', for example, executes the classQuery at the start of the script.

So that's it.

There are special events, like 'init', that are defined by the library, and non-special events, like 'click', that are built-in into javascript.

## Examples

Do I really need examples?  
Fine...

- Execute classQuery when clicked on the element: `click`
- Execute classQuery when the element gets dragged: `drag`
- Execute classQuery when the user right-clicks on the element, to open the context menu:  `contextmenu`