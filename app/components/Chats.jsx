"use client";
import { Timestamp, collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useChatContext } from "src/context/chatContext";
import { db } from "src/firebase/firebase";
import { RiSearch2Line } from "react-icons/ri";
import Avatar from "./Avatar";
import { useAuth } from "src/context/authContext";
import { formatDate } from "src/utils/helpers";

const Chats = () => {
  const {
    users,
    setUsers,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    dispatch,
  } = useChatContext();
  const [search, setSearch] = useState("");

  const { currentUser } = useAuth();

  const isBlockExecutedRef = useRef(false);
  const isUsersFetchedRef = useRef(false);

  useEffect(() => {
    onSnapshot(collection(db, "users"), (snapshot) => {
      const updatedUsers = {};
      snapshot.forEach((doc) => {
        updatedUsers[doc.id] = doc.data();
        console.log(doc.data());
      });
      setUsers(updatedUsers);
      if (!isBlockExecutedRef.current) {
        isUsersFetchedRef.current = true;
      }
    });
  }, []);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setChats(data);

          if (
            !isBlockExecutedRef.current &&
            isUsersFetchedRef.current &&
            users
          ) {
            const firstChat = Object.values(data).sort(
              (a, b) => b.date - a.date
            )[0];

            if (firstChat) {
              const user = users[firstChat?.userInfo?.uid];
              handleSelect(user);
            }
            isBlockExecutedRef.current = true;
          }
        } else {
          //doc doesnt exist
        }
      });
    };
    currentUser.uid && getChats();
  }, [isBlockExecutedRef.current, users]);

  const filteredChats = Object.entries(chats || {})
    .filter(
      ([, chat]) =>
        chat?.userInfo?.displayName
          .toLowerCase()
          .includes(search.toLocaleLowerCase()) ||
        chat?.lastMessage?.text
          .toLowerCase()
          .includes(search.toLocaleLowerCase())
    )
    .sort((a, b) => b[1].date - a[1].date);
  console.log(filteredChats);

  const handleSelect = (user, selectedChatId) => {
    setSelectedChat(user);
    dispatch({ type: "CHANGE_USER", payload: user });
  };
  return (
    <>
      <div className="flex flex-col w-[180px] md:w-[280px] ease-in-out duration-300 h-full">
        <div className="sticky shrink-0 -top-[20px] z-10 flex justify-center w-full bg-c2 py-3  text-c3 hover:text-white/80 focus:text-white/90 hover:font-semibold">
          <RiSearch2Line className="absolute z-10 top-[30px] md:top-7 left-6 md:left-5 text-[12.5px] md:text-[16px] duration-300" />
          <input
            type="text"
            placeholder="Search username.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 rounded-xl bg-[#23252b] focus:bg-c1/[0.5] pl-10 pr-5 placeholder:text-c3 placeholder:text-[13.5px] md:placeholder:text-[16px] placeholder:duration-300 hover:placeholder:text-white/80 focus:placeholder:text-white/90 hover:text-white/80 focus:text-white/90 outline-none text-base focus:font-semibold shadow-lg"
          />
        </div>
        <ul className="flex flex-col w-full my-5 gap-[5px]">
          {Object.keys(users || {}).length > 0 &&
            filteredChats?.map((chat) => {
              const timestamp = new Timestamp(
                chat[1].date.seconds,
                chat[1].date.nanoseconds
              );
              const date = timestamp.toDate();

              const user = users[chat[1].userInfo.uid];
              return (
                <li
                  key={chat[0]}
                  onClick={() => handleSelect(user, chat[0])}
                  className={`h-[70px] md:h-[70px] flex items-center gap-3 rounded-3xl hover:bg-c1 duration-700 shadow-md p-2 cursor-pointer ${
                    selectedChat?.uid === user.uid ? "bg-c1" : ""
                  }`}
                >
                  <div className="hidden md:flex ease-in-out duration-500">
                    <Avatar size="x-large" user={user} />
                  </div>
                  <div className="md:hidden ease-in-out duration-500">
                    <Avatar size="large" user={user} />
                  </div>
                  <div className="flex flex-col grow relative">
                    <span className="text-base text-white md:flex md:justify-between md:duration-500 items-center duration-300">
                      <div className="font-medium text-[14px] md:text-[15.5px] duration-300">
                        {user?.displayName}
                      </div>
                      <div className="text-c3 text-[12px] md:text-xs duration-300">
                        {formatDate(date)}
                      </div>
                    </span>
                    <p className="text-xs md:text-sm duration-300 text-c3 line-clamp-1 break-all">
                      {chat[1]?.lastMessage?.text ||
                        (chat[1]?.lastMessage?.img && ".img") ||
                        "send 1st msg"}
                    </p>
                    <span className="flex items-center justify-center text-[10px] absolute duration-300 top-[3.5rem] md:top-[3rem] -right-2 min-w-[13px] h-[13px] rounded-full bg-red-500">
                      3
                    </span>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default Chats;
