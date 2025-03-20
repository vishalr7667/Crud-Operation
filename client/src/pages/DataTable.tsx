import React, { useMemo } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, ColumnDef, flexRender } from "@tanstack/react-table";
import { Link } from "react-router-dom";

// Define the Product Type
export type Product = {
 _id: string;
 name: string;
 price: number;
 description: string;
 image: string;
 createdAt: string;
 updatedAt: string;
 category: string;
 stock: number;
};

// Column definitions
const DataTable: React.FC<{ data: Product[] }> = ({ data }) => {
    // ✅ Move `useMemo` inside the functional component
    const columns = useMemo<ColumnDef<Product>[]>(
      () => [
        { accessorKey: "_id", header: "ID" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "price", header: "Price" },
        { accessorKey: "description", header: "Description" },
        {
          accessorKey: "image",
          header: "Image",
          cell: ({ getValue }) => {
            const imageUrl = (getValue() as string) || "/default-image.jpg";
            return <img src={imageUrl} alt="Product" className="w-16 h-16 object-cover" />;
          },
        },
        { accessorKey: "category", header: "Category" },
        { accessorKey: "stock", header: "Stock" },
        {
          accessorKey: "createdAt",
          header: "Created At",
          cell: ({ getValue }) => {
            const date = getValue() ? new Date(getValue() as string) : null;
            return date ? date.toLocaleString() : "N/A";
          },
        },
        {
          accessorKey: "updatedAt",
          header: "Updated At",
          cell: ({ getValue }) => {
            const date = getValue() ? new Date(getValue() as string) : null;
            return date ? date.toLocaleString() : "N/A";
          },
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center items-center gap-2">
                        <Link to={`/products/${row.original._id}`} className="bg-blue-500 text-white px-4 py-2 rounded-md">View</Link>
                        <Link to={`/products/${row.original._id}/edit`} className="bg-green-500 text-white px-4 py-2 rounded-md">Edit</Link>
                        <Link to={`/products/${row.original._id}/delete`} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</Link>
                    </div>
                )
            }
        },
      ],
      []
    );
  
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(), // ✅ Pagination
      getSortedRowModel: getSortedRowModel(), // ✅ Sorting
      getFilteredRowModel: getFilteredRowModel(), // ✅ Filters
    });
  
    return (
      <>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => table.getColumn("name, description, category")?.setFilterValue(e.target.value)}
          className="border p-2 mt-2 mb-4 rounded-2xl border-gray-400 float-right block"
        />
  
        <div className="p-4">
          <table className="border-collapse w-full border border-gray-300">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-200">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="border border-gray-300 p-2">
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="font-bold w-full h-full text-left flex items-center justify-between px-2 py-1"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" ? " 🔼" : header.column.getIsSorted() === "desc" ? " 🔽" : ""}
                      </button>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border border-gray-300 p-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </>
    );
  };
  
  export default DataTable;
  