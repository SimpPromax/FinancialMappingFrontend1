import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, RefreshCwIcon, FileTextIcon } from 'lucide-react';

const ViewSavedData = () => {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const sheetsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/excel/data');

      if (Array.isArray(response.data)) {
        setSheets(response.data);
      } else {
        setSheets([]);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      setError('Failed to load saved data. Please try again.', err);
      setSheets([]);
    } finally {
      setLoading(false);
    }
  };

  const getTotalElements = () => {
    return sheets.reduce((total, sheet) => total + (sheet.excelElements?.length || 0), 0);
  };

  const getDisplayElements = (sheet) => {
    let elements = [...(sheet.excelElements || [])];

    // Search filter only
    if (search.trim()) {
      const q = search.toLowerCase();
      elements = elements.filter(el =>
        el.excelElement?.toLowerCase().includes(q) ||
        el.exelCellValue?.toLowerCase().includes(q)
      );
    }

    return elements;
  };

  // Calculate pagination values
  const totalPages = Math.ceil(sheets.length / sheetsPerPage);
  const startIndex = currentPage * sheetsPerPage;
  const endIndex = startIndex + sheetsPerPage;
  const currentSheets = sheets.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading saved data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg mt-4 sm:mt-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <ArrowLeftIcon size={18} />
          Back
        </button>

        <div className="text-center flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Saved Excel Data</h1>
          <p className="text-gray-600 text-sm">View and manage your saved Excel configurations</p>
        </div>

        <button
          onClick={loadSavedData}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <RefreshCwIcon size={18} />
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search elements..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Stats */}
      {sheets.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-blue-600">{sheets.length}</div>
            <div className="text-blue-800 text-xs sm:text-sm">Total Sheets</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-green-600">{getTotalElements()}</div>
            <div className="text-green-800 text-xs sm:text-sm">Total Elements</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center col-span-2 sm:col-span-1">
            <div className="text-xl font-bold text-purple-600">
              {Math.round(getTotalElements() / sheets.length)}
            </div>
            <div className="text-purple-800 text-xs sm:text-sm">Avg Elements/Sheet</div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="space-y-6">
        {sheets.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
            <FileTextIcon size={50} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Saved Data Found</h3>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Excel Configuration
            </button>
          </div>
        ) : (
          currentSheets.map((sheet, index) => (
            <div
              key={startIndex + index}
              className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  {sheet.excellSheetName}
                </h3>

                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs sm:text-sm rounded-full font-medium w-fit">
                  {sheet.excelElements?.length || 0} elements
                  {search.trim() && getDisplayElements(sheet).length !== sheet.excelElements?.length &&
                    ` (${getDisplayElements(sheet).length} filtered)`
                  }
                </span>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Line Item
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Cell Value
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {getDisplayElements(sheet).length ? (
                      getDisplayElements(sheet).map((el, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-800">{el.excelElement}</td>
                          <td className="px-4 py-3 text-gray-600 font-mono">{el.exelCellValue}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="px-4 py-6 text-center text-gray-500">
                          {search.trim() ? 'No matching elements found' : 'No elements in this sheet'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination - Only show if there are multiple pages */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            <ArrowLeftIcon size={18} />
            Previous Page
          </button>

          <div className="text-center">
            <span className="font-semibold text-gray-700">
              Page {currentPage + 1} of {totalPages}
            </span>
            <p className="text-sm text-gray-600 mt-1">
              Showing sheets {startIndex + 1}-{Math.min(endIndex, sheets.length)} of {sheets.length}
            </p>
          </div>

          <button
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            Next Page
            <ArrowLeftIcon size={18} className="rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewSavedData;