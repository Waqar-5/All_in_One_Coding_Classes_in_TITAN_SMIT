# C# DOM (Document Object Model) Assignment

## Part 1 -- Conceptual Questions

### Q1. What is DOM?

**Answer:**\
DOM (Document Object Model) is a **map of your webpage**. It shows all
HTML elements (headings, paragraphs, buttons) as **objects in a tree**.

JavaScript uses the DOM to **find elements** and **change them
dynamically**.

**Example**

``` javascript
document.getElementById("myPara").innerText = "Hello World";
```

**Real-life idea:**\
DOM is like a **family tree of elements**, and JavaScript is the **hand
that can move or change them**.

------------------------------------------------------------------------

### Q2. What is DOM Tree Structure?

**Answer:**\
DOM organizes HTML elements in a **tree structure**:

**Parent → Child → Sibling**

Example structure:

    HTML
    ├── Head
    │   └── Title
    └── Body
        ├── H1
        └── P

**Parent:** Element that contains other elements\
Example: `Body` is parent of `H1` and `P`

**Child:** Element inside another element\
Example: `H1` is child of `Body`

**Sibling:** Elements with the same parent\
Example: `H1` and `P` are siblings

**Real-life idea:** Like a **family tree**.

------------------------------------------------------------------------

### Q3. Difference between `querySelector()` and `querySelectorAll()`

  -------------------------------------------------------------------------------------------------
  Method                 What it does      Returns           Example
  ---------------------- ----------------- ----------------- --------------------------------------
  `querySelector()`      Finds first       Single element    `document.querySelector(".text")`
                         matching element                    

  `querySelectorAll()`   Finds all         NodeList          `document.querySelectorAll(".text")`
                         matching elements                   
  -------------------------------------------------------------------------------------------------

**Real-life idea:**

`querySelector()` → calling **one student**

`querySelectorAll()` → calling **all students in a class**

------------------------------------------------------------------------

### Q4. Difference between DOM Selection Methods

  -----------------------------------------------------------------------------------------------------------------------
  Method                       Meaning        Returns          Example                                     Real-life Idea
  ---------------------------- -------------- ---------------- ------------------------------------------- --------------
  `getElementById()`           Select element Single element   `document.getElementById("title")`          Like a unique
                               by ID                                                                       ID card

  `getElementsByClassName()`   Select         HTMLCollection   `document.getElementsByClassName("text")`   All students
                               elements by                                                                 in same
                               class                                                                       section

  `getElementsByTagName()`     Select         HTMLCollection   `document.getElementsByTagName("p")`        All books of
                               elements by                                                                 same type
                               tag                                                                         
  -----------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

### Q5. Difference between DOM Properties / Methods

  --------------------------------------------------------------------------------------
  Property / Method Purpose           Example                          Real-life Idea
  ----------------- ----------------- -------------------------------- -----------------
  `innerHTML`       Text + HTML       `p.innerHTML = "<b>Hello</b>"`   Decorating a room

  `innerText`       Visible text only `p.innerText = "Hello"`          Writing plain
                                                                       text on a
                                                                       whiteboard

  `textContent`     All text content  `p.textContent = "Hello"`        Reading
                                                                       everything in a
                                                                       notebook

  `append()`        Add element or    `ul.append(li)`                  Add student at
                    text at end                                        end of list

  `appendChild()`   Add new child     `ul.appendChild(li)`             Place book at end
                    element                                            of shelf
  --------------------------------------------------------------------------------------
