# What are classQueries?

classQueries are basically class-attributes that trigger DOM changes on the page.

## Structure

classQueries always consist of 4 parts.  
Each part is separated with an underscore \(\_\).

These are the different parts:

### 1st part - "cq"

An indicator that the class is a classQuery. Always "cq"!

### 2nd part - **EVENT**

The event that triggers the classQuery.  
Example: 'click'  
Look [here](https://github.com/Skayo/classQuery/tree/fbc9d95f287311cbc4828843fddc0f5b2aa75d99/Events/README.md) for more info!

### 3rd part - **ACTION**

The action that the classQuery fulfills.  
Example: 'hide'  
The action-part is special: It's the most important part of the classQuery, and therefore it needs arguments!  
Each argument is separated with a hyphen \(-\).  
Example: 'addClass-hidden' &lt;- Adds the class ".hidden"  
For more info about arguments and actions, look [here](https://github.com/Skayo/classQuery/tree/fbc9d95f287311cbc4828843fddc0f5b2aa75d99/Actions/README.md)!

### 4th part - **SELECTOR**

The element where the action happens.  
Example: 'id-veryImportantLink'  
Look [here](https://github.com/Skayo/classQuery/tree/fbc9d95f287311cbc4828843fddc0f5b2aa75d99/Selectors/README.md) for more info!

## Examples

* Hide an element on button click:
  ```html
  <button class="cq_click_hide_id-example">Hide #example</button>
  
  <p id="example">This element vanishes when you press the button above!</p>
  ```

- Add a class to an element when the finished loading:
  ```html
  <p class="cq_init_hide_self">This element is never visible!</p>
  ```

* Smoothly scroll to different parts of the website:
  ```html
  <a href="#" class="cq_click_scrollIntoView-smooth_id-introduction">Go to introduction</a>
  <a href="#" class="cq_click_scrollIntoView-smooth_id-contact">Go to contact form</a>
  <a href="#" class="cq_click_scrollIntoView-smooth_id-members">Go to members list</a>
  
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

* More examples coming soon!

