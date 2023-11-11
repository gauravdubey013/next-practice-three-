import React from "react";

const ChatMenu = () => {
  return (
    <>
      <div className="w-auto absolute top-[70px] right-5 bg-c0 z-10 rounded-md overflow-hidden">
        <ul className="flex flex-col">
            <li className="flex items-center py-3 px-5 hover:bg-black cursor-pointer">Block User</li>
            <li className="flex items-center py-3 px-5 hover:bg-black cursor-pointer">Delete User</li>
        </ul>
      </div>
    </>
  );
};

export default ChatMenu;
