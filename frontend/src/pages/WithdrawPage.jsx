import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { walletAPI } from '../services/api';
import { ArrowLeft, Building, CreditCard } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const WithdrawPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const amount = watch('amount');

  // Withdraw money mutation
  const withdrawMutation = useMutation(walletAPI.withdraw, {
    onSuccess: (response) => {
      toast.success('Withdrawal request submitted successfully!');
      queryClient.invalidateQueries('wallet-balance');
      queryClient.invalidateQueries('recent-transactions');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to process withdrawal');
    },
  });

  const quickAmounts = [500, 1000, 2000, 5000];

  const onSubmit = (data) => {
    withdrawMutation.mutate({
      amount: parseFloat(data.amount),
      bankDetails: {
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
        bankName: data.bankName,
        accountHolder: data.accountHolder,
      },
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
        <h1 className="text-2xl font-bold text-gray-900 ml-2">Withdraw Money</h1>
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

          {/* Bank Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Account Holder Name */}
              <div className="md:col-span-2">
                <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name
                </label>
                <input
                  {...register('accountHolder', {
                    required: 'Account holder name is required',
                  })}
                  type="text"
                  className="input"
                  placeholder="Enter account holder name"
                />
                {errors.accountHolder && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountHolder.message}</p>
                )}
              </div>

              {/* Account Number */}
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  {...register('accountNumber', {
                    required: 'Account number is required',
                    pattern: {
                      value: /^\d{9,18}$/,
                      message: 'Account number must be 9-18 digits',
                    },
                  })}
                  type="text"
                  className="input"
                  placeholder="Enter account number"
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountNumber.message}</p>
                )}
              </div>

              {/* IFSC Code */}
              <div>
                <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code
                </label>
                <input
                  {...register('ifscCode', {
                    required: 'IFSC code is required',
                    pattern: {
                      value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                      message: 'Invalid IFSC code format',
                    },
                  })}
                  type="text"
                  className="input"
                  placeholder="Enter IFSC code"
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.ifscCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.ifscCode.message}</p>
                )}
              </div>

              {/* Bank Name */}
              <div className="md:col-span-2">
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  {...register('bankName', {
                    required: 'Bank name is required',
                  })}
                  type="text"
                  className="input"
                  placeholder="Enter bank name"
                />
                {errors.bankName && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankName.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          {amount && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Withdrawal Summary</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing Time</span>
                  <span className="font-medium">5-10 minutes</span>
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
              disabled={withdrawMutation.isLoading || !amount}
              className="flex-1 btn btn-primary"
            >
              {withdrawMutation.isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Withdraw Money'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Building className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Withdrawal Information
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Withdrawals are processed within 5-10 minutes</li>
                <li>No processing fees for withdrawals</li>
                <li>Minimum withdrawal amount is ₹1</li>
                <li>Maximum withdrawal amount is ₹10,00,000</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
