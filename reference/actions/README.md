# Actions

Actions are the middle part of a classQuery \(if you exclude "cq"\) and specify what happens when the event gets triggered.

## Structure

The structure of actions is very special, compared to the other parts of a classQuery.

Let's take an example element with a classQuery:

```html
<button class="cq_click_addClass-testClass_id-testElement"></button>
```

The `addClass-testClass`-part is the action-part of the classQuery, so let's focus on that.  
`addClass` is the "function" or "method" and tells us what happens when the event triggers. Here, the action adds a class to another element.  
The `testClass`-part is an argument of the action-part and tells us what class to add to the other element.

Everything clear so far?  
If not, scream at @Skayo or look at the other examples below.

So you might be asking: "When I add the class 'is-active' to an element, classQuery somehow adds the class 'is' and the class 'active' to it".  
That's because with a hyphen \(-\), you actually separate all the classes you want to add \(so `addClass-test-test2` adds the classes `test` and `test2` to an element\).

So how to prevent that?  
That's where "external arguments" come in!  
To tell the library that you are using external arguments on an element, just write `--` instead of the `testClass`.  
Now the library uses your external arguments, instead of the arguments directly in the classQuery.  
To set an external argument, you need to add a custom attribute to the element.  
In this case: `data-classes`. So the element looks like this:

```html
<button class="cq_click_addClass--_id-testElement" data-classes="testClass"></button>
```

This does the same as before, but now uses external arguments.

## Limitations

* It is currently not possible to have for example two 'addClass'-actions that use external arguments on one element. The reason for this is because you can't set two different `data-classes=""` \(look in the documentation to find out the name of the external argument\) on one element. Of course, if all classQueries with an 'addClass'-action use the same classes, it would still work.

## Examples

* Hide an other element: `hide`
* Trigger a click on an other element: `trigger-click`
* Set the title of an other element: `setAttribute-title-Test`
* Set the title of an other element with external arguments:
  ```html
  <button class="cq_click_setAttribute--_self" data-attributeName="title" data-attributeValue="Hello World">Set the title of myself to "Hello World"</button>
  ```

