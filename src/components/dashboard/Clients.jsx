import { endpoints } from "../../assets/apis";
import { Client, ClientDetails } from "./Client";
import { Pagination } from "../common/Pagination";
import { useContext, useState } from "react";
import { FormModal } from "../common/FormModal";
import { apiCalls } from "../../assets/apiCalls";
import { notifiers } from "../../assets/notifiers";
import EditModal from "../common/EditModal";
import { DeleteModal } from "../common/DeleteModal";
import { AuthContext } from "../context/AuthContext";

export default function Clients({ setLoading }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const { darkMode } = useContext(AuthContext);

  const paginationConfig = {
    modelName: "Client",
    itemsPrimaryKey: "id",
    paginationEndpoint: endpoints.pagination.getClients,
    populationEndpoint: endpoints.statistics.clientsCount,
    itemsPerPage: 10,
    componentName: Client,
    detailsComponent: ClientDetails,
    detailsProps: { setLoading },
    dataKey: "client",
    create: {
      NewRecordComponent: FormModal,
      interceptCreation: (payload, callback) => {
        setLoading(true);
        apiCalls.postRequest({
          endpoint: endpoints.clients.postClient,
          httpHeaders: {
            Accept: "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          httpBody: payload,
          successCallback: (res) => {
            notifiers.httpSuccess("New Client Created");
            setLoading(false);
            callback(res, 0);
          },
          errorCallback: (err) => {
            notifiers.httpError(err.message);
            setLoading(false);
          },
        });
      },
      newRecordProps: {
        inputFields: [
          { as: "text", required: true, name: "name" },
          { as: "text", required: true, name: "username" },
          { as: "email", required: true, name: "email" },
          { as: "text", required: true, name: "contact_number" },
          { as: "text", required: true, name: "address" },
          { as: "password", required: true, name: "password" },
          { as: "password", required: true, name: "password_confirmation" },
        ],
        description: "New Client",
        anchorText: "Register New Client",
      },
    },
    update: {
      UpdateComponent: EditModal,
      interceptUpdate: (payload, callback) => {
        setLoading(true);

        apiCalls.postRequest({
          endpoint: endpoints.clients.patchClient.replace(
            "<:clientId>",
            payload.id
          ),
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
      updateDataSource: endpoints.clients.getClient.replace(
        "<:clientId>",
        "<:id>"
      ),
      updateProps: {
        anchorClassName: "flex items-center gap-2",
        description: "Edit Client",
        anchorText: "Edit Client",
        editableFields: [
          {
            name: "name",
            as: "text",
            required: true,
          },
          {
            name: "username",
            as: "text",
            required: true,
          },
          {
            name: "email",
            as: "email",
            required: true,
          },
          {
            name: "contact_number",
            as: "text",
            required: true,
          },
          {
            name: "address",
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
            endpoint: endpoints.clients.bulkDestruction,
            httpHeaders: {
              Accept: "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            httpBody: { client_ids: payload },
            successCallback: (res) => {
              setLoading(false);
              callback(payload, -1);
              notifiers.httpSuccess("Multiple Clients Deleted");
            },
            errorCallback: (res) => {
              setLoading(false);
              notifiers.httpError(err);
            },
          });
        } else {
          apiCalls.deleteRequest({
            endpoint: endpoints.clients.deleteClient.replace(
              "<:clientId>",
              payload
            ),
            httpHeaders: {
              Accept: "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            successCallback: (res) => {
              setLoading(false);
              callback(payload, -1);
              notifiers.httpSuccess("Record Deleted");
            },
            errorCallback: (err) => {
              setLoading(false);
              notifiers.httpError(err);
            },
          });
        }
      },
      deleteProps: {
        anchorText: "Delete Client",
        description: "Delete Client",
        anchorClassName: "flex items-center gap-2",
        consequences: (
          <div className="text-sm">
            <h5 className="text-sm py-2 px-2 font-bold">
              Deleting a Client has the following side effects
            </h5>
            <h4 className="px-4 font-bold">
              The following information will be lost:
            </h4>
            <ul className="px-8 list-disc list-inside">
              <li>All cases registered under a client</li>
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
      searchPopulationEndpoint: endpoints.statistics.searchClientsCount,
      searchPaginationEndpoint: endpoints.pagination.search.searchClients,
      searchFields: [
        "id",
        "name",
        "username",
        "email",
        "contact_number",
        "address",
      ],
    },
  };

  return (
    <div className="py-4">
      <div className=" mx-2">
        <Pagination
          direction="vertical"
          selfVScroll={{
            vScroll: true,
            vClasses: "p-2 max-h-[50vh]",
          }}
          parityClassName={darkMode ? "odd:bg-stone-950" : "odd:bg-gray-200"}
          paginationConfig={{ ...paginationConfig }}
          generalProps={{ setSelectedClient, selectedClient }}
          recordsHeader={
            <div className="flex gap-2 font-bold px-4 py-2">
              <span className="w-6"></span>
              <div className="flex flex-grow">
                <span className="w-1/4">Name</span>
                <span className="w-1/4">Email</span>
                <span className="w-1/4">Address</span>
                <span className="w-1/4">Contact Number</span>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
