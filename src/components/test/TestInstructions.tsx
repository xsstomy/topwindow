// License Key test instruction component
import { Info, CheckCircle, AlertTriangle } from 'lucide-react'

export default function TestInstructions() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <div className="flex items-start gap-3">
        <Info className="w-6 h-6 text-blue-600 mt-0.5" />
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use This Test Page</h3>
          
          <div className="space-y-4 text-blue-800">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">License Key Generator Test</h4>
                <p className="text-sm text-blue-700">
                  Click "Generate New Key" button to test single key generation, or use "Batch Generate" to test bulk creation.
                  All generated keys should follow the TW-XXXX-XXXX-XXXX-XXXX format.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Format Validator Test</h4>
                <p className="text-sm text-blue-700">
                  Enter any string in the input field to test format validation. Use the quick test case buttons to quickly fill in valid or invalid examples.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Input Validator Test</h4>
                <p className="text-sm text-blue-700">
                  Click "Run Validation Test" to execute predefined test cases and verify the validation logic for various input formats.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Database Connection Test</h4>
                <p className="text-sm text-blue-700">
                  Test Supabase database connection. If connection fails, please check environment variable configuration and database table structure.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> This page is only for development testing and will not save any data to the production environment.
              All test operations are safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}