# scrollTo

## Description

Scroll an element into view.

## Arguments

If you use external arguments, use the argument's name.  
If you use non-external arguments, use the order of the arguments as written here:

#### behavior

How to scroll. Either 'auto' or 'smooth'.  
Look [here](https://developer.mozilla.org/de/docs/Web/API/Element/scrollIntoView) for more information!

#### position

The position in the view to scroll to. Either 'start' or 'end'.  
Look [here](https://developer.mozilla.org/de/docs/Web/API/Element/scrollIntoView) for more information!  
(Referenced as 'block', not 'position', there.)


## Examples

- Smoothly scroll to different parts of the website:  
  ```html  
  <a href="#" class="cq_click_scrollTo-smooth-start_id-introduction">Go to introduction</a>  
  <a href="#" class="cq_click_scrollTo-smooth_id-contact">Go to contact form</a>  
  <a href="#" class="cq_click_scrollTo-smooth-end_id-members">Go to members list</a>  
  
  <!-- Some other content ... -->  
  
  <div id="introduction">  
    This is the introduction!  
  </div>  
  
  <div id="contact">  
    This is a contact form.  
  </div>  
  
  <div class="members">  
    This is a list with all members.  
  </div>  
  ```