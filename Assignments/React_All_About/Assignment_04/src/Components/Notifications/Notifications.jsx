import "./Notifications.css";

function Notifications(){

  const hasUnread = true;

  return(

  <div className="notification-container">

  <h2>Notifications</h2>

  {hasUnread && (
  <p className="alert">
  🔔 You have unread notifications!
  </p>
  )}

  </div>

  )

}

export default Notifications;