import { useEffect, useRef, useState } from "react";
import { usePagination } from "../hooks/usePagination";
import { ScaleButton } from "./ScaleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faHandPointer,
} from "@fortawesome/free-solid-svg-icons";
import { Background } from "./DottedBackground";
import { Dna } from "react-loader-spinner";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { utilityFunctions } from "../../assets/functions";
import { Dropdown } from "react-bootstrap";
import { NoResults } from "./NoResults";

export function Pagination({
  paginationConfig: {
    modelName = "Record",
    paginationEndpoint,
    paginationEndpointHttpMethod,
    populationEndpoint,
    populationEndpointHttpMethod,
    postEndpointPayload = {},
    itemsPerPage = 4,
    itemsPrimaryKey,
    componentName,
    detailsComponent,
    detailsProps,
    dataKey = "data",
    create: { NewRecordComponent, newRecordProps, interceptCreation } = {},
    destroy: { DeleteComponent, deleteProps, interceptDestruction } = {},
    update: {
      UpdateComponent,
      updateProps,
      interceptUpdate,
      updateDataSource,
    } = {},
    searchSupport: {
      support,
      searchFields,
      searchPopulationEndpoint,
      searchPaginationEndpoint,
    } = {
      searchPopulationEndpoint: "",
      searchPaginationEndpoint: "",
      support: false,
      searchFields: [],
    },
  },
  parityClassName = "",
  itemsClassName = "",
  items: [items, setItems] = useState([]),
  generalProps = {},
  direction = "vertical",
  selfVScroll: { vScroll, vStyle, vClasses } = {
    vScroll: false,
    vStyle: {},
    vClasses: "",
  },
  pageTracker: [nextPage, setNextPage] = useState(1),
  childClassName,
  recordsHeader,
}) {
  const [containerRef, scrollWrapperRef, scrollDownRef] = [
    useRef(),
    useRef(),
    useRef(),
  ];
  const PaginationChild = componentName;
  const ChildDetails = detailsComponent;
  const [refresher, setRefresher] = useState(0);
  const [stagedItems, setStagedItems] = useState([]);
  const [handlePagination] = usePagination();
  const [pagePopulation, setPagePopulation] = useState(itemsPerPage);
  const [endpointPopulation, setEndpointPopulation] = useState(0);
  const [endpoint, setEndpoint] = useState({
    data: paginationEndpoint,
    count: populationEndpoint,
  });

  const [search, setSearch] = useState({
    q: searchFields[0],
    v: "",
  });

  const updateStagedItems = (id, action) => {
    if (action > 0) {
      setStagedItems([...stagedItems, id]);
    } else if (action < 0) {
      setStagedItems(stagedItems.filter((c) => c !== id));
    } else {
    }
  };

  const handlePageFetch = (n, s) => {
    handlePagination({
      paginationEndpoint: endpoint.data,
      populationEndpoint: endpoint.count,
      paginationEndpointHttpMethod,
      populationEndpointHttpMethod,
      payload: postEndpointPayload,
      pageNumber: n,
      pagePopulation: s,
      errorCallback: (error) => {},
      setEndpointPopulation,
      successCallback: (res) => {
        if (Array.isArray(res) && res.length > 0) {
          setItems(res);
          // setNextPage(n + 1);
        }
      },
    });
  };

  const handleChange = (k, v) => {
    setSearch({
      ...search,
      [k]: v,
    });
  };

  const normalCrudManipulator = (newItem, state) => {
    if (state === 0) {
      // Add a new record
      setItems([newItem, ...items]);
    } else if (state < 0) {
      // Deleted Record/s
      if (Array.isArray(newItem)) {
        setItems((itms) =>
          itms.filter((i) => !newItem.includes(i[itemsPrimaryKey]))
        );
      } else {
        setItems((itms) => itms.filter((i) => i[itemsPrimaryKey] !== newItem));
      }
    } else {
      // Update the item
      setItems((itms) =>
        itms.map((i) =>
          i[itemsPrimaryKey] === newItem[itemsPrimaryKey] ? newItem : i
        )
      );
    }
    setStagedItems([]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setNextPage(1);
    setItems([]);
    let newPaginationEndpoint = searchPaginationEndpoint.replace(
      "<:q>",
      search.q
    );
    newPaginationEndpoint = newPaginationEndpoint.replace("<:v>", search.v);
    let newPopulationEndpoint = searchPopulationEndpoint.replace(
      "<:q>",
      search.q
    );
    newPopulationEndpoint = newPopulationEndpoint.replace("<:v>", search.v);
    setEndpoint({
      data: newPaginationEndpoint,
      count: newPopulationEndpoint,
    });
  };

  const triggerRefresh = () => {
    setRefresher((p) => p + 1);
  };

  // Register an event listener on the closest scrollable element
  useEffect(() => {
    const endOfScrollDetector = (e) => {
      // const [scrollTop, clientHeight, scrollHeight] =
      //   direction === "vertical"
      //     ? [e.target.scrollTop, e.target.clientHeight, e.target.scrollHeight]
      //     : [e.target.scrollLeft, e.target.clientWidth, e.target.scrollWidth];
      // if (scrollTop + clientHeight >= scrollHeight) {
      //   triggerRefresh();
      // }
    };

    const windowResizeHandler = (e) => {
      const currentNumberOfChildren = containerRef.current.children.length;
      const childW = containerRef.current.firstElementChild?.offsetWidth;
    };

    const mouseOverHandler = (e) => {
      scrollDownRef.current.style.top =
        ((e.clientY - scrollWrapperRef.current.getBoundingClientRect().top) /
          scrollWrapperRef.current.offsetHeight) *
          90 +
        "%";
    };

    scrollWrapperRef.current.addEventListener("mousemove", mouseOverHandler);

    containerRef.current
      ?.closest(direction === "vertical" ? ".scroll_y" : ".scroll_x")
      ?.addEventListener("scroll", endOfScrollDetector);

    window.addEventListener("resize", windowResizeHandler);

    return () => {
      containerRef.current
        ?.closest(direction === "vertical" ? ".scroll_y" : ".scroll_x")
        ?.removeEventListener("scroll", endOfScrollDetector);
      window.removeEventListener("resize", windowResizeHandler);
    };
  }, []);

  // Automatically fetch the next page when the page count increases
  useEffect(() => {
    handlePageFetch(nextPage, pagePopulation);
    if (direction === "vertical") {
      containerRef.current.closest(".scroll_y")?.scrollBy({
        top: -2000,
        behavior: "smooth",
      });
    } else {
      scrollWrapperRef.current.scrollBy({
        left: -200000,
        behavior: "smooth",
      });
    }

    return () => {
      setItems([])
      setNextPage(1)
    }
  }, [refresher, endpoint, paginationEndpoint, populationEndpoint]);

  const stagedViews = stagedItems.map((k) =>
    items.find((itm) => itm[itemsPrimaryKey] === k)
  );

  return (
    <div className="border-1 border-transparent">
      <div className="py-2 px-4 flex items-center gap-4">
        {/* Create Support */}
        {typeof NewRecordComponent === "function" && (
          <NewRecordComponent
            {...newRecordProps}
            {...{
              onSubmit: (payload) => {
                if (typeof interceptCreation === "function") {
                  interceptCreation(payload, normalCrudManipulator);
                }
              },
            }}
          />
        )}

        {(typeof DeleteComponent === "function" ||
          typeof UpdateComponent === "function") && (
          <Dropdown>
            <Dropdown.Toggle className="text-bg-dark px-4" variant="dark">
              {stagedItems.length > 0 ? "Actions" : `Select ${modelName}`}
            </Dropdown.Toggle>
            {stagedItems.length > 0 && (
              <Dropdown.Menu data-bs-theme="dark">
                {typeof DeleteComponent === "function" && (
                  <>
                    {stagedItems.length == 1 && (
                      <Dropdown.Item>
                        {/* Destroy Support */}
                        <DeleteComponent
                          recordPrimaryKey={stagedItems[0]}
                          {...{
                            interceptDestruction: interceptDestruction
                              ? (id) => {
                                  if (
                                    typeof interceptDestruction === "function"
                                  ) {
                                    interceptDestruction(
                                      id,
                                      normalCrudManipulator
                                    );
                                  } else {
                                    normalCrudManipulator(id, -1);
                                  }
                                }
                              : undefined,
                          }}
                          {...normalCrudManipulator}
                          {...deleteProps}
                        />
                      </Dropdown.Item>
                    )}
                    {stagedItems.length > 1 && (
                      <Dropdown.Item>
                        <DeleteComponent
                          multiple={true}
                          recordPrimaryKeys={stagedItems}
                          {...{
                            interceptDestruction: interceptDestruction
                              ? (ids) => {
                                  if (
                                    typeof interceptDestruction === "function"
                                  ) {
                                    interceptDestruction(
                                      ids,
                                      normalCrudManipulator
                                    );
                                  } else {
                                    normalCrudManipulator(id, -1);
                                  }
                                }
                              : undefined,
                          }}
                          {...normalCrudManipulator}
                          {...deleteProps}
                        />
                      </Dropdown.Item>
                    )}
                  </>
                )}

                {/* Destroy Support */}
                {typeof UpdateComponent === "function" && (
                  <>
                    {stagedItems.length == 1 && (
                      <Dropdown.Item>
                        <UpdateComponent
                          {...{
                            interceptUpdate: (payload) => {
                              interceptUpdate(
                                {
                                  payload: payload,
                                  [itemsPrimaryKey || "index"]: itemsPrimaryKey
                                    ? items.find(
                                        (i) =>
                                          i[itemsPrimaryKey] === stagedItems[0]
                                      )[itemsPrimaryKey]
                                    : items.indexOf(stagedItems[0]),
                                },
                                normalCrudManipulator
                              );
                            },
                          }}
                          {...updateProps}
                          {...{
                            dataEndpoint: updateDataSource.replace(
                              `<:${itemsPrimaryKey}>`,
                              stagedItems[0]
                            ),
                          }}
                        />
                      </Dropdown.Item>
                    )}
                  </>
                )}
              </Dropdown.Menu>
            )}
          </Dropdown>
        )}
      </div>
      {support && searchFields?.length > 0 && (
        <form onSubmit={handleSearch} className="flex-grow px-4 py-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1 rounded overflow-hidden px-4">
            {searchFields.map((p, i) => (
              <div className="flex gap-2" key={i}>
                <input
                  name="q"
                  checked={search.q === p}
                  value={p}
                  type="radio"
                  onChange={(e) => handleChange("q", e.target.value)}
                />
                <span>{utilityFunctions.snakeCaseToTitleCase(p)}</span>
              </div>
            ))}
          </div>
          <div className="flex shadow-md shadow-amber-900/50 rounded overflow-hidden max-w-lg">
            <input
              required
              className="flex-grow py-2 px-4 outline-none"
              placeholder={`Search by ${
                search.v
                  ? utilityFunctions.snakeCaseToTitleCase(search.v)
                  : "..."
              }`}
              type="text"
              value={search.v}
              onChange={(e) => handleChange("v", e.target.value)}
            />
            <button className="px-4 bg-amber-800 text-white hover:bg-amber-900 duration-300">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </form>
      )}
      <div className="relative">
        {items.length > 0 && direction !== "vertical" && (
          <ScaleButton
            onClick={() => {
              scrollWrapperRef.current.scrollBy({
                left: -200,
                behavior: "smooth",
              });
            }}
            className={`absolute z-40 top-[50%] left-1 hover:bg-yellow-600 hover:text-white`}
            text={<FontAwesomeIcon icon={faArrowLeft} />}
          />
        )}
        {items.length > 0 && direction !== "vertical" && (
          <ScaleButton
            onClick={() => {
              triggerRefresh();
              scrollWrapperRef.current.scrollBy({
                left: -200,
                behavior: "smooth",
              });
            }}
            className={`absolute z-40 top-[50%] right-1 hover:bg-yellow-600 hover:text-white`}
            text={<FontAwesomeIcon icon={faArrowRight} />}
          />
        )}
        {direction === "vertical" && (
          <div
            ref={scrollDownRef}
            className="scroll_down_button absolute z-40 duration-200 right-2"
          >
            <ScaleButton
              onClick={() => {
                triggerRefresh();
              }}
              className={`hover:bg-amber-800 shadow-md shadow-gray-500  hover:text-white`}
              text={<FontAwesomeIcon icon={faArrowDown} />}
            />
          </div>
        )}
        <div
          style={direction === "vertical" ? (vScroll ? vStyle : {}) : {}}
          ref={scrollWrapperRef}
          className={`${
            direction === "vertical"
              ? vScroll
                ? vClasses + " scroll_y"
                : ""
              : "scroll_x"
          }`}
        >
          <div
            ref={containerRef}
            className={`${
              direction === "vertical"
                ? "flex flex-col flex-grow w-full"
                : "flex"
            } ${itemsClassName}`}
          >
            {recordsHeader}
            {items.length > 0 ? (
              items.map((componentData, index) => {
                const dt = { [dataKey]: componentData };
                return typeof UpdateComponent === "function" ||
                  typeof DeleteComponent === "function" ? (
                  <Item
                    {...{
                      primaryKey: itemsPrimaryKey,
                      updateStagedItems,
                    }}
                    key={index}
                    staged={stagedItems.includes(componentData[itemsPrimaryKey])}
                    item={componentData}
                    parityClassName={parityClassName}
                  >
                    {typeof componentName === "function" && (
                      <PaginationChild
                        className={`z-10 ${childClassName}`}
                        {...dt}
                        {...generalProps}
                        {...{ items, setItems }}
                      />
                    )}
                  </Item>
                ) : (
                  typeof componentName === "function" && (
                    <PaginationChild
                      className={`z-10 ${childClassName} ${parityClassName}`}
                      {...dt}
                      {...generalProps}
                      {...{ items, setItems }}
                      key={index}
                    />
                  )
                );
              })
            ) : (
              <div className="min-h-[35vh] flex relative">
                <Background />
                <div className="flex flex-col justify-center items-center flex-grow">
                  <span className="text-4xl dancing text-amber-900 z-20">
                    No records found
                  </span>
                  <Dna />
                </div>
              </div>
            )}
          </div>
        </div>

        <PageBadges
          population={endpointPopulation}
          nextPage={nextPage}
          itemsPerPage={itemsPerPage}
          setNextPage={setNextPage}
          triggerRefresh={triggerRefresh}
        />
      </div>

      {typeof detailsComponent === "function" && (
        <div>
          {stagedItems.length > 0 ? (
            <div>
              {typeof ChildDetails === "function" &&
                stagedViews.map((item, idx) => (
                  <ChildDetails
                    normalCrudManipulator={normalCrudManipulator}
                    key={idx}
                    {...{ [dataKey]: item }}
                    {...detailsProps}
                  />
                ))}
            </div>
          ) : (
            <div>
              <NoResults
                content={
                  <h2 className="font-bold flex items-center gap-2">
                    <FontAwesomeIcon icon={faHandPointer} />
                    <span>Select {modelName}s above</span>
                  </h2>
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Item({
  staged,
  children,
  item,
  primaryKey,
  updateStagedItems,
  parityClassName,
}) {
  return (
    <div className={`flex ${parityClassName}`}>
      <div className="flex items-center justify-center min-w-[2.5rem] ">
        <input
          onChange={(e) => {
            e.stopPropagation();
            if (!e.target.checked) {
              updateStagedItems(item[primaryKey], -1);
            } else {
              updateStagedItems(item[primaryKey], 1);
            }
          }}
          className="scale-125 origin-center"
          type="checkbox"
          style={{ margin: 0 }}
          value={staged}
          checked={staged}
        />
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
}

function PageBadges({
  itemsPerPage,
  nextPage,
  population,
  setNextPage,
  triggerRefresh,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(nextPage || 1);
  }, [nextPage]);

  const N = Math.ceil(population / itemsPerPage);

  const pages = new Array(N).fill(0).map((n, i) => i + 1);
  const [first, last] = [
    pages.slice(0, pages.indexOf(parseInt(nextPage))).slice(0, 4),
    pages.slice(pages.indexOf(parseInt(nextPage)) + 1).slice(-4),
  ];

  return (
    <div className="pb-2 text-xs">
      <div className="flex items-center justify-center gap-1 font-bold">
        <span>Page</span>
        <span>{nextPage}</span>
        <span>of</span>
        <span>{N}</span>
      </div>
      <div className="flex gap-3 p-2 items-end font-bold duration-300 relative">
        <div className="flex flex-grow justify-end gap-3">
          <div className="flex gap-2">
            {first.map((page) => (
              <button
                key={page}
                onClick={() => {
                  setNextPage(page);
                  triggerRefresh();
                }}
                className="px-2 box_shadow shadow-black/50 rounded text-amber-900 font-bold py-1"
              >
                {page}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-end">
            {new Array(4 - first.length).fill("_").map((dash, i) => (
              <span key={i} className="font-bold text-amber-800">
                {dash}
              </span>
            ))}
          </div>
        </div>
        <div className="text-amber-800 relative flex flex-col gap-2 items-stretch justify-between">
          {nextPage > 1 && (
            <button
              onClick={() => {
                if (nextPage > 1) {
                  setNextPage(nextPage - 1);
                  triggerRefresh();
                }
              }}
              className="absolute right-[100%] -translate-x-4 px-2 min-w-[8rem] box_shadow shadow-black/50 rounded text-amber-900 font-bold py-1 hover:translate-y-2 duration-200"
            >
              Previous
            </button>
          )}
          <input
            type="number"
            min={1}
            max={N}
            placeholder="N"
            value={currentPage}
            onChange={(e) => {
              setCurrentPage(e.target.value);
            }}
            className="outline-none w-max shadow-sm border-1 border-amber-800 rounded py-1 px-2 text-center font-bold"
          />

          <button
            onClick={() => {
              if (currentPage < 1) {
                setNextPage(1);
                triggerRefresh();
              } else if (currentPage > N) {
                setNextPage(N);
                triggerRefresh();
              } else {
                setNextPage(currentPage);
                triggerRefresh();
              }
            }}
            className="px-2 box_shadow shadow-black/50 rounded text-amber-800 font-bold py-1 hover:translate-y-2 duration-200"
          >
            <span className="">Go</span>
          </button>

          {nextPage < N && (
            <button
              onClick={() => {
                if (nextPage < N) {
                  setNextPage(nextPage + 1);
                  triggerRefresh();
                }
              }}
              className="absolute left-[100%] translate-x-4 px-2 min-w-[8rem] box_shadow shadow-black/50 rounded text-amber-900 font-bold py-1 hover:translate-y-2 duration-200"
            >
              Next
            </button>
          )}
        </div>
        <div className="flex flex-grow gap-3 items-end">
          <div className="flex gap-2">
            {new Array(4 - last.length).fill("_").map((dash, i) => (
              <span key={i} className="font-bold text-amber-800">
                {dash}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            {last.map((page) => (
              <button
                key={page}
                onClick={() => {
                  setNextPage(page);
                  triggerRefresh();
                }}
                className="px-2 box_shadow shadow-black/50 rounded text-amber-900 font-bold py-1"
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
