import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Switch } from "../ui/switch";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Shield, 
  Bell, 
  HelpCircle, 
  LogOut,
  Edit,
  Lock,
  FileText,
  Star
} from "lucide-react";

interface ProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
  userInfo: {
    name: string;
    phone: string;
    email: string;
  };
}

export function ProfileScreen({ onBack, onLogout, userInfo }: ProfileScreenProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userInfo.name);

  const handleSaveName = () => {
    // In real app, this would update the backend
    setIsEditing(false);
  };


  return (
    <div className="min-h-screen p-4 bg-[rgba(9,9,46,1)]">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <Card className="glass-card border-0 card-hover">
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
                <CardTitle className="gradient-text text-xl font-bold">Profile & Settings</CardTitle>
                <CardDescription className="text-slate-600">Manage your account and preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Info */}
        <Card className="glass-card border-0 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 gradient-text font-bold">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {userInfo.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-lg"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveName}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg">{userInfo.name}</h3>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{userInfo.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{userInfo.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="glass-card border-0 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 gradient-text font-bold">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">Change Password</p>
                  <p className="text-xs text-muted-foreground">Update your login password</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">Biometric Authentication</p>
                  <p className="text-xs text-muted-foreground">Use fingerprint or face ID</p>
                </div>
              </div>
              <Switch
                checked={biometricEnabled}
                onCheckedChange={setBiometricEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glass-card border-0 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 gradient-text font-bold">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified about transactions</p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Other Options */}
        <Card className="glass-card border-0 card-hover">
          <CardContent className="p-0">
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start h-auto p-4">
                <HelpCircle className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <p className="text-sm">Help & Support</p>
                  <p className="text-xs text-muted-foreground">Get help with your account</p>
                </div>
              </Button>

              <Button variant="ghost" className="w-full justify-start h-auto p-4">
                <FileText className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <p className="text-sm">Terms & Privacy</p>
                  <p className="text-xs text-muted-foreground">Read our policies</p>
                </div>
              </Button>

              <Button variant="ghost" className="w-full justify-start h-auto p-4">
                <Star className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <p className="text-sm">Rate Our App</p>
                  <p className="text-xs text-muted-foreground">Share your feedback</p>
                </div>
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto p-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <p className="text-sm">Log Out</p>
                  <p className="text-xs text-muted-foreground">Sign out of your account</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}