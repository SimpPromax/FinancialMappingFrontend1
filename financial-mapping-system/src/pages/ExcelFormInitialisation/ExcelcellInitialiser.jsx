import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Plus, Save, Eye, Trash2, X, Info } from 'lucide-react';

const ExcelDataCollector = () => {
  const [activeTab, setActiveTab] = useState('sheet');
  const [sheets, setSheets] = useState([]);
  const [availableSheetNames, setAvailableSheetNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load available file names on component mount
  useEffect(() => {
    const loadExcelFiles = async () => {
      try {
        const response = await axios.get('/api/excel/files');
        
        if (Array.isArray(response.data)) {
          const fileNames = response.data.map(file => file.fileName).filter(Boolean);
          setAvailableSheetNames(fileNames);
        } else {
          setAvailableSheetNames(['sample-file.xlsx', 'test-data.xlsx']);
        }
      } catch (error) {
        console.error('Error loading file names:', error);
        setAvailableSheetNames(['financial-report.xlsx', 'sales-data.xlsx', 'inventory-list.xlsx']);
      }
    };

    loadExcelFiles();
  }, []);

  const showAlert = (type, message) => {
    Swal.fire({
      icon: type,
      title: message,
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false,
      position: 'top-end',
      toast: true
    });
  };

  const addNewSheet = () => {
    const newSheet = {
      id: Date.now(),
      sheetName: '',
      elements: [],
      headerText: 'Select File'
    };
    setSheets(prev => [...prev, newSheet]);
  };

  const deleteSheet = (sheetId) => {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this sheet?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setSheets(prev => prev.filter(sheet => sheet.id !== sheetId));
      }
    });
  };

  const handleSheetNameChange = async (sheetId, newSheetName) => {
    setSheets(prev => prev.map(sheet => 
      sheet.id === sheetId 
        ? { ...sheet, sheetName: newSheetName, headerText: newSheetName || 'Select File' }
        : sheet
    ));

    if (newSheetName) {
      try {
        const response = await axios.get(`/api/excel/elements?sheetName=${encodeURIComponent(newSheetName)}`);
        const predefinedElements = Array.isArray(response.data) ? response.data : [];
        
        if (predefinedElements && predefinedElements.length > 0) {
          setSheets(prev => prev.map(sheet => 
            sheet.id === sheetId 
              ? { 
                  ...sheet, 
                  elements: predefinedElements.map(el => ({
                    id: Date.now() + Math.random(),
                    elementName: el.excelElement || '',
                    cellValue: el.exelCellValue || ''
                  }))
                }
              : sheet
          ));
        } else {
          setSheets(prev => prev.map(sheet => 
            sheet.id === sheetId 
              ? { ...sheet, elements: [] }
              : sheet
          ));
        }
      } catch (error) {
        console.error('Error loading elements:', error);
        showAlert('error', 'Could not load Excel elements');
        setSheets(prev => prev.map(sheet => 
          sheet.id === sheetId 
            ? { ...sheet, elements: [] }
            : sheet
        ));
      }
    } else {
      setSheets(prev => prev.map(sheet => 
        sheet.id === sheetId 
          ? { ...sheet, elements: [] }
          : sheet
      ));
    }
  };

  const addNewElement = (sheetId) => {
    setSheets(prev => prev.map(sheet => 
      sheet.id === sheetId 
        ? { 
            ...sheet, 
            elements: [...sheet.elements, { 
              id: Date.now() + Math.random(), 
              elementName: '', 
              cellValue: '' 
            }]
          }
        : sheet
    ));
  };

  const deleteElement = (sheetId, elementId) => {
    const sheet = sheets.find(s => s.id === sheetId);
    const element = sheet?.elements.find(el => el.id === elementId);
    const elementName = element?.elementName || 'this element';

    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete "${elementName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setSheets(prev => prev.map(sheet => 
          sheet.id === sheetId 
            ? { ...sheet, elements: sheet.elements.filter(el => el.id !== elementId) }
            : sheet
        ));
      }
    });
  };

  const updateElement = (sheetId, elementId, field, value) => {
    setSheets(prev => prev.map(sheet => 
      sheet.id === sheetId 
        ? {
            ...sheet,
            elements: sheet.elements.map(el =>
              el.id === elementId ? { ...el, [field]: value } : el
            )
          }
        : sheet
    ));
  };

  const validateSaveButton = () => {
    if (sheets.length === 0) return false;

    const usedSheetNames = new Set();
    
    for (const sheet of sheets) {
      const sheetName = sheet.sheetName.trim();
      if (!sheetName) return false;
      
      if (usedSheetNames.has(sheetName)) return false;
      usedSheetNames.add(sheetName);

      if (sheet.elements.length === 0) return false;

      const usedElementNames = new Set();
      const usedCellValues = new Set();

      for (const element of sheet.elements) {
        const elementName = element.elementName.trim();
        const cellValue = element.cellValue.trim();

        if (!elementName || !cellValue) return false;
        
        if (usedElementNames.has(elementName)) return false;
        usedElementNames.add(elementName);

        if (usedCellValues.has(cellValue)) return false;
        usedCellValues.add(cellValue);
      }
    }

    return true;
  };

  const saveAllData = async () => {
    if (!validateSaveButton()) return;

    const excelSheets = sheets.map(sheet => ({
      excellSheetName: sheet.sheetName,
      excelElements: sheet.elements.map(el => ({
        excelElement: el.elementName,
        exelCellValue: el.cellValue
      }))
    }));

    console.log('💾 Saving data:', excelSheets);

    try {
      setIsLoading(true);
      const response = await axios.post('/api/excel/save', excelSheets);
      
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message || 'Data saved successfully!',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        throw new Error(response.data.message || 'Error saving data');
      }
    } catch (error) {
      console.error('Save error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || error.message || 'Failed to save data',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canSave = validateSaveButton();

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/webimage2.png')" }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Excel Data Collector</h2>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('sheet')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'sheet'
                    ? 'border-black text-black font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>Excel Sheet</span>
                {activeTab === 'sheet' && (
                  <span className="w-2 h-2 bg-black rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('workbook')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'workbook'
                    ? 'border-black text-black font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>Excel Workbook</span>
                {activeTab === 'workbook' && (
                  <span className="w-2 h-2 bg-black rounded-full"></span>
                )}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {/* Excel Sheet Tab */}
            {activeTab === 'sheet' && (
              <div>
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={addNewSheet}
                    className="neu-btn px-4 py-2 flex items-center space-x-2 text-gray-700 font-medium"
                  >
                    <Plus size={16} />
                    <span>Add Excel Sheet</span>
                  </button>
                  
                  <button
                    onClick={saveAllData}
                    disabled={!canSave || isLoading}
                    className={`neu-btn px-4 py-2 flex items-center space-x-2 font-medium ${
                      !canSave || isLoading 
                        ? 'opacity-50 cursor-not-allowed text-gray-400' 
                        : 'text-gray-700 hover:text-green-700'
                    }`}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    <span>{isLoading ? 'Saving...' : 'Save All Data'}</span>
                  </button>

                  <a
                    href="/viewsaveddata"
                    className="neu-btn px-4 py-2 flex items-center space-x-2 text-gray-700 font-medium"
                  >
                    <Eye size={16} />
                    <span>View Saved Data</span>
                  </a>
                </div>

                <div className="space-y-6">
                  {sheets.map((sheet) => (
                    <div key={sheet.id} className="border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-300 flex justify-between items-center">
                        <div className="flex-1 min-w-0 mr-4">
                          <h6 className="text-sm font-medium text-gray-900 truncate">
                            {sheet.headerText}
                          </h6>
                        </div>
                        
                        <div className="flex-1 mx-4">
                          <div className="relative">
                            <select
                              value={sheet.sheetName}
                              onChange={(e) => handleSheetNameChange(sheet.id, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
                              required
                            >
                              <option value="">Select File</option>
                              {Array.isArray(availableSheetNames) && availableSheetNames.map((fileName) => (
                                <option key={fileName} value={fileName}>
                                  {fileName}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteSheet(sheet.id)}
                          className="ml-4 px-3 py-1 bg-red-500 text-white rounded-full text-sm flex items-center space-x-1 hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                          <span>Delete Sheet</span>
                        </button>
                      </div>

                      <div className="p-6">
                        <div className="space-y-3 mb-4">
                          {sheet.elements.map((element) => (
                            <div key={element.id} className="flex flex-col md:flex-row gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Line Item
                                </label>
                                <input
                                  type="text"
                                  value={element.elementName}
                                  onChange={(e) => updateElement(sheet.id, element.id, 'elementName', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Line Item"
                                  maxLength={100}
                                  required
                                />
                              </div>
                              
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Cell Value
                                </label>
                                <input
                                  type="text"
                                  value={element.cellValue}
                                  onChange={(e) => updateElement(sheet.id, element.id, 'cellValue', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Cell Value"
                                  required
                                />
                              </div>
                              
                              <div className="flex items-end">
                                <button
                                  onClick={() => deleteElement(sheet.id, element.id)}
                                  className="w-full md:w-auto px-3 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors flex items-center space-x-1"
                                >
                                  <X size={14} />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => addNewElement(sheet.id)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2 text-sm"
                        >
                          <Plus size={14} />
                          <span>Add Data Element</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {sheets.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No sheets added yet. Click "Add Excel Sheet" to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Excel Workbook Tab */}
            {activeTab === 'workbook' && (
              <div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <Info size={16} />
                    <span className="font-medium">Workbook functionality coming soon!</span>
                  </div>
                </div>
                <div id="workbookContainer"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .neu-btn {
          background-color: white;
          border-radius: 12px;
          box-shadow: 6px 6px 12px #c5c9cc, -6px -6px 12px #ffffff;
          color: #333;
          font-weight: 500;
          transition: all 0.2s ease-in-out;
          border: none;
        }
        .neu-btn:hover:not(:disabled) {
          box-shadow: inset 4px 4px 8px #c5c9cc, inset -4px -4px 8px #ffffff;
          transform: scale(1.02);
          background-color: #e3f1e8;
        }
        .neu-btn:active:not(:disabled) {
          box-shadow: inset 4px 4px 8px #c5c9cc, inset -4px -4px 8px #ffffff;
          transform: scale(0.98);
          background-color: #e3f1e8;
        }
      `}</style>
    </div>
  );
};

export default ExcelDataCollector;