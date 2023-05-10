import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { GloablFilter } from "./GloablFilter";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import TicketDetailModal from "./TicketDetailModal";
import useTickets from "../hooks/useTickets";
// const tickets = [
//   {
//     id: 1,
//     title: "Ticket 1",
//     price: 10,
//   },
//   {
//     id: 2,
//     title: "Ticket 2",
//     price: 20,
//   },
// ];
const TicketList = () => {
  const navigate = useNavigate();
  const { fetchTickets, tickets } = useTickets();

  useEffect(() => {
    fetchTickets();
  }, []);

  const COLUMNS = [
    {
      Header: "Title",
      Footer: "Title",
      accessor: "title",
    },
    {
      Header: "Price",
      Footer: "price",
      accessor: "price",
    },
    {
      Header: "Options",
      Footer: "Options",
      accessor: "id",
    },
  ];
  const columns = useMemo(() => COLUMNS, []);
  const tableInstance = useTable(
    {
      columns,
      data: tickets,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    //Filter elements
    state,
    setGlobalFilter,
    rows,
    prepareRow,
    //Pagination
    page,
    nextPage,
    canNextPage,
    previousPage,
    canPreviousPage,
    gotoPage,
    pageCount,
    pageOptions,
  } = tableInstance;

  const { globalFilter, pageIndex } = state;

  if (tickets.length === 0) {
    return (
      <h1 className="text-4xl text-gray-700 font-bold">
        There are not tickets yet, please create one to sell it :)
      </h1>
    );
  }

  return (
    <div className="container max-w-[600px] shadow-md bg-white sm:rounded-lg ">
      <div className="flex flex-col items-center w-auto">
        <h1 className="text-center text-4xl font-bold text-blue-400 my-4">
          Listado de Tickets
        </h1>
        <GloablFilter
          filter={globalFilter}
          setFilter={setGlobalFilter}
          text="Buscar Ticket"
        />
      </div>

      <div className="overflow-x-auto  ">
        <table
          className="w-full text-sm text-left text-gray-500 dark:text-gray-400 "
          {...getTableProps()}
        >
          <thead className="text-xs text-white uppercase text-left bg-blue-700">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    scope="col"
                    className="px-6 py-3"
                    {...column.getHeaderProps(column.getSortByToggleProps)}
                  >
                    {column.render("Header")}
                    <span className=" font-bold text-lg">
                      {column.isSorted ? (column.isSortedDesc ? "-" : "+") : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps} className="text-left">
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  className="bg-blue-500 hover:bg-gray-900"
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell) => {
                    if (cell.column.Header === "Options") {
                      return (
                        <td key={cell.value}>
                          <TicketDetailModal ticket={cell.row.values} />
                        </td>
                      );
                    }
                    return (
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                        {...cell.getCellProps()}
                      >
                        {cell.column.id == "consult_date"
                          ? dateFormat(cell.value)
                          : cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          {/*<tfoot>
{footerGroups.map(footerGroup => (
  <tr {...footerGroup.getFooterGroupProps()}>
      {footerGroup.headers.map(column => (
          <td className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700" {...column.getFooterProps()}>
              {column.render('Footer')} 
          </td>
      ))}
  </tr>
))}
</tfoot>*/}
        </table>
        {/*Pagination*/}
        <div className="flex flex-row justify-between">
          <div className="mt-5 ml-4">
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
          </div>
          <div className="buttons">
            <button
              className=" bg-blue-500  text-base text-white shadow-md shadow-slate-500 m-3 p-2 rounded-md  text-center hover:bg-blue-700 hover:cursor-pointer"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              {"Anterior"}
            </button>
            <button
              className=" bg-blue-500 text-base text-white m-3 p-2 rounded-md shadow-md shadow-slate-500  text-center hover:bg-blue-700 hover:cursor-pointer"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              {"Siguiente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketList;
