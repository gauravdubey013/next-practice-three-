"use client";
import Link from "next/link";
import { useEffect } from "react";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";
import {
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useAuth } from "src/context/authContext";
import { auth, db } from "src/firebase/firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { profileColors } from "src/utils/constants";
import Loader from "src/app/components/Loader";

const gProvider = new GoogleAuthProvider();

const Register = () => {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && currentUser) {
      // user is logged in!
      router.push("/");
    }
  }, [currentUser, isLoading]);
  const signUpWithGoogle = async () => {
    try {
      await signInWithPopup(auth, gProvider);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName,
        email,
        color: profileColors[colorIndex],
      });

      await setDoc(doc(db, "userChats", user.uid), {});
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const colorIndex = Math.floor(Math.random() * profileColors.length);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        // username,
        email,
        password
      );

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName,
        email,
        color: profileColors[colorIndex],
      });

      await setDoc(doc(db, "userChats", user.uid), {});

      await updateProfile(user, {
        // username,
        displayName,
      });
      console.log(user);

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return isLoading || (!isLoading && currentUser) ? (
    <Loader />
  ) : (
    <>
      <div className="h-[100vh] w-full flex justify-center items-center bg-c1">
        <div className="flex items-center justify-center p-[1px] rounded-md w-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 scale-75 md:scale-100 duration-300 ease-in-out">
          <div className="flex w-full h-full items-center flex-col bg-c1 p-10 rounded-md">
            <div className="text-center">
              <div className="text-4xl font-bold">Create New Account</div>
              <div className="mt-3 text-c3">
                Connect and Chat with anyone, anywhere!
              </div>
            </div>
            <div className="flex items-center gap-2 w-full mt-10 mb-3">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[0.5px]">
                <div
                  onClick={signUpWithGoogle}
                  className="flex items-center justify-center gap-3 text-[#fff]/80 hover:text-[#fff] font-semibold bg-c1 w-full h-full rounded-md"
                >
                  <IoLogoGoogle size={24} />
                  <span className="text">Sign up with Google</span>
                </div>
              </div>
              <div className="bg-gradient-to-r to-indigo-500 via-purple-500 from-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[.5px]">
                <Link
                  href={"/form/register"}
                  className="flex items-center justify-center gap-3 text-[#fff]/80 hover:text-[#fff] font-semibold bg-c1 w-full h-full rounded-md"
                >
                  <IoLogoFacebook size={24} />
                  <span className="text">Sign up with Facebook</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="w-5 h-[1px] bg-c3"></span>
              <span className="text-c3 font-semibold">OR</span>
              <span className="w-5 h-[1px] bg-c3"></span>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-3 mt-3 w-[500px]"
            >
              <input
                type="text"
                // name="Username"
                placeholder="Username"
                className="w-full h-14 bg-c5 focus:bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-pink-500/40 focus:duration-1000 rounded-xl outline-none border-none px-5 text-c3 placeholder:hover:text-white/80 placeholder:focus:text-white/90 focus:text-white"
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3 placeholder:hover:text-white/80 placeholder:focus:text-white/90 focus:text-white"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3 placeholder:hover:text-white/80 placeholder:focus:text-white/90 focus:text-white"
              />
              <button
                type="submit"
                className="mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              >
                SignUp
              </button>
            </form>

            <div className="flex gap-1 justify-center text-c3 mt-5">
              <span className="hover:text-white/70">Already have Account?</span>
              <Link
                className="cursor-pointer font-semibold text-[#fff]/80 hover:text-[#fff]"
                href={"/form/login"}
              >
                <span className="underline underline-offset-2">Login</span>{" "}
                <span className="underline underline-offset-2">here</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
