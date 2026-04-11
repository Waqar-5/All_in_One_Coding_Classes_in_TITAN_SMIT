import "./Students.css";

function Students() {

  const students = [
    { id: 1, name: "Ali", age: 20, class: "10th" },
    { id: 2, name: "Sara", age: 19, class: "9th" },
    { id: 3, name: "Ahmed", age: 21, class: "11th" },
    { id: 4, name: "Zara", age: 22, class: "12th" }
  ];

  return (
    <div className="students-container">

      <h2 className="students-title">Students List</h2>

      <div className="students-grid">

        {students.map((student) => (
          <div className="student-card" key={student.id}>
            <h3>{student.name}</h3>
            <p>Age: {student.age}</p>
            <p>Class: {student.class}</p>
          </div>
        ))}

      </div>

    </div>
  );
}

export default Students;