import { useContext, useEffect, useState } from "react";
import { Background } from "../common/DottedBackground";
import { PairView } from "./PairView";
import { apiCalls } from "../../assets/apiCalls";
import { endpoints } from "../../assets/apis";
import { caseStates } from "../../assets/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataChart } from "../common/DataChart";
import { SpeedCounter } from "../common/SpeedCounter";
import { StrokeText } from "../common/StrokeText";
import { AuthContext } from "../context/AuthContext";

export function Client({ client, selectedClient, setSelectedClient }) {
  const { darkMode } = useContext(AuthContext);
  return (
    <div
      onClick={() => setSelectedClient(client)}
      className={`relative flex flex-col hover:bg-amber-800 hover:font-bold hover:text-white duration-500 cursor-pointer border-b border-amber-800/25`}
    >
      {selectedClient?.id === client.id && (
        <div className="absolute flex inset-0">
          <div className="relative flex-grow">
            <Background />
          </div>
        </div>
      )}
      <div className="z-20 text-xs px-4 py-1">
        <span className="px-2 py-1 rounded-lg">{client.id}</span>
      </div>
      <div className="flex flex-grow p-2 gap-4">
        <div className="flex flex-grow">
          <div className="w-1/4 truncate z-20">{client.name}</div>
          <div className="w-1/4 truncate z-20">{client.email}</div>
          <div className="w-1/4 truncate z-20">{client.address}</div>
          <div className="w-1/4 truncate z-20">{client.contact_number}</div>
        </div>
      </div>
    </div>
  );
}

export function ClientDetails({ client = {} }) {
  const [currentClient, setCurrentClient] = useState({});
  const [casesStatusTally, setCasesStatusTally] = useState({});
  const { darkMode } = useContext(AuthContext);

  useEffect(() => {
    setCurrentClient(client);
    [
      [endpoints.statistics.showClientCaseStatusTally, setCasesStatusTally],
    ].forEach((prop) => {
      apiCalls.getRequest({
        endpoint: prop[0].replace("<:clientId>", client.id),
        httpHeaders: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          Accept: "application/json",
        },
        successCallback: (res) => {
          prop[1](res);
        },
      });
    });
  }, [client]);

  const sortedStatistics = caseStates.map((s) => ({
    ...s,
    count: casesStatusTally[s.name] || 0,
  }));
  sortedStatistics.sort((a, b) => b.count - a.count);

  return (
    <div className="p-2 mt-8 mb-12 shadow-md shadow-black/50 mx-4 rounded-lg">
      <h4 className="text-3xl px-4 pt-4 dancing">{client.name}</h4>
      <div className="grid lg:grid-cols-2 gap-4 p-2 items-start">
        <div className="shadow-md shadow-black/25 rounded px-4 grid gap-4 pb-8">
          <PairView
            title="Client Details"
            hClassName="text-center dancing text-lg font-bold border-b border-amber-800/50 py-2"
            wClassName=""
            fields={[
              "name",
              "username",
              "email",
              "contact_number",
              "address",
            ].map((f) => ({ name: f, dir: "h" }))}
            obj={currentClient}
          />
        </div>

        <div
          className={`shadow-md shadow-black/25 rounded-lg ${
            darkMode ? "bg-black/50" : ""
          } `}
        >
          <div className="max-w-xl mx-auto">
            {Object.keys(casesStatusTally).length > 0 && (
              <DataChart
                plot_data={{
                  title: `${client.name}'s Case State Analysis`,
                  dimensionRatio: 0.7,
                  graph_type: "line",
                  options: {
                    indexAxis: "y",
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          color: darkMode
                            ? "rgb(217, 119, 6, .7)"
                            : "rgb(0, 0, 0, .5)",
                        },
                        title: {
                          display: true,
                          text: "Number of Conferences",
                          color: darkMode
                            ? "rgb(245, 158, 11)"
                            : "rgb(0, 0, 0)",
                        },
                        ticks: {
                          color: darkMode ? "rgb(217, 119, 6)" : "",
                        },
                      },
                      y: {
                        grid: {
                          color: darkMode
                            ? "rgb(217, 119, 6, .7)"
                            : "rgb(0, 0, 0, .5)",
                        },
                        title: {
                          display: true,
                          text: "Case Status",
                          color: darkMode
                            ? "rgb(245, 158, 11)"
                            : "rgb(0, 0, 0)",
                        },
                        ticks: {
                          color: darkMode ? "rgb(217, 119, 6)" : "",
                        },
                      },
                    },
                  },
                  data: {
                    labels: sortedStatistics.map((s) => s.name),
                    datasets: [
                      {
                        label: "Number of Cases",
                        data: sortedStatistics.map((s) => s.count),
                        borderColor: "rgb(146 64 14)",
                        backgroundColor: darkMode
                          ? "rgb(245, 158, 11, .8)"
                          : "rgba(107, 114, 128, .7)",
                        fill: true,
                      },
                    ],
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* States */}
      <div>
        <h4 className="px-4 mt-4 text-xl dancing">Status Tally</h4>
        <div className="p-2 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-4">
          {sortedStatistics.map((s, i) => (
            <div
              key={i}
              className={`border-amber-800/75  rounded-lg bg-gradient-to-r ${
                darkMode
                  ? "from-transparent via-black/50 shadow-xl shadow-black/50"
                  : "from-gray-100 via-gray-100 to-white shadow-xl shadow-white"
              } overflow-hidden`}
            >
              <div className="flex gap-2">
                <div
                  className={`text-3xl w-24 rounded-br-lg bg-gradient-to-r ${
                    darkMode ? "via-black" : "from-white"
                  } text-gray-700/50 h-24 flex justify-center items-center shadow-md`}
                >
                  <FontAwesomeIcon icon={s.icon} />
                </div>
                <div className="text-5xl flex-grow flex items-center font-extrabold">
                  <StrokeText
                    fillColor="transparent"
                    strokeColor={darkMode ? "rgb(146, 64, 14, .8)" : "black"}
                    sz={1}
                    text={<SpeedCounter value={s.count} />}
                  />
                </div>
              </div>
              <div className="text-3xl py-2 font-extrabold italic px-4">
                <StrokeText
                  fillColor="transparent"
                  strokeColor="rgb(146 64 14)"
                  sz={1}
                  text={s.name}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
