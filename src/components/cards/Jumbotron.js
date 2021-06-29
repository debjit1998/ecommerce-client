import React from "react";
import Typewriter from "typewriter-effect";

function Jumbotron({ text }) {
  console.log(text);
  return (
    <Typewriter
      options={{
        strings: text,
        autoStart: true,
        loop: true,
      }}
    />
  );
}

export default Jumbotron;
