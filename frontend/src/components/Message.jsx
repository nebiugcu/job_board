import React from "react";

const Message = ({ isClient, content, senderType }) => {
  let chatPosition;
  let chatType;
  if (isClient) {
    if (senderType === "client") {
      chatPosition = "chat-end";
      chatType = "chat-bubble-primary";
    } else {
      chatPosition = "chat-start";
      chatType = "chat-bubble-success";
    }
  } else {
    if (senderType === "freelancer") {
      chatPosition = "chat-end";
      chatType = "chat-bubble-primary";
    } else {
      chatPosition = "chat-start";
      chatType = "chat-bubble-success";
    }
  }
  console.log(content);
  console.log("nahom");
  console.log(senderType);
  return (
    <div>
      <div className={`chat ${chatPosition}`}>
        <div className={`chat-bubble ${chatType} text-white`}>{content}</div>
      </div>
    </div>
  );
};

export default Message;
