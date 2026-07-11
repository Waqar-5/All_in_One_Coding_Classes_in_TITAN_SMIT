import img1 from "../assets/image1.jpg"
const About = () => {
  return (
    <div className="container">
      <h2>About Us</h2>
      <p>We are passionate developers building modern web apps.</p>

      {/* <img 
        src="https://picsum.photos/300/200"
        className="about-img"
      /> */}

        <img         className="about-img"
 src={img1} alt="my image" />

      <p style={{ marginTop: "20px" }}>
        This project demonstrates React routing, reusable components,
        and clean UI design.
      </p>
    </div>
  );
};

export default About;