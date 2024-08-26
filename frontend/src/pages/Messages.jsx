import { useState, useEffect } from "react";
import axios from "axios";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SingleMessage from "@/components/SingleMessage";
import Message from "@/components/Message";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();
  const [re, setRe] = useState(0);
  const [userData, setUserData] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState(null);
  const [content, setContent] = useState("");
  const [portalId, setPortalId] = useState("");
  const [sentMessageInfo, setSentMessageInfo] = useState({
    chatId: "",
    senderId: "",
    senderType: "",
    reciverId: "",
    reciverType: "",
    content: "",
  });

  const isClient = userData
    ? userData.isLoggedIn && userData.userInfo.isClient
    : null;

  const clientId = userData
    ? userData.isLoggedIn && userData.userInfo.userData.Client_ID
    : null;

  const freelancerId = userData
    ? userData.isLoggedIn && userData.userInfo.userData.Freelancer_ID
    : null;

  console.log(isClient);
  console.log(clientId);
  console.log(freelancerId);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8800/check")
      .then((res) => {
        console.log(res.data);
        setUserData(res.data);
        if (!res.data.isLoggedIn) {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (isClient) {
      axios
        .get(`http://localhost:8800/api/message/client-chat/${clientId}`)
        .then((res) => {
          console.log(res.data);
          setChatList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(
          `http://localhost:8800/api/message/freelancer-chat/${freelancerId}`
        )
        .then((res) => {
          console.log(res.data);
          setChatList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [clientId, freelancerId, isClient]);

  const handleMessages = (chatId, clientId, freelancerId) => {
    setPortalId(chatId);
    console.log(chatId, clientId, freelancerId);
    if (isClient) {
      setSentMessageInfo({
        chatId: chatId,
        senderId: clientId,
        senderType: "client",
        reciverId: freelancerId,
        reciverType: "freelancer",
        content: "",
      });
    } else {
      setSentMessageInfo({
        chatId: chatId,
        senderId: freelancerId,
        senderType: "freelancer",
        reciverId: clientId,
        reciverType: "client",
        content: "",
      });
    }
    axios
      .get(`http://localhost:8800/api/message/get-chat-messages/${chatId}`)
      .then((res) => {
        if (res.data.length !== 0) {
          console.log(res.data.length);
          setMessages(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    setContent(e.target.value);
    console.log(content);
    setSentMessageInfo({ ...sentMessageInfo, content: content });
    console.log(sentMessageInfo);
  };

  const handleSend = () => {
    if (!content) {
      setRe(re + 1);
      return;
    }

    axios
      .post(`http://localhost:8800/api/message/send-message`, sentMessageInfo)
      .then((res) => {
        console.log(res.data);
        axios
          .get(
            `http://localhost:8800/api/message/get-chat-messages/${portalId}`
          )
          .then((res) => {
            console.log(res.data);
            setMessages(res.data);
            setContent("");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full min-h-[500px] rounded-lg border "
      >
        <ResizablePanel defaultSize={20}>
          <div className="flex flex-col">
            {chatList.length !== 0 ? (
              chatList.map((chat, index) => {
                return (
                  <div key={index}>
                    <button
                      onClick={() => {
                        handleMessages(
                          chat.MessagePortal_ID,
                          chat.Client_ID,
                          chat.Freelancer_ID
                        );
                      }}
                      className="text-left"
                    >
                      <SingleMessage
                        messagePortalId={chat.MessagePortal_ID}
                        clientId={chat.Client_ID}
                        freelancerId={chat.Freelancer_ID}
                        profilePic={chat.Profile_Picture}
                        firstName={chat.FirstName}
                        lastName={chat.LastName}
                      />
                    </button>
                  </div>
                );
              })
            ) : (
              <>
                <div className="min-h-[70vh]">
                  <div className="flex flex-col w-[98%] mx-auto shadow-sm shadow-slate-400 rounded-md p-4 m-4">
                    No created chats.
                  </div>
                </div>
              </>
            )}

            {/* <SingleMessage />
            <SingleMessage />
            <SingleMessage /> */}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70} className="overflow-y-scroll">
          <div className="flex flex-col justify-end h-full bg-slate-100 p-6">
            {/* Messages */}
            <div className="min-w-[600px]">
              {messages ? (
                messages.map((message, index) => {
                  return (
                    <div key={index}>
                      <Message
                        isClient={isClient}
                        content={message.Content}
                        senderType={message.Sender_Type}
                      />
                    </div>
                  );
                })
              ) : (
                <>
                  <div>select a chat</div>
                </>
              )}
            </div>
            <div className="flex gap-x-4 justify-center items-end">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="message-2">Your Message</Label>
                <Textarea
                  key={re}
                  onChange={handleChange}
                  name="content"
                  value={content}
                  placeholder="Type your message here."
                  id="message-2"
                />
              </div>
              <Button
                onClick={() => {
                  handleSend();
                }}
                className="bg-blue-500 rounded-md items-end"
              >
                Send
              </Button>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Messages;
