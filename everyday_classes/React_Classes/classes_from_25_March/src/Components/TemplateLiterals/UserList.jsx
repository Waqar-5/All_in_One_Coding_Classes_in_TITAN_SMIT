const users = [
  { id: 1, name: "Ali", city: "Karachi" },
  { id: 2, name: "Ahmed", city: "Lahore" },
  { id: 3, name: "Sara", city: "Islamabad" },
];
function UserList() {
  return (
   <div className="UserList">
     <ul>
      {users.map((user) => (
        <li key={user.id}>{`${user.name} — ${user.city}`}</li>
      ))}
    </ul>
   </div>
  );
}
export default UserList;
