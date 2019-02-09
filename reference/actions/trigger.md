# trigger

## Description

Trigger an event on an element.

## Arguments

If you use external arguments, use the argument's name.  
If you use non-external arguments, use the order of the arguments as written here:

#### event

The event to trigger.  
For example 'click'.


## Examples

- Trigger submit in a form:  
  ```html  
  <form action="/login" method="post">  
    <input name="username" type="text">  
  
    <input type="submit" id="submitForm">  
  </form>  
  
  <a href="#" class="cq_click_trigger-click_id-submitForm">Trigger submit!</a>  
  ```  
  Note: At the time of writing, this example does not work, due to a bug.