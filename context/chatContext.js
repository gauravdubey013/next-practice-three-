"use client";

import { useAuth } from "./authContext";

const { createContext, useContext, useState, useReducer } = require("react");

const chatContext = createContext();

export const ChateContextProvider = ({ children }) => {
  const [users, setUsers] = useState(false); //1st lvl
  const [chats, setChats] = useState([]); //2nd lvl
  const [selectedChat, setSelectedChat] = useState(null); //3rd lvl

  const { currentUser } = useAuth();
  const INITIAL_STATE = { chatId: "", user: null };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };
      case "EMPTY":
        return INITIAL_STATE;

      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  return (
    <chatContext.Provider
      value={{
        users,
        setUsers,
        data: state,
        dispatch,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};

export const useChatContext = () => useContext(chatContext);
