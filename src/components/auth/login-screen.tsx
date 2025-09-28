import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Shield, Mail, ArrowLeft, Wallet } from "lucide-react";

interface LoginScreenProps {
  onLogin: (credentials: { phone?: string; email?: string; password: string }) => void;
  onSignup: (credentials: { phone?: string; email?: string; password: string; name: string }) => void;
  onBack: () => void;
}

export function LoginScreen({ onLogin, onSignup, onBack }: LoginScreenProps) {
  const [loginPhone, setLoginPhone] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");

  const handleLogin = (method: 'phone' | 'email') => {
    const credentials = method === 'phone' 
      ? { phone: loginPhone, password: loginPassword }
      : { email: loginEmail, password: loginPassword };
    onLogin(credentials);
  };

  const handleSignup = (method: 'phone' | 'email') => {
    const credentials = method === 'phone'
      ? { phone: signupPhone, password: signupPassword, name: signupName }
      : { email: signupEmail, password: signupPassword, name: signupName };
    onSignup(credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-lg">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-gradient-to-b from-blue-700 to-blue-800 rounded-[20px] p-3 shadow-lg">
              <Wallet className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-slate-900">WalletApp</h1>
              <p className="text-sm text-slate-500">Your Digital Wallet</p>
            </div>
          </div>
        </div>

        <Card className="bg-white border rounded-[20px] shadow-lg">
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-700/10 rounded-2xl p-2">
                <Shield className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Welcome Back</CardTitle>
              </div>
            </div>
            <CardDescription className="text-slate-500 pb-4">
              Sign in to your wallet or create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-200 rounded-[20px] p-1 h-9">
                <TabsTrigger 
                  value="login" 
                  className="rounded-[20px] h-7 text-sm font-normal data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="rounded-[20px] h-7 text-sm font-normal data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Register
                </TabsTrigger>
              </TabsList>
            
            <TabsContent value="login" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm text-slate-900">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white rounded-[14px] border-0 h-9 text-sm"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm text-slate-900">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    className="bg-white rounded-[14px] border-0 h-9 text-sm"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full h-9 bg-blue-800 hover:bg-blue-900 text-white rounded-[14px] text-sm font-normal" 
                  onClick={() => handleLogin('email')}
                  disabled={!loginEmail || !loginPassword}
                >
                  Sign In
                </Button>
                <div className="text-center">
                  <Button 
                    variant="link" 
                    className="text-blue-800 text-sm font-normal p-0 h-auto"
                  >
                    Forgot your password?
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sm text-slate-900">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="Enter your full name"
                    className="bg-white rounded-[14px] border-0 h-9 text-sm"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm text-slate-900">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white rounded-[14px] border-0 h-9 text-sm"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm text-slate-900">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    className="bg-white rounded-[14px] border-0 h-9 text-sm"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full h-9 bg-blue-800 hover:bg-blue-900 text-white rounded-[14px] text-sm font-normal" 
                  onClick={() => handleSignup('email')}
                  disabled={!signupName || !signupEmail || !signupPassword}
                >
                  Create Account
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Demo Credentials Section */}
          <div 
            className="mt-6 rounded-2xl p-4 border"
            style={{ 
              backgroundColor: "rgba(226, 232, 240, 0.5)",
              borderColor: "rgba(209, 213, 219, 0.5)"
            }}
          >
            <p className="text-sm text-slate-900 mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              <p className="text-sm text-slate-500">
                <span>User: </span>user@demo.com / password123
              </p>
              <p className="text-sm text-slate-500">
                <span>Admin: </span>admin@demo.com / password123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}