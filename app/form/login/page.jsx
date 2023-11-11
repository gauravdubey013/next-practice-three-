"use client";

import Link from "next/link";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";
import { auth } from "src/firebase/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useAuth } from "src/context/authContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ToastMessage from "src/app/components/ToastMessage";
import { toast } from "react-toastify";
import Loader from "src/app/components/Loader";

const gProvider = new GoogleAuthProvider();

const Login = () => {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();
  const [email, setEmail] = useState("");

  const onChangeEmail = (e) => setEmail(e.target.value);

  const resetPassword = async () => {
    try {
      toast.promise(
        async () => {
          await sendPasswordResetEmail(auth, email);
        },
        {
          pending: "Genrating reset password link!",
          success: "Reset password has sended to your registered email!",
          error: "You may have entered wrong Email-ID!",
        },
        {
          autoClose: 5000,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isLoading && currentUser) {
      // user is logged in!
      router.push("/");
    }
  }, [currentUser, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, gProvider);
    } catch (error) {
      console.error(error);
    }
  };

  return isLoading || (!isLoading && currentUser) ? (
    <Loader />
  ) : (
    <>
      <div className="h-[100vh] w-full px-5 flex justify-center items-center bg-c1">
        <ToastMessage />
        <div className="flex items-center justify-center p-[1px] rounded-md w-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 scale-75 md:scale-100 duration-300 ease-in-out">
          <div className="flex w-full h-full items-center flex-col bg-c1 p-10 rounded-md">
            <div className="text-center">
              <div className="text-4xl font-bold text-white/95">
                Login to Ur Acc
              </div>
              <div className="mt-3 text-c3">
                Connect and Chat with anyone, anywhere!
              </div>
            </div>
            <div className="flex items-center gap-2 w-full mt-10 mb-3">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[0.5px]">
                <div
                  onClick={signInWithGoogle}
                  className="flex items-center justify-center gap-3 text-[#fff]/80 hover:text-[#fff] font-semibold bg-c1 w-full h-full rounded-md "
                >
                  <IoLogoGoogle size={24} />
                  <span className="text">Sign in with Google</span>
                </div>
              </div>
              <div className="bg-gradient-to-r to-indigo-500 via-purple-500 from-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[.5px]">
                <Link
                  href={"/form/login"}
                  className="flex items-center justify-center gap-3 text-[#fff]/80 hover:text-[#fff] font-semibold bg-c1 w-full h-full rounded-md "
                >
                  <IoLogoFacebook size={24} />
                  <span className="text">Sign in with Facebook</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="w-5 h-[1px] bg-c3"></span>
              <span className="text-c3 font-semibold">OR</span>
              <span className="w-5 h-[1px] bg-c3"></span>
            </div>
            <form
              className="flex flex-col items-center gap-3 mt-3 w-[500px]"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                onChange={onChangeEmail}
                className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3 placeholder:hover:text-white/80 placeholder:focus:text-white/90 focus:text-white"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3 placeholder:hover:text-white/80 placeholder:focus:text-white/90 focus:text-white"
              />
              <div className="text-right w-full text-c3">
                <div
                  onClick={resetPassword}
                  className="cursor-pointer hover:text-white/60"
                >
                  Forgot password?
                </div>
              </div>
              {/* <Link href={"/form/login"} className="w-full"> */}
              <button
                type="submit"
                className="mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              >
                Login
              </button>
              {/* </Link> */}
            </form>

            <div className="flex gap-1 justify-center text-c3 mt-5">
              <span className="hover:text-white/70">New User?</span>
              <Link
                className="cursor-pointer font-semibold text-[#fff]/80 hover:text-[#fff]"
                href={"/form/register"}
              >
                <span className="underline underline-offset-2">Register</span>{" "}
                <span className="underline underline-offset-2">Now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
