# MongoDB CRUD Operations Assignment

## 📚 Overview

This assignment demonstrates the fundamental **CRUD (Create, Read, Update, Delete)** operations in MongoDB using a `school` database and a `students` collection.

By completing this assignment, you learn how to:

* Create databases and collections
* Insert multiple documents
* Query documents using operators
* Sort records
* Update existing documents
* Delete documents
* Understand important MongoDB query operators

---

# 🏫 Database Setup

## Create Database

```javascript
use school
```

MongoDB automatically creates the database when data is inserted.

---

# 👨‍🎓 Create Students Collection

MongoDB automatically creates the collection when documents are inserted.

```javascript
db.students.insertMany([
  { name: "Ali", age: 18, city: "Karachi" },
  { name: "Ahmed", age: 22, city: "Sukkur" },
  { name: "Sara", age: 25, city: "Lahore" },
  { name: "Ayesha", age: 28, city: "Karachi" },
  { name: "Bilal", age: 19, city: "Hyderabad" },
  { name: "Usman", age: 30, city: "Sukkur" },
  { name: "Fatima", age: 21, city: "Karachi" },
  { name: "Hassan", age: 24, city: "Multan" },
  { name: "Zain", age: 27, city: "Karachi" },
  { name: "Mariam", age: 23, city: "Sukkur" }
])
```

---

# ➕ Create Operation (Insert)

## Insert Multiple Documents

```javascript
db.students.insertMany([...])
```

### Important Notes

* `insertOne()` inserts a single document.
* `insertMany()` inserts multiple documents.
* MongoDB automatically generates an `_id` field.

Example:

```javascript
{
  _id: ObjectId("..."),
  name: "Ali",
  age: 18,
  city: "Karachi"
}
```

---

# 🔍 Read Operations (Find)

## Find All Documents

```javascript
db.students.find()
```

---

## Find Age Greater Than 20

```javascript
db.students.find({
  age: { $gt: 20 }
})
```

### Operator Used

| Operator | Meaning      |
| -------- | ------------ |
| `$gt`    | Greater Than |

---

## Find Age Less Than 25

```javascript
db.students.find({
  age: { $lt: 25 }
})
```

### Operator Used

| Operator | Meaning   |
| -------- | --------- |
| `$lt`    | Less Than |

---

## Find Age Between 20 and 30

```javascript
db.students.find({
  age: {
    $gte: 20,
    $lte: 30
  }
})
```

### Operators Used

| Operator | Meaning               |
| -------- | --------------------- |
| `$gte`   | Greater Than or Equal |
| `$lte`   | Less Than or Equal    |

---

## Find Karachi or Sukkur Students

### Using `$in`

```javascript
db.students.find({
  city: {
    $in: ["Karachi", "Sukkur"]
  }
})
```

### Using `$or`

```javascript
db.students.find({
  $or: [
    { city: "Karachi" },
    { city: "Sukkur" }
  ]
})
```

### Operators Used

| Operator | Meaning               |
| -------- | --------------------- |
| `$in`    | Match values in array |
| `$or`    | OR condition          |

---

# 📊 Sorting Data

## Sort by Age (Ascending)

```javascript
db.students.find().sort({
  age: 1
})
```

---

## Sort by Age (Descending)

```javascript
db.students.find().sort({
  age: -1
})
```

---

## Sort by Name

```javascript
db.students.find().sort({
  name: 1
})
```

### Sorting Values

| Value | Meaning    |
| ----- | ---------- |
| `1`   | Ascending  |
| `-1`  | Descending |

---

# ✏️ Update Operations

## Update One Document

```javascript
db.students.updateOne(
  { name: "Ali" },
  {
    $set: {
      age: 20
    }
  }
)
```

---

## Update Multiple Documents

```javascript
db.students.updateMany(
  { city: "Karachi" },
  {
    $set: {
      city: "KHI"
    }
  }
)
```

---

## Understanding Update Results

### Successful Update

```javascript
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1
}
```

Meaning:

* Document found
* Document updated successfully

---

### No Matching Document

```javascript
{
  acknowledged: true,
  matchedCount: 0,
  modifiedCount: 0
}
```

Meaning:

* MongoDB could not find the document.

Example:

```javascript
db.students.updateOne(
  { name: "Ameer" },
  { $set: { age: 40 } }
)
```

If "Ameer" does not exist, nothing will be updated.

---

## Create If Not Found (Upsert)

```javascript
db.students.updateOne(
  { name: "Ameer" },
  { $set: { age: 40 } },
  { upsert: true }
)
```

### What Happens?

* If document exists → Update it.
* If document does not exist → Create it.

---

# ❌ Delete Operations

## Delete One Document

```javascript
db.students.deleteOne({
  name: "Ali"
})
```

---

## Delete Multiple Documents

```javascript
db.students.deleteMany({
  city: "Sukkur"
})
```

---

## Delete All Documents

```javascript
db.students.deleteMany({})
```

⚠️ Warning:

This removes **every document** from the collection.

---

# 🎯 Additional Useful Queries

## Find One Document

```javascript
db.students.findOne({
  name: "Ali"
})
```

---

## Count Documents

```javascript
db.students.countDocuments()
```

---

## Show Specific Fields

```javascript
db.students.find(
  {},
  {
    name: 1,
    age: 1,
    _id: 0
  }
)
```

---

## Limit Records

```javascript
db.students.find().limit(5)
```

---

## Skip Records

```javascript
db.students.find().skip(5)
```

---

## Pagination

```javascript
db.students.find()
  .skip(5)
  .limit(5)
```

---

# 🧠 Important MongoDB Operators

| Operator | Meaning               |
| -------- | --------------------- |
| `$gt`    | Greater Than          |
| `$lt`    | Less Than             |
| `$gte`   | Greater Than or Equal |
| `$lte`   | Less Than or Equal    |
| `$eq`    | Equal To              |
| `$ne`    | Not Equal To          |
| `$in`    | Value Exists In Array |
| `$nin`   | Value Not In Array    |
| `$or`    | OR Condition          |
| `$and`   | AND Condition         |
| `$set`   | Update Field Value    |

---

# 🚀 Developer Notes

### CRUD Stands For

| Letter | Meaning |
| ------ | ------- |
| C      | Create  |
| R      | Read    |
| U      | Update  |
| D      | Delete  |

---

### Most Frequently Used MongoDB Commands

```javascript
db.students.find()

db.students.findOne()

db.students.insertOne()

db.students.insertMany()

db.students.updateOne()

db.students.updateMany()

db.students.deleteOne()

db.students.deleteMany()

db.students.countDocuments()

db.students.find().sort()

db.students.find().limit()

db.students.find().skip()
```

---

# 📌 Key Takeaways

* MongoDB stores data as documents.
* Collections contain multiple documents.
* `insertMany()` is used for bulk insertion.
* Query operators help filter data efficiently.
* `sort()` organizes results.
* `updateOne()` modifies a single document.
* `updateMany()` modifies multiple documents.
* `deleteOne()` removes one document.
* `deleteMany()` removes multiple documents.
* `upsert` updates existing data or creates new data.
* Understanding CRUD operations is essential for every backend developer.

---

## 🎉 Assignment Completed

You have successfully practiced:

✅ Database Creation
✅ Collection Creation
✅ Insert Operations
✅ Query Operators
✅ Sorting
✅ Updating Documents
✅ Deleting Documents
✅ CRUD Fundamentals
✅ MongoDB Developer Basics
