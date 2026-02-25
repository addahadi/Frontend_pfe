import { RulerDimensionLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const AuthLayout = () => {
  const location = useLocation();
  const [imgType, setImgType] = useState("");
  useEffect(() => {
    console.log(location.pathname);
    const imgtype =
      location.pathname === "/auth/login" || location.pathname === "/auth/register"
        ? "/auth/login.png"
        : "/auth/forget.png";
    setImgType(imgtype);
  }, [location.pathname]);
  return (
    <div
      className={`flex min-h-screen w-full ${imgType === "/auth/forget.png" ? "flex-row-reverse" : "flex-row"} overflow-hidden`}
    >
      <div
        className={`${imgType === "/auth/forget.png" ? "bg-primary/90" : " bg-slate-200"} relative hidden lg:flex lg:w-1/2`}
      >
        <div
          className={`absolute inset-0 bg-cover bg-center ${imgType === "/auth/forget.png" ? "opacity-60 mix-blend-overlay" : ""} `}
          data-alt="Construction site with cranes and scaffolding"
          style={{ backgroundImage: `url(${imgType})` }}
        ></div>
        <div
          className={`${imgType === "/auth/forget.png" ? "from-primary/90 bg-gradient-to-t to-transparent" : "bg-primary/40 mix-blend-multiply"} absolute inset-0`}
        ></div>
        {imgType === "/auth/login.png" ? (
          <div className="absolute bottom-0 left-0 z-10 p-12 text-white">
            <h2 className="mb-6 text-5xl font-black tracking-tight">Build Smarter.</h2>
            <p className="max-w-lg text-xl leading-relaxed text-slate-100">
              Join thousands of engineers and contractors managing projects efficiently with our
              smart estimation tools.
            </p>
          </div>
        ) : (
          <div className="relative z-10 flex w-full flex-col justify-end p-16 text-white">
            <div className="mb-4">
              <RulerDimensionLine className="h-10 w-10" />
            </div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight">Build Smarter, Faster.</h2>
            <p className="max-w-md text-lg leading-relaxed text-white/90">
              Streamline your material estimation and project management workflows with our next-gen
              platform designed for modern engineering.
            </p>
          </div>
        )}
      </div>
      <div className="bg-background-light relative flex w-full flex-1 flex-col items-center justify-center px-4 py-12 sm:px-12 lg:w-1/2 lg:px-24">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
