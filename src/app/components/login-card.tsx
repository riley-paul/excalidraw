import React from "react";
import LoginButton from "./login-button";

const LoginCard: React.FC = () => {
  return (
    <article className="rounded-3 grid w-full max-w-2xl grid-cols-2 overflow-clip border shadow">
      <section className="aspect-square flex-1 border-r">
        <img src="/images/welcome2.png" />
      </section>
      <section className="flex flex-col justify-center gap-3 p-4">
        <LoginButton provider="google" />
        <LoginButton provider="github" />
      </section>
    </article>
  );
};

export default LoginCard;
