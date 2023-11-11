"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "src/context/authContext";
import { useChatContext } from "src/context/chatContext";
import Loader from "./components/Loader";
import LeftNav from "./components/LeftNav";
import Chats from "./components/Chats";
import Chat from "./components/Chat";

const page = () => {
  const router = useRouter();
  const { signOut, currentUser, isLoading } = useAuth();
  const { data } = useChatContext();
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/form/login");
    }
  }, [currentUser, isLoading]);

  return !currentUser ? (
    <Loader />
  ) : (
    <>
      <div className="bg-c1 flex h-[100vh]">
        <div className="flex w-full shrink-0">
          {/* <div className="md:flex hidden"> */}
          <LeftNav />
          {/* </div> */}
          <div className="flex bg-c2 grow">
            <div className="w-400px] duration-300 px-3 overflow-auto scrollbar shrink-0 border-r border-white/[0.05]">
              <div className="flex flex-col h-full">
                <Chats />
              </div>
            </div>
            {data.user && <Chat />}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
