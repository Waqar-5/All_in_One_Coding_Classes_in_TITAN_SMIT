function Greeting({ name, city }) {
  return (
    < >
    <div className="Greetings">
        
      <h1>{`Welcome, ${name}!`}</h1>
      <p>{`You are visiting from ${city}.`}</p>
    </div>
    </>
  );
}
export default Greeting;
