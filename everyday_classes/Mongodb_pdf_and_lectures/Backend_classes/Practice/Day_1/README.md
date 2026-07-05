# ⭐ One extra tip that many beginners miss

> Don't try to memorize the code line by line. Instead, remember this universal API template:


- app.METHOD("/route", (req, res) => {

    // 1. Read data

    // 2. Validate data

    // 3. Perform the main logic

    // 4. Return a response

- });

# 📘 Express.js CRUD Practice (In-Memory Users API)

> A beginner-friendly guide to understanding how an Express server works using an in-memory array (`users`) instead of a database.

---

# 📑 Table of Contents

1. Project Goal
2. What We Built
3. Project Flow
4. HTTP Methods
5. Route Breakdown
6. Express Concepts
7. req vs res
8. req.body vs req.params vs req.query
9. Why express.json()?
10. Why users Array?
11. Registration Flow
12. Get Users Flow
13. Delete User Flow
14. JavaScript Methods Used
15. HTTP Status Codes
16. Important Express Patterns
17. Code Reading Strategy
18. Common Interview Questions
19. Common Mistakes
20. How to Remember Everything

---

# 🎯 Project Goal

Build a simple REST API that can

- Register a user
- View all users
- Delete a user

without using any database.

Instead of MongoDB, we store data inside a JavaScript array.

---

# 🏗 What We Built

```
Client
   │
   ▼
Express Server
   │
   ▼
users Array
```

Our server performs CRUD operations on an array.

---

# 📂 Project Flow

```
User Sends Request
        │
        ▼
Express Receives Request
        │
        ▼
Route Executes
        │
        ▼
Validation
        │
        ▼
Business Logic
        │
        ▼
Send Response
```

Every route follows this same pattern.

---

# 🌐 HTTP Methods

## GET

Used to READ data.

Example

```
GET /users
```

---

## POST

Used to CREATE data.

Example

```
POST /register
```

---

## DELETE

Used to REMOVE data.

Example

```
DELETE /users/1
```

---

# 🛣 Routes

## POST /register

Registers a new user.

Flow

```
Receive Body
      │
      ▼
Validate
      │
      ▼
Check Duplicate Email
      │
      ▼
Create User
      │
      ▼
Push Into Array
      │
      ▼
Return Success
```

---

## GET /users

Returns all users.

```
users
   │
   ▼
Send JSON
```

---

## DELETE /users/:id

Deletes one user.

```
Read ID
    │
    ▼
Find Index
    │
    ▼
Found?
 │        │
No       Yes
 │        │
404     Remove User
 │        │
 ▼        ▼
Stop   Return Success
```

---

# ⚙ Express Concepts

## const express = require("express")

Imports Express into your project.

Think of Express as the engine of your server.

---

## const app = express()

Creates your Express application.

Everything starts from **app**.

Examples

```
app.get()

app.post()

app.delete()

app.listen()
```

---

## app.listen()

Starts the server.

```
app.listen(PORT)
```

means

Start listening for requests.

---

# 📦 app.use(express.json())

One of the MOST IMPORTANT lines.

```
app.use(express.json());
```

Without it

```
req.body
```

is

```
undefined
```

Express cannot understand JSON by default.

This middleware converts

```
{
"name":"Waqar"
}
```

into

```js
req.body
```

---

# 📦 users Array

```
const users = [];
```

Acts like a fake database.

Normally this would be

- MongoDB
- MySQL
- PostgreSQL

But for learning, we use an array.

---

# 📨 req vs res

## req

Means Request.

Contains everything sent by the client.

Examples

```
req.body

req.params

req.query

req.headers
```

---

## res

Means Response.

Used to send data back.

Examples

```
res.send()

res.json()

res.status()
```

---

# 📦 req.body

Contains data sent inside the request body.

Example

```
POST /register
```

Body

```json
{
"name":"Waqar",
"email":"abc@gmail.com"
}
```

Then

```
req.body
```

becomes

```js
{
name:"Waqar",
email:"abc@gmail.com"
}
```

---

