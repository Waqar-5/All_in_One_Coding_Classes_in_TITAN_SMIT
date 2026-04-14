// User data
const name = "Ali";
const age = 22;
const city = "Karachi";
// OLD WAY (string concatenation — not recommended)
const oldMessage = "My name is " + name + " and I am " + age + " years old.";
console.log(oldMessage);
// TEMPLATE LITERALS (modern way)
const newMessage = `My name is ${name} and I am ${age} years old.`;
console.log(newMessage);
// Expression inside template literal
const calculation = `Next year age will be ${age + 1}`;
console.log(calculation);
// Multi-line string
const address = `Name: ${name}
City: ${city}
Age: ${age}`;
console.log(address);
// Function using template literal
function greet(userName) {
return `Hello ${userName}, welcome!`;
}
console.log(greet("Ahmed"));