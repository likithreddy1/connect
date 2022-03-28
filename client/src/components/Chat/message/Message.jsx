import "./message.css";
import { format } from "timeago.js";
import { Avatar } from "@material-ui/core";
export default function Message({ own,message,user,userFriend }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <Avatar
          className="messageImg"
          src={own?user?.profilepic ? PF + "images/" + user?.profilepic : PF + "images/noAvatar.png":userFriend?.profilepic ? PF + "images/" + userFriend?.profilepic : PF + "images/noAvatar.png"}
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}