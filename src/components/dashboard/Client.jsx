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
import { Pagination } from "../common/Pagination";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { utilityFunctions } from "../../assets/functions";
import { faPencil, faUsersViewfinder } from "@fortawesome/free-solid-svg-icons";
import EditModal from "../common/EditModal";
import { usePagination } from "../hooks/usePagination";

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
  const [clientCases, setClientCases] = useState(null);

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

  useEffect(() => {
    setClientCases(
      <Pagination
        direction="vertical"
        itemsClassName="grid gap-2"
        recordsHeader={<div className="top-0 sticky w-full z-20"></div>}
        selfVScroll={{
          vScroll: true,
          vClasses: "px-2 pb-4 max-h-[80vh]",
        }}
        parityClassName={darkMode ? "odd:bg-stone-950" : "odd:bg-gray-200"}
        paginationConfig={{
          modelName: "Client",
          itemsPrimaryKey: "id",
          paginationEndpoint: `${endpoints.filter.filterClientCases
            .replace("<:criteria>", "strict")
            .replace("<:response>", "data")}/`,
          populationEndpoint: endpoints.filter.filterClientCases
            .replace("<:criteria>", "strict")
            .replace("<:response>", "count"),
          paginationEndpointHttpMethod: "POST",
          populationEndpointHttpMethod: "POST",
          postEndpointPayload: {
            response_columns: [
              "id",
              "case_no_or_parties",
              "file_reference",
              "clients_reference",
              "record",
              "outstanding",
              "paid_amount",
              "total_fee",
              "deposit_pay",
              "deposit_fees",
              "final_fees",
              "final_pay",
              "deposit",
            ],
            match_columns: {
              client_id: client.id,
            },
          },
          itemsPerPage: 10,
          componentName: CaseD,
          dataKey: "casex",
        }}
      />
    );
  }, [currentClient]);

  const sortedStatistics = caseStates.map((s) => ({
    ...s,
    count: casesStatusTally[s.name] || 0,
  }));
  sortedStatistics.sort((a, b) => b.count - a.count);

  return (
    <div
      className={`mt-8 mb-12 ${
        darkMode
          ? "shadow-inner shadow-black"
          : "bg-gray-100 shadow-inner shadow-black"
      }`}
    >
      <h4 className="text-3xl px-4 pt-4 dancing">{client.name}</h4>
      <div className="grid lg:grid-cols-2 gap-4 p-4 items-start">
        <div className="shadow-inner shadow-black rounded px-4 grid gap-4 pb-8">
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
          className={`shadow-inner shadow-black rounded-lg ${
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
        <div className="p-4 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-4">
          {sortedStatistics.map((s, i) => (
            <div
              key={i}
              className={`border-amber-800/75  rounded-lg overflow-hidden bg-gradient-to-r ${
                darkMode
                  ? "from-transparent via-black/50 shadow-inner shadow-black"
                  : "from-gray-100 via-gray-100 to-white shadow-inner shadow-black"
              } overflow-hidden`}
            >
              <div className="flex gap-2">
                <div
                  className={`text-3xl w-24 rounded-tl-lg rounded-br-lg bg-gradient-to-br ${
                    darkMode ? "via-black" : "from-transparent"
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

      {/* Client's Cases */}
      <div className="my-8">
        <h4
          className={`px-4 py-2 border-y border-amber-700 text-xl ${
            darkMode ? "" : ""
          }`}
        >
          {client.name}'s Cases
        </h4>
        <ClientCases client={client} />
      </div>
    </div>
  );
}

const ClientCases = ({ client }) => {
  const [handlePagination] = usePagination();

  const [cases, setCases] = useState([]);
  const [population, setPopulation] = useState(0);
  const [page, setPage] = useState(1);

  const handleCasePageFetch = (n, s) => {
    handlePagination({
      paginationEndpoint: `${endpoints.filter.filterClientCases
        .replace("<:criteria>", "strict")
        .replace("<:response>", "data")}/`,
      populationEndpoint: endpoints.filter.filterClientCases
        .replace("<:criteria>", "strict")
        .replace("<:response>", "count"),
      paginationEndpointHttpMethod: "POST",
      populationEndpointHttpMethod: "POST",
      payload: {
        response_columns: [
          "id",
          "case_no_or_parties",
          "file_reference",
          "clients_reference",
          "record",
          "outstanding",
          "paid_amount",
          "total_fee",
          "deposit_pay",
          "deposit_fees",
          "final_fees",
          "final_pay",
          "deposit",
        ],
        match_columns: {
          client_id: client.id,
        },
      },
      pageNumber: n,
      pagePopulation: s,
      errorCallback: (error) => {},
      setEndpointPopulation: (pop) => {
        setPopulation(pop);
      },
      successCallback: (res) => {
        if (Array.isArray(res) && res.length > 0) {
          setCases(res);
        }
      },
    });
  };

  useEffect(() => {
    handleCasePageFetch(page, 10);
  }, [client, page]);

  return (
    <div className="">
      <div className="scroll_x grid gap-1 p-2">
        <ListGroup className="w-full" horizontal>
          {[
            "case_no_or_parties",
            "file_reference",
            "clients_reference",
            "record",
            "outstanding",
            "paid_amount",
            "total_fee",
            "deposit_pay",
            "deposit_fees",
            "final_fees",
            "final_pay",
            "deposit",
          ].map((c, i) => (
            <ListGroupItem
              variant="info"
              key={i}
              style={{
                minWidth: `${(1 / 7) * 100}%`,
                maxWidth: `${(1 / 7) * 100}%`,
                borderRadius: "0",
              }}
            >
              {utilityFunctions.snakeCaseToTitleCase(c)}
            </ListGroupItem>
          ))}
        </ListGroup>
        {cases.map((casex, i) => (
          <CaseD cases={cases} setCases={setCases} key={i} casex={casex} />
        ))}
      </div>

      {cases.length > 0 && (
        <div className="px-4">
          <LinearPagination
            population={population}
            currentPage={page}
            itemsPerPage={10}
            setPage={setPage}
          />
        </div>
      )}
    </div>
  );
};

const LinearPagination = ({
  population,
  setPage,
  currentPage,
  itemsPerPage,
}) => {
  const { darkMode } = useContext(AuthContext);
  const N = Math.ceil(population / itemsPerPage);
  const pages = new Array(N).fill(0).map((i, j) => j + 1);
  return (
    <div>
      <div className="font-bold pt-4">
        Page {currentPage} of {N}
      </div>
      <div className="flex  items-center gap-2 py-2">
        {currentPage != 1 && (
          <button
            onClick={() => setPage(currentPage - 1)}
            className={`px-4 py-1 bg-amber-700 text-white hover:bg-amber-800 duration-300 ${
              darkMode ? "" : ""
            }`}
          >
            Previous
          </button>
        )}
        <div className="flex gap-2">
          {pages.slice(currentPage - 1, currentPage + 3).map((p, i) => (
            <button
              onClick={() => setPage(p)}
              className={`px-2 ${
                p == currentPage
                  ? "bg-amber-700 text-white hover:bg-amber-800"
                  : "shadow-inner shadow-black"
              } duration-300`}
              key={i}
            >
              {p}
            </button>
          ))}
        </div>
        {currentPage != N && (
          <button
            onClick={() => setPage(currentPage + 1)}
            className={`px-4 py-1 bg-amber-700 text-white hover:bg-amber-800 duration-300 ${
              darkMode ? "" : ""
            }`}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

const CaseD = ({ casex, cases, setCases }) => {
  const columns = [
    "case_no_or_parties",
    "file_reference",
    "clients_reference",
    "record",

    "outstanding",
    "paid_amount",
    "total_fee",

    "deposit_pay",
    "deposit_fees",
    "final_fees",
    "final_pay",
    "deposit",
  ];

  return (
    <ListGroup className="w-full" horizontal>
      {columns.map((c, i) => (
        <ListGroupItem
          className="relative group"
          variant="success"
          key={i}
          style={{
            minWidth: `${(1 / 7) * 100}%`,
            maxWidth: `${(1 / 7) * 100}%`,
            borderRadius: "0",
          }}
        >
          {casex[c]}
          {/* { !columns.slice(0, 4).includes(c) && !casex["payment_initialized"] && <button className="absolute hidden group-hover:flex items-center bottom-[90%] right-0 px-4 py-1 z-50 bg-stone-700 rounded hover:text-amber-600 duration-200 text-gray-300 font-bold text-xs gap-2"><FontAwesomeIcon icon={faUsersViewfinder} /><span >View Case</span></button>} */}
          <div className="absolute hidden group-hover:block bg-amber-800 hover:text-inherit hover:bg-black duration-300 rounded-tl-lg bottom-0 px-2 py-1 right-0">
            {columns.slice(0, 4).includes(c) ? (
              <EditModal
                description={`Change ${utilityFunctions.snakeCaseToTitleCase(
                  c
                )}`}
                dataEndpoint={endpoints.cases.getCase.replace(
                  "<:caseId>",
                  casex.id
                )}
                updateEndpoint={endpoints.cases.patchCase.replace(
                  "<:caseId>",
                  casex.id
                )}
                editableFields={[{ name: c, as: "text" }]}
                anchorClassName="flex flex-row-reverse items-center text-white"
                anchorText="..."
                icon={<FontAwesomeIcon icon={faPencil} />}
                receiveNewRecord={(res) => {
                  setCases(
                    cases.map((itm) => {
                      return itm.id === res.id ? { ...itm, [c]: res[c] } : itm;
                    })
                  );
                }}
              />
            ) : (
              <EditModal
                disableEditing={!casex["payment_initialized"]}
                description={`Change ${utilityFunctions.snakeCaseToTitleCase(
                  c
                )}`}
                dataEndpoint={endpoints.cases.getPaymentInformation.replace(
                  "<:caseId>",
                  casex.id
                )}
                updateEndpoint={endpoints.cases.patchPaymentInformation.replace(
                  "<:caseId>",
                  casex.id
                )}
                editableFields={[{ name: c, as: "number" }]}
                anchorClassName="flex flex-row-reverse items-center text-white"
                anchorText="..."
                icon={<FontAwesomeIcon icon={faPencil} />}
                receiveNewRecord={(res) => {
                  setCases(
                    cases.map((itm) => {
                      return itm.id === res.case_id
                        ? { ...itm, [c]: res[c] }
                        : itm;
                    })
                  );
                }}
              />
            )}
          </div>
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};
