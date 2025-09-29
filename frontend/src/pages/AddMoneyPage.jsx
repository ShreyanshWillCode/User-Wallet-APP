import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { walletAPI } from '../services/api';
import { ArrowLeft, CreditCard, Smartphone, Building, QrCode } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AddMoneyPage = () => {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const amount = watch('amount');

  // Add money mutation
  const addMoneyMutation = useMutation(walletAPI.addMoney, {
    onSuccess: (response) => {
      toast.success('Money added successfully!');
      queryClient.invalidateQueries('wallet-balance');
      queryClient.invalidateQueries('recent-transactions');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add money');
    },
  });

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Pay using UPI ID' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Pay using card' },
    { id: 'netbanking', name: 'Net Banking', icon: Building, description: 'Pay using net banking' },
    { id: 'qr', name: 'QR Code', icon: QrCode, description: 'Scan QR code to pay' },
  ];

  const quickAmounts = [500, 1000, 2000, 5000];

  const onSubmit = (data) => {
    addMoneyMutation.mutate({
      amount: parseFloat(data.amount),
      paymentMethod: selectedMethod,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 ml-2">Add Money</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <input
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 1, message: 'Minimum amount is ₹1' },
                  max: { value: 1000000, message: 'Maximum amount is ₹10,00,000' },
                })}
                type="number"
                step="0.01"
                className="input pl-8 text-lg"
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Amount</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => {
                    const amountInput = document.querySelector('input[name="amount"]');
                    if (amountInput) {
                      amountInput.value = quickAmount;
                      amountInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                  }}
                  className="p-3 text-center border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(quickAmount)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Payment Method</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedMethod === method.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-6 w-6 text-gray-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {method.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          {amount && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Summary</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">
                    {paymentMethods.find(m => m.id === selectedMethod)?.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-bold text-lg">{formatCurrency(amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addMoneyMutation.isLoading || !amount}
              className="flex-1 btn btn-primary"
            >
              {addMoneyMutation.isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Add Money'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Demo Mode
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                This is a demo application. No real money will be charged. 
                The payment will be simulated and your wallet balance will be updated instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMoneyPage;
