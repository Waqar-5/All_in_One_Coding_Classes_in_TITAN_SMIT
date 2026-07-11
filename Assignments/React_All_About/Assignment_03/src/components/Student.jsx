    import React from "react";

function Student(props) {
  return (
    <div>
      <h2>Student Details</h2>
      <p>Name: {props.name}</p>
      <p>Age: {props.age}</p>
      <p>Class: {props.className}</p>
    </div>
  );
}

export default Student;