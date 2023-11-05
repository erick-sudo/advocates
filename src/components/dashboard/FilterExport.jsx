import React, { useState, useEffect, useContext } from "react";
import {
  faDownload,
  faFileCsv,
  faFileExcel,
  faFolderBlank,
  faHandPointer,
  faSearch,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { InputGroup, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import { NoResults } from "../common/NoResults";
import { array2d, csvString, utilityFunctions } from "../../assets/functions";
import { notifiers } from "../../assets/notifiers";
import * as XLSX from "xlsx";
import { Loader } from "../common/Loader";
import { TabSwitch } from "../common/TabSwitch";
import { endpoints } from "../../assets/apis";
import { apiCalls } from "../../assets/apiCalls";
import { Background } from "../common/DottedBackground";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../context/AuthContext";

export function FilterExport() {
  const { darkMode } = useContext(AuthContext);
  return (
    <div className="p-2">
      <TabSwitch
        darkMode={darkMode}
        options={[
          { name: "Client's Cases", element: <ExportClientCases /> },
          {
            name: "Cases",
            element: (
              <div className="px-4">
                <FilterMaster
                  supportedFilterFields={[
                    "id",
                    "title",
                    "description",
                    "case_no_or_parties",
                    "file_reference",
                    "clients_reference",
                    "record",
                    "total_fee",
                    "outstanding",
                    "paid_amount",
                  ]}
                  filterEndpoint={endpoints.filter.filterCases}
                />
              </div>
            ),
          },
          {
            name: "Clients",
            element: (
              <div className="px-4">
                <FilterMaster
                  supportedFilterFields={[
                    "id",
                    "name",
                    "username",
                    "email",
                    "contact_number",
                    "address",
                  ]}
                  filterEndpoint={endpoints.filter.filterClients}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

function ExportClientCases() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    apiCalls.getRequest({
      endpoint: endpoints.clients.getAllClients,
      httpHeaders: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      successCallback: (res) => {
        setClients(res);
      },
    });
  }, []);
  return (
    <div className="grid gap-4 py-4">
      <div className="px-4">
        <Form.Select
          name="client"
          onChange={(e) =>
            setSelectedClient(clients.find((c) => e.target.value === c.id))
          }
          value={selectedClient?.id || ""}
        >
          <option value="">Select Client</option>
          {clients.map((client, idx) => (
            <option value={client.id} key={idx}>
              {client.name}
            </option>
          ))}
        </Form.Select>
      </div>
      {selectedClient ? (
        <div className="py-2 px-4">
          <FilterMaster
            title={selectedClient.name}
            and={{ field: "client_id", value: selectedClient.id }}
            filterEndpoint={endpoints.filter.filterCases}
            supportedFilterFields={[
              "id",
              "case_no_or_parties",
              "file_reference",
              "clients_reference",
              "record",
              "total_fee",
              "outstanding",
              "paid_amount",
            ]}
          />
        </div>
      ) : (
        <div className="min-h-[20vh] m-4 relative">
          <Background />
          <NoResults
            content={
              <div className="font-bold text-2xl">Select Client Above</div>
            }
          />
        </div>
      )}
    </div>
  );
}

function FilterMaster({
  and: { field, value } = { field: undefined, value: undefined },
  title,
  filterEndpoint = "",
  supportedFilterFields = [],
}) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [matchFields, setMatchFields] = useState([]);
  const [criteria, setCriteria] = useState("match");
  const [responseColumns, setResponseColumns] = useState([]);
  const [matchColumns, setMatchColumns] = useState({});
  const [dataUrl, setDataUrl] = useState("");
  const [exportFormat, setExportFormat] = useState({
    name: "excel",
    icon: faFileExcel,
    ext: ".xlsx",
  });

  const handleSubmit = () => {
    if (
      Object.keys(matchColumns).length > 0 &&
      !Boolean(Object.keys(matchColumns).find((f) => matchColumns[f] === "")) &&
      responseColumns.length > 0
    ) {
      const payload = {
        match_columns: { ...matchColumns },
        response_columns: responseColumns,
      };
      if (field) {
        payload.match_columns[field] = value;
      }
      setLoading(true);
      apiCalls.postRequest({
        endpoint: filterEndpoint.replace("<:criteria>", criteria),
        httpHeaders: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        httpBody: payload,
        successCallback: (res) => {
          setLoading(false);
          setItems(res);
        },
        errorCallback: (err) => {
          setLoading(false);
          notifiers.httpError(err);
        },
      });
    } else {
      if (Object.keys(matchColumns).length < 1) {
        notifiers.generalInfo("No Columns Selected");
        return;
      }
      if (Object.keys(matchColumns).find((f) => matchColumns[f] === "")) {
        notifiers.generalInfo("Empty Fields Detected");
        return;
      }
      if (responseColumns.length < 1) {
        notifiers.generalInfo("Please select export columns");
        return;
      }
    }
  };

  useEffect(() => {
    setItems([]);
    setResponseColumns([]);
  }, [supportedFilterFields]);

  useEffect(() => {
    setDataUrl("");
  }, [items]);

  const handleCsv = () => {
    return URL.createObjectURL(
      new Blob([csvString(items, responseColumns)], { type: "text/csv" })
    );
  };

  const handleExcel = () => {
    const workSheet = XLSX.utils.aoa_to_sheet(array2d(items, responseColumns));
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");

    const xlsxData = XLSX.write(workBook, { bookType: "xlsx", type: "array" });

    const blob = new Blob([xlsxData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return URL.createObjectURL(blob);
  };

  const handleExport = () => {
    if (exportFormat.name === "csv") {
      setDataUrl(handleCsv());
    } else {
      setDataUrl(handleExcel());
    }
  };

  const handleChange = (k, v) => {
    const newObj = { ...matchColumns, [k]: v };
    setMatchColumns(newObj);
  };

  useEffect(() => {
    const newObj = { ...matchColumns };
    for (let f of Object.keys(newObj)) {
      if (!matchFields.includes(f)) {
        delete newObj[f];
      }
    }
    matchFields.forEach((f) => {
      if (matchColumns[f] === undefined) {
        newObj[f] = "0";
      }
    });
    setMatchColumns(newObj);
  }, [matchFields]);

  return (
    <div className="relative py-4">
      {loading && <Loader className="bg-white/75 z-50 fixed" />}
      {title && <h4 className="text-2xl font-bold">{title}</h4>}
      <div>
        <h5 className="py-1 px-4 text-sm">Flexibility</h5>
        <div className="grid grid-cols-3 max-w-2xl gap-4">
          <InputGroup className="">
            <InputGroup.Text style={{ borderRadius: 0 }}>
              <Form.Check
                checked={criteria === "match"}
                onChange={() => setCriteria("match")}
                name="flexibility"
                type="radio"
              />
            </InputGroup.Text>
            <InputGroup.Text style={{ borderRadius: 0 }} className="flex-grow">
              Match
            </InputGroup.Text>
          </InputGroup>
          <InputGroup className="">
            <InputGroup.Text style={{ borderRadius: 0 }}>
              <Form.Check
                checked={criteria === "strict"}
                onChange={() => setCriteria("strict")}
                name="flexibility"
                type="radio"
              />
            </InputGroup.Text>
            <InputGroup.Text style={{ borderRadius: 0 }} className="flex-grow">
              Strict
            </InputGroup.Text>
          </InputGroup>
        </div>
      </div>
      <div className="grid gap-4">
        <div>
          <h4 className="px-4 font-bold text-lg">
            Supported Columns: Click to use
          </h4>
          <div className="flex flex-wrap gap-3">
            {supportedFilterFields.map((f, idx) => (
              <button
                key={idx}
                className={`hover:shadow-lg hover:shadow-black/50 hover:scale-105 duration-200 border-amber-700 cursor-pointer px-3 py-1 rounded ${
                  matchFields.includes(f)
                    ? "bg-amber-800 text-white"
                    : "shadow-inner shadow-black"
                }`}
                variant={matchFields.includes(f) ? "dark" : ""}
                onClick={() => {
                  matchFields.includes(f)
                    ? setMatchFields((flds) => flds.filter((fld) => fld !== f))
                    : setMatchFields([...matchFields, f]);
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="px-4 font-bold text-lg">Define Values</h4>
          <div className="gap-1 grid py-2 max-w-xl">
            {matchFields.length > 0 ? (
              matchFields.map((f, idx) => (
                <InputGroup key={idx}>
                  <InputGroup.Text
                    onClick={() =>
                      setMatchFields((flds) => flds.filter((fld) => fld !== f))
                    }
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </InputGroup.Text>
                  <InputGroup.Text style={{ minWidth: "14rem" }}>
                    {utilityFunctions.snakeCaseToTitleCase(f)}
                  </InputGroup.Text>
                  <Form.Control
                    name={f}
                    value={matchColumns[f] || ""}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    placeholder={utilityFunctions.snakeCaseToTitleCase(f)}
                  />
                </InputGroup>
              ))
            ) : (
              <div className="min-h-[10vh] flex justify-center items-center flex-col relative font-bold">
                <Background />
                <div className="flex flex-col items-center z-30 text-lg">
                  <FontAwesomeIcon icon={faHandPointer} />
                  <span>Please Select fields above</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <h4 className="px-4 font-bold text-lg">
            Export Columns: Click to select
          </h4>
          <div className="flex flex-wrap gap-3">
            {supportedFilterFields.map((f, idx) => (
              <button
                key={idx}
                className={`hover:shadow-lg hover:shadow-black/50 hover:scale-105 duration-200 border-amber-700 cursor-pointer px-3 py-1 rounded ${
                  responseColumns.includes(f)
                    ? "bg-amber-800 text-white"
                    : "shadow-inner shadow-black"
                }`}
                data-bs-theme={responseColumns.includes(f) ? "dark" : ""}
                onClick={() => {
                  responseColumns.includes(f)
                    ? setResponseColumns((flds) =>
                        flds.filter((fld) => fld !== f)
                      )
                    : setResponseColumns([...responseColumns, f]);
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleSubmit}
            className="py-2 px-8 my-4 shadow-md rounded-lg bg-amber-800 text-gray-100 hover:bg-white hover:shadow-lg duration-300 hover:scale-110 hover:shadow-gray-700 hover:text-black"
          >
            <FontAwesomeIcon icon={faSearch} /> Search
          </button>
          <div className="flex flex-grow justify-end">
            {items.length > 0 && dataUrl && (
              <a
                href={dataUrl}
                download={`${(title || "data").replace(
                  /\s+/g,
                  "_"
                )}_____${new Date().toDateString().replace(/\s+/g, "_")}${
                  exportFormat.ext
                }`}
                className="flex gap-2 items-center font-bold text-amber-800 ring-2 ring-amber-800 rounded-sm hover:bg-amber-800 hover:text-white duration-300 cursor-pointer px-4 py-2"
              >
                <FontAwesomeIcon icon={faDownload} />
                <span>Download</span>
                <span className="uppercase">{exportFormat.name}</span>
              </a>
            )}
          </div>
          {items.length > 0 && (
            <ListGroup horizontal>
              {[
                { name: "excel", icon: faFileExcel, ext: ".xlsx" },
                { name: "csv", icon: faFileCsv, ext: ".csv" },
              ].map((exf, idx) => (
                <ListGroupItem
                  className={`border-amber-600 cursor-pointer flex gap-2 items-center duration-300 ${
                    exf.name === exportFormat.name && "bg-amber-600 text-white"
                  }`}
                  onClick={() => setExportFormat(exf)}
                  key={idx}
                >
                  <FontAwesomeIcon icon={exf.icon} />
                  {exf.name}
                </ListGroupItem>
              ))}
              <ListGroupItem
                onClick={handleExport}
                className="border-amber-800 hover:bg-amber-950 hover:border-amber-950 duration-300 cursor-pointer hover bg-amber-800 text-white"
              >
                Export <span className="font-bold">{exportFormat.name}</span>
              </ListGroupItem>
            </ListGroup>
          )}
        </div>

        <h4 className="px-4 font-bold text-lg">Filter Results</h4>
        <div className="grid  gap-2 pb-8">
          <ListGroup horizontal>
            {responseColumns.map((col, idx) => (
              <ListGroupItem
                className="font-bold"
                variant="info"
                style={{ minWidth: `${(1 / responseColumns.length) * 100}%` }}
                key={idx}
              >
                {utilityFunctions.snakeCaseToTitleCase(col)}
              </ListGroupItem>
            ))}
          </ListGroup>
          {items.length > 0 ? (
            items.map((cs, index) => (
              <ListGroup horizontal key={index}>
                {responseColumns.map((col, idx) => (
                  <ListGroupItem
                    variant="success"
                    style={{
                      minWidth: `${(1 / responseColumns.length) * 100}%`,
                    }}
                    key={idx}
                  >
                    <div className="break-all">{cs[col]}</div>
                  </ListGroupItem>
                ))}
              </ListGroup>
            ))
          ) : (
            <NoResults
              content={
                <div>
                  <h4 className="flex flex-col items-center gap-2">
                    <span className="text-xl">
                      <FontAwesomeIcon icon={faFolderBlank} />
                    </span>
                    <span className="font-bold">No results matched</span>
                  </h4>
                </div>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
