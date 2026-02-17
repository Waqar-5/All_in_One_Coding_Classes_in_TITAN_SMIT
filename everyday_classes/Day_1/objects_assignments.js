// Assignments

let student = {
    name: "Khan",
    age: 22,
    city: "Sukkur"
}

// using dot notation
console.log(student.name);
// using bracket notation
console.log(student["city"]);


console.log("****************************************************************");

let employees = [
    {
        name: "Meer",
        department: "Frontend Developer",
        salary: 50000

     },
     {
        name: "Khan",
        department: "UI/UX Designer",
        salary: 50000

     },
     {
        name: "Asad",
        department: "AI Developer",
        salary: 200000

     },
]

// dispaly second employee name
console.log(employees[1].name);

// third employee salary
console.log(employees[2].salary);


console.log("*********************************************************");

let product = {
    title: "Wireless Headphones",
    price: 2999,
    category: "Electronics"
}


// using loop to display keys and values of proudct object 
for (let keys in product){
    console.log(keys + ": " + product[keys]);
    
}


console.log("**************************************************");
// Q4: 
let user = {
    name: "Ameer",
    email: "ameer@gmail.com",
    skills: ["HTML", "CSS", "JavaScript", "Python"]
}

// first skill displayed dynamically
console.log(user.skills[0]);

// last skill displayed dynamically(here how many arrays contain skill we can last one so easily this way)
console.log(user.skills[user.skills.length - 1]);


console.log("********************************************************************");


// Q5
let car = {
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    color: "White",
}

const keys = Object.keys(car)

// all keys
console.log("keys: ", keys);

// total properties
console.log("Total properties: ", keys.length);


console.log("**********************************************************");
// Q6
let book = {
    title: "Who Moved My Cheese",
    author: "Dr. Spencer Johnson",
    price: 400,
}

let obj = Object.values(book)

// all values displayed using loop
for(let values of obj){
    console.log("All values: ", values);
    
}



console.log("******************************************");
let order = {
    orderId: 1,
    customerName: "Sameer Ali",
    totallAmount: 1200
}

// converting 
let convertObjToJson = JSON.stringify(order)

console.log(convertObjToJson);


console.log("********************************************************");

// Q8 

let students = [
    {name: "Asad Ali", marks: 90},
    {name: "Ameer Ali", marks: 80},
    {name: "Wajid", marks: 70},
]

// display All students
console.log("All Students: ");

students.forEach(student => {
    console.log(student.name + " - " + student.marks);
});


// Filteration of studnets scoring above 80
let topStudents = students.filter(student => student.marks > 80)


console.log("Above 80 marks carried students: ");
topStudents.forEach(student => {
    console.log(student.name + " - " + student.marks);
})


console.log("*****************************************************");

// Q9
let company = {
    companyName: "learn and Earn",
    location: "Not avaliable Physically",
    employees: [
        {name: "Khan", position: "Designer"},
        {name: "Meer", position: "Programmer"},
        {name: "Waqar", position: "CEO"}
    ]
};

// display company name
console.log("Company Name: ", company.companyName);

// display All employees
console.log("Employees: ");
company.employees.forEach(employee => {
    console.log(employee.name)
})


console.log("**********************************************************************");
// Q10 
let products = [
    {id: 1, name: "Laptop", price: 50000, stock: 10},
    { id: 2, name: "Phone", price: 500, stock: 0 },
    { id: 3, name: "Tablet", price: 300, stock: 5 },
    { id: 4, name: "Headphones", price: 100, stock: 0 },

]


// display prouct names
console.log("Products Names: ");
products.forEach(product => {
    console.log(product.name);
})


// count all products
console.log("Total Products: " + products.length);


// Convert to JSON
let productsJSON = JSON.stringify(products);
console.log("Products in JSON format:");
console.log(productsJSON);

// Show out-of-stock products
let outOfStock = products.filter(product => product.stock === 0);

console.log("Out of Stock Products:");
outOfStock.forEach(product => {
    console.log(product.name);
});