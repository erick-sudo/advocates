import { useContext, useEffect, useState } from "react";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSession } from "../hooks/useSession";
import { AuthContext } from "../context/AuthContext";
import { Login } from "../account/Login";
import { Expired } from "../common/Expired";
import { DashNavBar } from "./DashNavBar";
import Cases from "./Cases";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import {
  faClose,
  faFileExport,
  faFolder,
  faHome,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Clients from "./Clients";
import { Loader } from "../common/Loader";
import { Dash } from "./Dash";
import { FilterExport } from "./FilterExport";
import { Card } from "react-bootstrap";

export function Dashboard() {
  const { pathname } = useLocation();
  const [showNavBar, setShowNavBar] = useState(false);
  const navigate = useNavigate();
  const [handleSession] = useSession();
  const [loading, setLoading] = useState(false);
  const { userInfo, setUserInfo, expiredLogin, logout, darkMode } =
    useContext(AuthContext);

  const tabs = [
    {
      label: "",
      icon: faHome,
      link: "/dashboard",
      description: "Home",
    },
    {
      label: "Cases",
      icon: faFolder,
      link: "/dashboard/cases",
      description: "Cases",
    },
    {
      label: "Clients",
      icon: faUser,
      link: "/dashboard/clients",
      description: "Clients",
    },
    {
      label: "Export",
      icon: faFileExport,
      link: "/dashboard/export",
      description: "Export",
    },
  ];

  useEffect(() => {
    handleSession();

    const interval = setInterval(() => {
      handleSession();
    }, 360000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setUserInfo(handleSession());
  }, [pathname]);

  return (
    <Card
      data-bs-theme={darkMode ? "dark" : "light"}
      style={{ border: "none", borderRadius: "0" }}
      className="fixed inset-0 flex"
    >
      {userInfo && expiredLogin && (
        <Expired
          onCancel={() => {
            navigate("/");
            logout();
          }}
          onLogin={logout}
        />
      )}
      {loading && <Loader className="bg-white/75 z-50 fixed" />}
      {userInfo ? (
        <div className="flex-grow flex flex-col">
          <div>
            <DashNavBar
              currentPage={tabs.find((tab) => tab.link === pathname)?.label}
            />
          </div>
          <div className="flex-grow flex">
            <div className="flex flex-col shadow-inner shadow-black">
              <div className="flex justify-end">
                {!showNavBar ? (
                  <button
                    onClick={() => setShowNavBar(true)}
                    className="h-10 w-10 shadow shadow-dark duration-300 hover:bg-amber-800 hover:text-white"
                  >
                    <FontAwesomeIcon icon={faBars} />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowNavBar(false)}
                    className="h-8 w-8 shadow-md rounded-full shadow-black m-3 duration-300 hover:scale-125 hover:bg-amber-800 hover:text-white"
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                )}
              </div>

              {/* <button
                onClick={() => navigate("/")}
                className="h-10 border-b border-amber-800/50 hover:text-amber-800"
              >
                <FontAwesomeIcon icon={faHome} />
              </button> */}

              <div className="flex flex-col">
                {tabs.map((tab, index) =>
                  !showNavBar ? (
                    <NavLink
                      className={`h-10 border-b border-amber-800/50 flex items-center justify-center ${
                        tab.link === pathname
                          ? "bg-amber-800 text-white"
                          : "text-amber-700"
                      }`}
                      key={index}
                      to={tab.link}
                      title={tab.description}
                    >
                      <FontAwesomeIcon icon={tab.icon} />
                    </NavLink>
                  ) : (
                    <div
                      onClick={() => navigate(tab.link)}
                      key={index}
                      className={`cursor-pointer hover:rotate-12 duration-300 mb-1  ${
                        tab.link === pathname
                          ? "bg-amber-800 text-white"
                          : "text-amber-700"
                      } pl-4 pr-12 py-2 text-start shadow-md shadow-black/50 w-full`}
                    >
                      {tab.description}
                    </div>
                  )
                )}
              </div>
              <div className="flex-grow"></div>
              {!showNavBar ? (
                <button
                  onClick={logout}
                  className="text-amber-800 h-10 duration-300 hover:bg-amber-800 hover:text-white"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
              ) : (
                <div
                  onClick={logout}
                  className="text-start px-4 py-2 text-amber-800 m-2 shadow-md cursor-pointer rounded-sm shadow-amber-800 hover:bg-amber-800 hover:text-white hover:-translate-y-2 duration-300"
                >
                  Logout
                </div>
              )}
            </div>
            <div className="text-sm flex-grow relative">
              <div className="absolute inset-0 overflow-y-scroll">
                <Routes>
                  <Route path="" element={<Dash />} />
                  <Route path="cases" element={<Cases {...{ setLoading }} />} />
                  <Route
                    path="clients"
                    element={<Clients {...{ setLoading }} />}
                  />
                  <Route path="export" element={<FilterExport />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </Card>
  );
}
