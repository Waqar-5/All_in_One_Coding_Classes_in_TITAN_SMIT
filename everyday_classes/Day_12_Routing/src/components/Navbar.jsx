import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <NavLink to="/" style={styles.link}>Home</NavLink>
      <NavLink to="/about" style={styles.link}>About</NavLink>
      <NavLink to="/product/1" style={styles.link}>Product</NavLink>

      {isLoggedIn && (
        <NavLink to="/dashboard" style={styles.link}>
          Dashboard
        </NavLink>
      )}

      {!isLoggedIn ? (
        <NavLink to="/login" style={styles.link}>
          Login
        </NavLink>
      ) : (
        <button onClick={handleLogout} style={styles.button}>
          Logout
        </button>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    gap: "15px",
    padding: "10px",
    background: "#222",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  button: {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};


// // =============================
// // 📁 components/Navbar.jsx
// // =============================
// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav style={{ display: "flex", gap: "10px" }}>
//       <Link to="/">Home</Link>
//       <Link to="/about">About</Link>
//       <Link to="/product/1">Product</Link>
//       <Link to="/dashboard">Dashboard</Link>
//       <Link to="/login">Login</Link>
//     </nav>
//   );
// }


// // import { Link } from "react-router-dom";
// // function Navbar(){
// //   return (
// //     <>
// //       <nav>
// //         <Link to="/">Home    -----    </Link>
      
// //         <Link to="/about">About ---- </Link> 

// //         <Link to="/contact">Contact</Link> 
// //       </nav>
// //     </>
// //   )
// // }
// // export default Navbar;