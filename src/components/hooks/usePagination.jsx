import { apiCalls } from "../../assets/apiCalls";

export function usePagination() {
  const handlePagination = ({
    paginationEndpoint,
    populationEndpoint,
    paginationEndpointHttpMethod,
    populationEndpointHttpMethod,
    payload,
    pageNumber = 1,
    pagePopulation = 10,
    setEndpointPopulation,
    successCallback = () => {},
    errorCallback = () => {},
  }) => {
    const populationConfig = {
      endpoint: populationEndpoint,
      httpMethod: populationEndpointHttpMethod || "GET",
      httpHeaders: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        Accept: "application/json",
      },
      successCallback: (populationResponse) => {
        const population = parseInt(populationResponse?.count);
        if (population && setEndpointPopulation) {
          setEndpointPopulation(population);
        } else {
          setEndpointPopulation(0);
        }
        if (
          population &&
          pageNumber <= Math.ceil(population / pagePopulation)
        ) {
          const paginationConfig = {
            endpoint: paginationEndpoint + pageNumber + "/" + pagePopulation,
            httpMethod: paginationEndpointHttpMethod || "GET",
            httpHeaders: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
              Accept: "application/json",
            },
            successCallback: successCallback,
          };

          if (paginationEndpointHttpMethod === "POST") {
            paginationConfig.httpHeaders["Content-Type"] = "application/json";
            paginationConfig.httpBody = payload;
          }

          paginationEndpointHttpMethod === "POST"
            ? apiCalls.postRequest(paginationConfig)
            : apiCalls.getRequest(paginationConfig);
        }
      },
      errorCallback,
    };

    if (populationEndpointHttpMethod === "POST") {
      populationConfig.httpHeaders["Content-Type"] = "application/json";
      populationConfig.httpBody = payload;
    }

    populationEndpointHttpMethod === "POST"
      ? apiCalls.postRequest(populationConfig)
      : apiCalls.getRequest(populationConfig);
  };

  return [handlePagination];
}
