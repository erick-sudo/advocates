import { useEffect, useState } from "react";
import { endpoints } from "../../assets/apis";
import { apiCalls } from "../../assets/apiCalls";
import { DataChart } from "../common/DataChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { ModalLink } from "../common/ModalLink";
import { utilityFunctions } from "../../assets/functions";
import { StrokeText } from "../common/StrokeText";
import { SpeedCounter } from "../common/SpeedCounter";
import { ListGroup, ListGroupItem } from "react-bootstrap";

export function Dash() {
  const [casesPerClient, setCasesPerClient] = useState([]);
  const [counts, setCounts] = useState({});
  const [enforcementCases, setEnforcementCases] = useState([]);

  useEffect(() => {
    [
      [endpoints.dash.getCasesPerClient, setCasesPerClient],
      [endpoints.dash.getDashConuts, setCounts],
      [endpoints.dash.getEnforcementCases, setEnforcementCases],
    ].forEach((prop) => {
      apiCalls.getRequest({
        endpoint: prop[0],
        httpHeaders: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          Accept: "application/json",
        },
        successCallback: prop[1],
      });
    });
  }, []);

  const sortedCasesPerClient = casesPerClient.slice();
  sortedCasesPerClient.sort((a, b) => a.cases - b.cases);

  return (
    <div className="flex">
      <div className="flex-grow">
        <div className="flex gap-8 flex-wrap px-8 py-4">
          {Object.keys(counts).map((c, i) => (
            <div
              key={i}
              className="shadow-md py-4 rounded px-12 hover:scale-105 duration-300 hover:shadow-xl hover:shadow-gray-600/50"
            >
              <div className="text-2xl font-bold">
                {utilityFunctions.snakeCaseToTitleCase(c)}
              </div>
              <div className="text-4xl font-extrabold font-mono">
                <StrokeText
                  text={
                    <>
                      <SpeedCounter value={counts[c]} />
                    </>
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <div className=" grid xl:grid-cols-2 p-4 gap-4 items-start">
          <div className="p-2 shadow-md rounded  hover:scale-[1.02] duration-300 hover:shadow-xl hover:shadow-gray-600/50">
            <DataChart
              plot_data={{
                title: (
                  <div className="flex items-center justify-between">
                    <div>Case Distribution</div>
                    <ModalLink
                      submitText="PRINT"
                      description="Print"
                      anchorText=""
                      anchorClassName="text-amber-800 p-2 rounded hover:bg-white hover:-translate-y-2 duration-300"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    />
                  </div>
                ),
                dimensionRatio: 0.6,
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
                      title: {
                        display: true,
                        text: "Number of Cases",
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Clients",
                      },
                    },
                  },
                },
                data: {
                  labels: sortedCasesPerClient.map((s) => s.name),
                  datasets: [
                    {
                      label: "Number of Cases",
                      data: sortedCasesPerClient.map((s) => s.cases),
                      borderColor: "rgb(146 64 14)",
                      backgroundColor: "rgba(107, 114, 128, .7)",
                      fill: true,
                    },
                  ],
                },
              }}
            />
          </div>
          <div className="p-2">
            <h4 className="px-4 text-lg font-bold">Enforcement</h4>
            <ListGroup className="shadow-md shadow-gray-700/50">
              {enforcementCases.map((cs, idx) => (
                <ListGroupItem className="border-amber-700/50" key={idx}>
                  <div className="font-bold text-gray-700/75">{cs.title}</div>
                  <div className="">
                    <span className="mr-2 font-bold text-amber-800/75">CN</span>
                    {cs.case_no_or_parties}
                  </div>
                  <div className="">
                    <span className="mr-2 font-bold text-amber-800/75">FR</span>
                    {cs.file_reference}
                  </div>
                  <div className="">
                    <span className="mr-2 font-bold text-amber-800/75">CR</span>
                    {cs.clients_reference}
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
      
    </div>
  );
}
