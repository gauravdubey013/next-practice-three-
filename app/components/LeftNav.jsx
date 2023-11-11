"use client";

import React, { useState } from "react";
import Avatar from "./Avatar";
import Icon from "./Icon";
import ToastMessage from "./ToastMessage";

import { BiCheck, BiEdit } from "react-icons/bi";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { IoLogOutOutline, IoClose } from "react-icons/io5";
import { MdPhotoCamera, MdAddAPhoto, MdDeleteForever } from "react-icons/md";

import { profileColors } from "src/utils/constants";
import { useAuth } from "src/context/authContext";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "src/firebase/firebase";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import UsersPopUp from "./popup/UsersPopUp";

const LeftNav = () => {
  const [usersPopup, setUsersPopup] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [nameEdited, setNameEdited] = useState(false);
  const { currentUser, setCurrentUser, signOut } = useAuth();
  const authUser = auth.currentUser;

  const uploadImageToFirestore = (file) => {
    try {
      if (file) {
        //Upload imgae code-
        const storageRef = ref(storage, currentUser.displayName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.error(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);
                handleUpdateProfile("photo", downloadURL);
                await updateProfile(authUser, {
                  photoURL: downloadURL,
                });
              }
            );
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProfile = (type, value) => {
    // color, name, photo, photo-remove-
    let obj = { ...currentUser };
    switch (type) {
      case "color":
        obj.color = value;
        break;
      case "name":
        obj.displayName = value;
        break;
      case "photo":
        obj.photoURL = value;
        break;
      case "photo-remove":
        obj.photoURL = null;
        break;
      default:
        break;
    }
    try {
      toast.promise(
        async () => {
          const userDocRef = doc(db, "users", currentUser.uid);
          await updateDoc(userDocRef, obj);
          setCurrentUser(obj);

          if (type === "photo-remove") {
            await updateProfile(authUser, {
              photoURL: null,
            });
          }
          if (type === "name") {
            await updateProfile(authUser, {
              displayName: value,
            });
            setNameEdited(false);
          }
        },
        {
          pending: "Updating profile!",
          success: "Profile updated successfully!",
          error: "Profile updation Failed!",
        },
        {
          autoClose: 3000,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onClickUpdateProfileName = () => {
    handleUpdateProfile(
      "name",
      document.getElementById("displayNameEdit").innerText
    );
  };

  const onkeyup = (e) => {
    if (e.target.innerText.trim() !== currentUser.displayName) {
      // name edited
      setNameEdited(true);
    } else {
      //not edited
      setNameEdited(false);
    }
  };
  const onkeydown = (e) => {
    if (e.key === "Enter" && e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const editProfileContainer = () => {
    return (
      <>
        <div className="relative flex flex-col items-center ease-in-out duration-500">
          <ToastMessage />
          <Icon
            size="small"
            className="absolute top-0 left-3 hover:bg-c2"
            icon={<IoClose size={20} />}
            onClick={() => setEditProfile(!editProfile)}
          />
          <div className="relative group cursor-pointer mt-7 duration-500">
            <Avatar size="xx-large" user={currentUser} />
            <div className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 items-center justify-center hidden group-hover:flex">
              <label htmlFor="fileUpload">
                {!currentUser.PhotoURL ? (
                  <MdPhotoCamera size={34} />
                ) : (
                  <MdAddAPhoto size={34} />
                )}
              </label>
              <input
                type="file"
                id="fileUpload"
                style={{ display: "none" }}
                onChange={(e) => uploadImageToFirestore(e.target.files[0])}
              />
            </div>
            {currentUser.photoURL && (
              <div
                className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-900 flex justify-center items-center absolute right-0 bottom-0"
                onClick={() => handleUpdateProfile("photo-remove")}
              >
                <MdDeleteForever size={14} />
              </div>
            )}
          </div>

          <div className="mt-1 flex flex-col items-center">
            <div className="flex items-center gap-1">
              {!nameEdited && <BiEdit className="text-c3" />}
              {nameEdited && (
                <BsFillCheckCircleFill
                  className="text-c4 cursor-pointer"
                  onClick={onClickUpdateProfileName}
                />
              )}
              <div
                contentEditable
                className="bg-transparent outline-none border-none text-center"
                id="displayNameEdit"
                onKeyUp={onkeyup}
                onKeyDown={onkeydown}
              >
                {currentUser.displayName}
              </div>
            </div>
            <span className="text-c3 text-sm">{currentUser.email}</span>
          </div>

          <div className="ml-[-10px] md:ml-0 grid grid-cols-5 gap-4 mt-5 scale-75 md:scale-100 duration-700">
            {profileColors.map((color, index) => (
              <span
                key={index}
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-125"
                style={{ backgroundColor: color }}
                onClick={() => {
                  handleUpdateProfile("color", color);
                }}
              >
                {color === currentUser.color && <BiCheck size={24} />}
              </span>
            ))}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <div
        className={`${
          editProfile
            ? "ml-[11px] md:ml-5 w-[220px] md:w-[350px] duration-500"
            : "w-[80px] items-center duration-200"
        } flex flex-col justify-between py-5 shrink-0 transition-all`}
      >
        {editProfile ? (
          editProfileContainer()
        ) : (
          <div
            className="relative group cursor-pointer"
            onClick={() => setEditProfile(!editProfile)}
          >
            <Avatar size="large" user={currentUser} />
            <div className="hidden absolute w-full h-full top-0 left-0 rounded-full bg-black/[0.5] group-hover:flex justify-center items-center">
              <BiEdit className="text-[#fff]" size={14} />
            </div>
          </div>
        )}

        <div
          className={`flex gap-2 duration-500 ${
            editProfile ? "duration-300" : "flex-col duration-300"
          }`}
        >
          <Icon
            size="x-large"
            className="bg-green-500 hover:bg-gray-600 ease-in-out duration-500"
            icon={<FiPlus size={24} />}
            onClick={() => setUsersPopup(!usersPopup)}
          />
          <Icon
            size="x-large"
            className="hover:bg-c2"
            icon={<IoLogOutOutline size={24} />}
            onClick={signOut}
          />
        </div>
        {usersPopup && (
          <UsersPopUp onHide={() => setUsersPopup(false)} title="Find Users:" />
        )}
      </div>
    </>
  );
};

export default LeftNav;
