import { useState } from 'react';
import {
    ArrowUpTrayIcon,
    ClipboardDocumentIcon,
    Cog6ToothIcon,
    DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

export default function BulkOperationsPanel({ assessmentId, onImportComplete }) {
    const [activeTab, setActiveTab] = useState('csv'); // csv, paste, bulk
    const [uploading, setUploading] = useState(false);
    const [pasteData, setPasteData] = useState('');
    const [bulkValue, setBulkValue] = useState('');
    const [selectedOption, setSelectedOption] = useState('all'); // all, selected

    const handleCsvUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const response = await axios.post(`/teacher/assessments/${assessmentId}/import`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                alert(`Successfully imported ${response.data.imported} marks!`);
                if (response.data.errors.length > 0) {
                    console.warn('Import errors:', response.data.errors);
                }
                onImportComplete?.();
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload CSV. Please check the format and try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await axios.get(`/teacher/assessments/${assessmentId}/template`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'marks_template.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Template download error:', error);
            alert('Failed to download template.');
        }
    };

    const handlePasteProcess = () => {
        // Process pasted data
        const lines = pasteData.trim().split('\n');
        console.log('Processing pasted data:', lines);
        alert(`Found ${lines.length} rows. Processing...`);
        // Implement actual paste data processing logic here
    };

    const handleBulkSet = () => {
        if (!bulkValue || isNaN(bulkValue) || bulkValue < 0 || bulkValue > 100) {
            alert('Please enter a valid mark between 0 and 100');
            return;
        }

        console.log(`Setting bulk value: ${bulkValue} for ${selectedOption}`);
        alert(`Bulk operation would set ${bulkValue} for ${selectedOption} students.`);
        // Implement actual bulk set logic here
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">📥 Bulk Mark Operations</h3>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('csv')}
                    className={`
                        px-6 py-3 font-semibold transition-colors
                        ${activeTab === 'csv'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }
                    `}
                >
                    Upload CSV
                </button>
                <button
                    onClick={() => setActiveTab('paste')}
                    className={`
                        px-6 py-3 font-semibold transition-colors
                        ${activeTab === 'paste'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }
                    `}
                >
                    Copy-Paste
                </button>
                <button
                    onClick={() => setActiveTab('bulk')}
                    className={`
                        px-6 py-3 font-semibold transition-colors
                        ${activeTab === 'bulk'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }
                    `}
                >
                    Bulk Set
                </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {/* CSV Upload Tab */}
                {activeTab === 'csv' && (
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <DocumentArrowDownIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
                                    <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                                        <li>Download the CSV template</li>
                                        <li>Fill in marks using Excel or Google Sheets</li>
                                        <li>Upload the completed file back</li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={handleDownloadTemplate}
                                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                <DocumentArrowDownIcon className="w-5 h-5" />
                                <span>Download Template</span>
                            </button>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleCsvUpload}
                                className="hidden"
                                id="csv-upload"
                                disabled={uploading}
                            />
                            <label
                                htmlFor="csv-upload"
                                className="cursor-pointer inline-flex flex-col items-center"
                            >
                                <ArrowUpTrayIcon className="w-12 h-12 text-gray-400 mb-3" />
                                <span className="text-lg font-semibold text-gray-700 mb-1">
                                    {uploading ? 'Uploading...' : 'Click to upload CSV'}
                                </span>
                                <span className="text-sm text-gray-500">or drag and drop</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Copy-Paste Tab */}
                {activeTab === 'paste' && (
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <ClipboardDocumentIcon className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-green-900 mb-2">Paste from Excel:</h4>
                                    <p className="text-sm text-green-800">
                                        Copy data from Excel (Student ID, Name, Mark) and paste below. Columns should be tab-separated.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <textarea
                            value={pasteData}
                            onChange={(e) => setPasteData(e.target.value)}
                            placeholder="Student ID, Student Name, Marks&#10;STU-1001, Sara Chen, 92&#10;STU-1002, Michael Brown, 85&#10;..."
                            className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                        />

                        <div className="flex space-x-3">
                            <button
                                onClick={handlePasteProcess}
                                disabled={!pasteData.trim()}
                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                📋 Validate Data
                            </button>
                            <button
                                onClick={handlePasteProcess}
                                disabled={!pasteData.trim()}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                ▶ Apply Marks
                            </button>
                        </div>
                    </div>
                )}

                {/* Bulk Set Tab */}
                {activeTab === 'bulk' && (
                    <div className="space-y-4">
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <Cog6ToothIcon className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-purple-900 mb-2">Bulk Operations:</h4>
                                    <p className="text-sm text-purple-800">
                                        Set the same mark for multiple students at once. Use with caution!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Apply to:
                                </label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="bulk-option"
                                            value="all"
                                            checked={selectedOption === 'all'}
                                            onChange={(e) => setSelectedOption(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-gray-700">All Students</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="bulk-option"
                                            value="selected"
                                            checked={selectedOption === 'selected'}
                                            onChange={(e) => setSelectedOption(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-gray-700">Selected Only</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mark value (0-100):
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={bulkValue}
                                    onChange={(e) => setBulkValue(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Enter mark"
                                />
                            </div>

                            <button
                                onClick={handleBulkSet}
                                disabled={!bulkValue}
                                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                Apply to {selectedOption === 'all' ? 'All' : 'Selected'} Students
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
