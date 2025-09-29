import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { walletAPI } from '../services/api';
import { ArrowLeft, Search, User, Mail, Phone } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const SendMoneyPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const amount = watch('amount');

  // Search recipients
  const { data: searchResults, isLoading: searching } = useQuery(
    ['search-recipients', searchQuery],
    () => walletAPI.searchRecipients(searchQuery),
    {
      enabled: searchQuery.length >= 3,
      select: (data) => data.data.recipients,
    }
  );

  // Send money mutation
  const sendMoneyMutation = useMutation(walletAPI.transfer, {
    onSuccess: (response) => {
      toast.success('Money sent successfully!');
      queryClient.invalidateQueries('wallet-balance');
      queryClient.invalidateQueries('recent-transactions');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send money');
    },
  });

  const quickAmounts = [100, 500, 1000, 2000];

  const onSubmit = (data) => {
    if (!selectedRecipient) {
      toast.error('Please select a recipient');
      return;
    }

    sendMoneyMutation.mutate({
      recipient: selectedRecipient.email || selectedRecipient.phone,
      amount: parseFloat(data.amount),
      description: data.description || 'Money transfer',
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

  const handleRecipientSelect = (recipient) => {
    setSelectedRecipient(recipient);
    setSearchQuery(`${recipient.name} (${recipient.email})`);
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
        <h1 className="text-2xl font-bold text-gray-900 ml-2">Send Money</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Recipient Search */}
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
              Send to
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value !== selectedRecipient?.name) {
                    setSelectedRecipient(null);
                  }
                }}
                className="input pl-10"
                placeholder="Search by name, email, or phone"
              />
            </div>

            {/* Search Results */}
            {searchQuery.length >= 3 && (
              <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
                {searching ? (
                  <div className="p-4 text-center">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : searchResults?.length > 0 ? (
                  searchResults.map((recipient) => (
                    <button
                      key={recipient._id}
                      type="button"
                      onClick={() => handleRecipientSelect(recipient)}
                      className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {recipient.name}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Mail className="h-3 w-3 mr-1" />
                            {recipient.email}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Phone className="h-3 w-3 mr-1" />
                            {recipient.phone}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No recipients found
                  </div>
                )}
              </div>
            )}

            {/* Selected Recipient */}
            {selectedRecipient && (
              <div className="mt-2 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-primary-900">
                      {selectedRecipient.name}
                    </p>
                    <p className="text-xs text-primary-700">
                      {selectedRecipient.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

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

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <input
              {...register('description')}
              type="text"
              className="input"
              placeholder="Add a note for this transfer"
              maxLength={200}
            />
          </div>

          {/* Summary */}
          {amount && selectedRecipient && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Transfer Summary</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Recipient</span>
                  <span className="font-medium">{selectedRecipient.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transfer Fee</span>
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
              disabled={sendMoneyMutation.isLoading || !amount || !selectedRecipient}
              className="flex-1 btn btn-primary"
            >
              {sendMoneyMutation.isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Send Money'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendMoneyPage;