# 📦 req.params

Contains values from URL.

Example

```
DELETE /users/5
```

Then

```
req.params.id
```

equals

```
5
```

---

# 📦 req.query

Contains values after ?

Example

```
GET /users?page=2
```

Then

```
req.query.page
```

equals

```
2
```

---

# 🔎 Validation

```
if(!name || !email || !password)
```

Purpose

Prevent empty data.

If validation fails

Return immediately.

---

# ❓ Why return?

```
return res.status(...)
```

Stops the function.

Otherwise JavaScript keeps executing.

---

# 🔍 find()

```
users.find(...)
```

Returns

The object.

Example

```
[
{id:1},
{id:2}
]
```

Searching id=2

Returns

```
{id:2}
```

---

# 🔍 findIndex()

Returns

Position.

Example

```
Index

0

1

2
```

Searching id=2

Returns

```
1
```

Used before splice().

---

# ✂ splice()

Removes items from an array.

```
splice(index, howMany)
```

Example

```
users.splice(1,1)
```

Means

Start at index 1

Delete 1 item.

---

# 📌 Why deletedUser[0]?

splice()

Always returns an array.

Example

```
[
{
id:2,
name:"Ahmed"
}
]
```

First element

```
deletedUser[0]
```

returns the object.

---

# 🔄 Number()

```
Number(req.params.id)
```

Why?

Because

```
req.params.id
```

is always a string.

```
"5"
```

Users contain numbers

```
5
```

Need conversion before comparison.

---

# 📊 HTTP Status Codes

200

Everything OK.

---

201

Successfully Created.

---

400

Bad Request.

Usually validation errors.

---

401

Unauthorized.

---

403

Forbidden.

---

404

Resource Not Found.

---

500

Internal Server Error.

---

# 💡 JavaScript Features Used

## Destructuring

```js
const {name,email,password}=req.body;
```

Instead of

```js
req.body.name

req.body.email

req.body.password
```

---

## Arrow Function

```
(user)=>user.email===email
```

Same as

```js
function(user){

return user.email===email;

}
```

---

## Array Methods

find()

Returns object.

---

findIndex()

Returns index.

---

push()

Adds new item.

---

splice()

Deletes item.

---

length

Returns total elements.

---

# 🔑 Important Express Pattern

Almost every route follows this structure.

```
Receive Request
      │
      ▼
Read Data
      │
      ▼
Validate
      │
      ▼
Process Logic
      │
      ▼
Return Response
```

Remember this forever.

---

# 🧠 How to Read Any Express Route

Whenever you see a route ask yourself

### 1

Which HTTP Method?

GET?

POST?

DELETE?

PUT?

---

### 2

Which URL?

```
/users

/users/:id

/register
```

---

### 3

Where is the data coming from?

```
req.body

or

req.params

or

req.query
```

---

### 4

Validation?

Check missing data.

---

### 5

Business Logic?

Find?

Create?

Delete?

Update?

---

### 6

Response?

```
res.json()

res.send()

res.status()
```

---

# 🚨 Common Mistakes

❌ Forgetting express.json()

Result

```
req.body

undefined
```

---

❌ Using

```
|
```

instead of

```
||
```

---

❌ Forgetting return after error response.

---

❌ Comparing

```
5==="5"
```

without Number().

---

❌ Using

```
find()
```

instead of

```
findIndex()
```

before splice().

---

# 🎯 Easy Way To Remember

Think of every API as answering these six questions:

```
1. What request came?

↓

2. Where is the data?

↓

3. Is the data valid?

↓

4. What work should I do?

↓

5. Was it successful?

↓

6. What response should I send?
```

If you can answer these six questions, you can understand almost every Express route.

---

# 📌 Final Formula (Must Remember)

```
Request
   │
   ▼
req
   │
   ▼
Validation
   │
   ▼
Business Logic
   │
   ▼
Response
   │
   ▼
res
```

This is the foundation of Express.js.

Master this pattern first, and learning MongoDB, Mongoose, authentication, JWT, and full REST APIs will become much easier.