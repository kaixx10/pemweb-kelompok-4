import React from 'react';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full max-w-3xl mx-auto py-8">
      {/* Step 1 */}
      <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-black' : 'text-gray-400'}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
          1
        </div>
        <span className={`text-sm font-medium ${currentStep === 1 ? 'text-black' : 'text-gray-400'}`}>Keranjang belanja</span>
      </div>

      {/* Line */}
      <div className="flex-1 h-px bg-gray-300 mx-4"></div>

      {/* Step 2 */}
      <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-black' : 'text-gray-400'}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
          2
        </div>
        <span className={`text-sm font-medium ${currentStep === 2 ? 'text-black' : 'text-gray-400'}`}>Checkout</span>
      </div>

      {/* Line */}
      <div className="flex-1 h-px bg-gray-300 mx-4"></div>

      {/* Step 3 */}
      <div className={`flex items-center gap-2 ${currentStep === 3 ? 'text-black' : 'text-gray-400'}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === 3 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
          3
        </div>
        <span className={`text-sm font-medium ${currentStep === 3 ? 'text-black' : 'text-gray-400'}`}>Pembayaran</span>
      </div>
    </div>
  );
}
