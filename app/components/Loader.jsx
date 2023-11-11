import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
        Loader
        <Image src={"/loader.svg"} alt="Loading.." height={100} width={100} />
      </div>
    </>
  );
};

export default Loader;
