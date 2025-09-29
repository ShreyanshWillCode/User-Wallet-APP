import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ArrowLeft, Upload, CheckCircle, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

interface KYCScreenProps {
  onKYCComplete: () => void;
  onBack: () => void;
}

export function KYCScreen({ onKYCComplete, onBack }: KYCScreenProps) {
  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (file: File, type: 'front' | 'back') => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    if (type === 'front') {
      setFrontImage(file);
    } else {
      setBackImage(file);
    }
  };

  const handleRemoveFile = (type: 'front' | 'back') => {
    if (type === 'front') {
      setFrontImage(null);
    } else {
      setBackImage(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, type: 'front' | 'back') => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0], type);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center glass-card border-0 card-hover">
          <CardContent className="pt-8 pb-8">
            <div className="float-animation">
              <div className="p-4 success-gradient rounded-3xl w-20 h-20 mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="mb-4 gradient-text text-xl font-bold">KYC Submitted Successfully</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Your documents are under review. You'll be notified within 24-48 hours.
            </p>
            <Button 
              onClick={onKYCComplete} 
              className="w-full h-12 primary-gradient border-0 button-glow hover:scale-105 transition-all duration-300 rounded-2xl font-bold"
            >
              Continue to Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl glass-card border-0 card-hover">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="glass-card hover:scale-105 transition-transform rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 text-indigo-600" />
            </Button>
            <div>
              <CardTitle className="gradient-text text-xl font-bold">Complete KYC Verification</CardTitle>
              <CardDescription className="text-slate-600">
                Step {step} of 2 - Please provide your identity documents
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  All information must match your identity document exactly.
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="document-type">Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                      <SelectItem value="pan">PAN Card</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="driving-license">Driving License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document-number">Document Number</Label>
                  <Input
                    id="document-number"
                    placeholder="Enter document number"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    placeholder="As per document"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Full address as per document"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={() => setStep(2)}
                disabled={!documentType || !documentNumber || !fullName || !dateOfBirth || !address}
              >
                Continue to Document Upload
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-4">Upload Document Images</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Front Side</Label>
                      <div 
                        className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'front')}
                      >
                        {frontImage ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <CheckCircle className="h-8 w-8 text-green-500" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFile('front');
                                }}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm font-medium">{frontImage.name}</p>
                            <p className="text-xs text-gray-500">
                              {(frontImage.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                            <p className="text-sm text-gray-600">Click to upload or drag & drop</p>
                            <p className="text-xs text-gray-500">Front side image</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'front')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Back Side</Label>
                      <div 
                        className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'back')}
                      >
                        {backImage ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <CheckCircle className="h-8 w-8 text-green-500" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFile('back');
                                }}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm font-medium">{backImage.name}</p>
                            <p className="text-xs text-gray-500">
                              {(backImage.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                            <p className="text-sm text-gray-600">Click to upload or drag & drop</p>
                            <p className="text-xs text-gray-500">Back side image</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'back')}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please ensure images are clear, well-lit, and all text is readable. Supported formats: JPG, PNG, GIF. Maximum file size: 5MB.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleSubmit}
                  disabled={!frontImage || !backImage || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit for Verification"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}