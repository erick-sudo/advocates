import { useContext, useEffect, useState } from "react";
import { endpoints } from "../../assets/apis";
import Case, { CaseDetails } from "./Case";
import { Pagination } from "../common/Pagination";
import { apiCalls } from "../../assets/apiCalls";
import { notifiers } from "../../assets/notifiers";
import { FormModal } from "../common/FormModal";
import EditModal from "../common/EditModal";
import { DeleteModal } from "../common/DeleteModal";
import { AuthContext } from "../context/AuthContext";

export default function Cases({ setLoading }) {
  const [selectedCase, setSelectedCase] = useState(null);
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const { darkMode } = useContext(AuthContext);

  const paginationConfig = {
    modelName: "Case",
    itemsPrimaryKey: "id",
    paginationEndpoint: endpoints.pagination.getCases,
    populationEndpoint: endpoints.statistics.casesCount,
    itemsPerPage: 10,
    componentName: Case,
    detailsComponent: CaseDetails,
    dataKey: "casex",
    detailsProps: { setLoading },
    create: {
      NewRecordComponent: FormModal,
      interceptCreation: (payload, callback) => {
        setLoading(true);
        apiCalls.postRequest({
          endpoint: endpoints.cases.postCase,
          httpHeaders: {
            Accept: "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          httpBody: payload,
          successCallback: (res) => {
            setLoading(false);
            notifiers.httpSuccess("Case created successfully");
            callback(res, 0);
          },
          errorCallback: (err) => {
            console.log(err)
            notifiers.httpError(err.message);
            setLoading(false);
          },
        });
      },
      newRecordProps: {
        inputFields: [
          // {
          //   name: "title",
          //   as: "text",
          //   required: true,
          // },
          // {
          //   name: "description",
          //   as: "textarea",
          //   required: true,
          // },
          {
            name: "case_no_or_parties",
            as: "text",
            required: true,
          },
          {
            name: "record",
            as: "number",
            required: true,
          },
          {
            name: "file_reference",
            as: "text",
            required: true,
          },
          {
            name: "clients_reference",
            as: "text",
            required: true,
          },
          {
            name: "client_id",
            as: "select",
            required: true,
            label: "Select Client",
            options: clients.map((cl) => ({ value: cl.id, label: cl.name })),
          },
        ],
        anchorText: "New Case",
        submitText: "Save Case",
        description: "Create New Case",
      },
    },
    update: {
      UpdateComponent: EditModal,
      interceptUpdate: (payload, callback) => {
        setLoading(true);

        apiCalls.postRequest({
          endpoint: endpoints.cases.patchCase.replace("<:caseId>", payload.id),
          httpMethod: "PATCH",
          httpHeaders: {
            Accept: "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          httpBody: payload.payload,
          successCallback: (res) => {
            setLoading(false);
            notifiers.httpSuccess("Update Success");
            callback(res, 1);
          },
          errorCallback: (err) => {
            setLoading(false);
            notifiers.httpError(err);
          },
        });
      },
      updateDataSource: endpoints.cases.getCase.replace("<:caseId>", "<:id>"),
      updateProps: {
        anchorClassName: "flex items-center gap-2",
        description: "Edit Case",
        anchorText: "Edit Case",
        editableFields: [
          // {
          //   name: "title",
          //   as: "text",
          //   required: true,
          // },
          // {
          //   name: "description",
          //   as: "textarea",
          //   required: true,
          // },
          {
            name: "case_no_or_parties",
            as: "text",
            required: true,
          },
          {
            name: "record",
            as: "text",
            required: true,
          },
          {
            name: "file_reference",
            as: "text",
            required: true,
          },
          {
            name: "clients_reference",
            as: "text",
            required: true,
          },
        ],
      },
    },
    destroy: {
      DeleteComponent: DeleteModal,
      interceptDestruction: (payload, callback) => {
        setLoading(true);
        if (Array.isArray(payload)) {
          apiCalls.deleteRequest({
            endpoint: endpoints.cases.bulkDestruction,
            httpHeaders: {
              Accept: "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            httpBody: { case_ids: payload },
            successCallback: (res) => {
              setLoading(false);
              callback(payload, -1);
              notifiers.httpSuccess("Multiple Cases Deleted");
            },
            errorCallback: (res) => {
              setLoading(false);
              notifiers.httpError(err);
            },
          });
        } else {
          apiCalls.deleteRequest({
            endpoint: endpoints.cases.deleteCase.replace("<:caseId>", payload),
            httpHeaders: {
              Accept: "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            successCallback: (res) => {
              setLoading(false);
              callback(payload, -1);
              notifiers.httpSuccess("Case Deleted");
            },
            errorCallback: (err) => {
              setLoading(false);
              notifiers.httpError(err);
            },
          });
        }
      },
      deleteProps: {
        anchorText: "Delete Case",
        description: "Delete Case",
        anchorClassName: "flex items-center gap-2",
        consequences: (
          <div className="text-sm">
            <h5 className="text-sm py-2 px-2 font-bold">
              Deleting a Case has the following side effects
            </h5>
            <h4 className="px-4 font-bold">
              The following information will be lost:
            </h4>
            <ul className="px-8 list-disc list-inside">
              <li>All staff assignments to the case</li>
              <li>
                The associated <strong>payment information</strong>
              </li>
              <li>Any accumulated installments will be lost</li>
              <li>Documents associated with the case</li>
            </ul>

            {/* <div className="mx-auto flex justify-center">
              <InputGroup className="w-max mt-4">
                <InputGroup.Text>
                  <Form.Check type="switch" className="" />
                </InputGroup.Text>
                <InputGroup.Text className="text-sm">
                  Archive Instead
                </InputGroup.Text>
              </InputGroup>
            </div> */}
          </div>
        ),
      },
    },
    searchSupport: {
      support: true,
      searchPopulationEndpoint: endpoints.statistics.searchCasesCount,
      searchPaginationEndpoint: endpoints.pagination.search.searchCases,
      searchFields: [
        "id",
        "title",
        "case_no_or_parties",
        "file_reference",
        "clients_reference",
        "record",
      ],
    },
  };

  useEffect(() => {
    apiCalls.getRequest({
      endpoint: endpoints.clients.getAllClients,
      httpHeaders: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      successCallback: setClients,
    });
  }, []);

  return (
    <div className="relative">
      <div className="shadow-sm mx-2">
        <Pagination
          direction="vertical"
          selfVScroll={{
            vScroll: true,
            vClasses: "p-2 max-h-[50vh]",
          }}
          items={[cases, setCases]}
          parityClassName={darkMode ? "odd:bg-stone-950" : "odd:bg-gray-200"}
          recordsHeader={
            <div className="flex items-center gap-2 text-xs font-bold p-2">
              <span className="w-8"></span>
              <div className="grid grid-cols-2 items-center flex-grow">
                <div className="">Case</div>
                <div className="flex flex-wrap gap-x-4">
                  <h5>Case No/Parties (CN)</h5>
                  <h5>File Reference (FR)</h5>
                  <h5>Clients Reference (CR)</h5>
                </div>
              </div>
              <div className="min-w-[7rem] max-w-[7rem]">Record</div>
            </div>
          }
          paginationConfig={{ ...paginationConfig }}
          generalProps={{ setSelectedCase, selectedCase }}
        />
      </div>

      {/* {selectedCase ? (
        
      ) : (
        <NoResults
          className=""
          content={
            <div className="z-20">
              <div className="text-center text-5xl text-amber-900">
                <FontAwesomeIcon icon={faHandPointer} />
              </div>
              <div className="font-bold text-3xl text-amber-900">
                Please Click a Case above to view details
              </div>
            </div>
          }
        />
      )} */}
    </div>
  );
}
