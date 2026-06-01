import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("explorador");
  const [referralCode, setReferralCode] = useState(new URLSearchParams(window.location.search).get("ref") || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }
    setLoading(true);
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    role: role,
                    referred_by: referralCode.trim() ? referralCode.trim().toUpperCase() : null
                }
            }
        });
        if (error) throw error;
        
        if (data.session) {
            window.location.href = "/";
        } else {
            setSuccess(true);
        }
    } catch (err) {
        setError(err.message || "Registration failed");
    } finally {
        setLoading(false);
    }
  };

  const handleGoogle = async () => {
      try {
          const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                  redirectTo: window.location.origin
              }
          });
          if (error) throw error;
      } catch (err) {
          setError(err.message || "Failed to login with Google");
      }
  };

  if (success) {
      return (
          <AuthLayout
              icon={CheckCircle2}
              title="Check your email"
              subtitle={`We've sent a confirmation link to ${email}. Please click the link to verify your account.`}
          >
              <Button className="w-full h-12 font-medium" asChild>
                  <Link to="/login">Go to login</Link>
              </Button>
          </AuthLayout>
      );
  }

  return (
      <AuthLayout
          icon={UserPlus}
          title="Create your account"
          subtitle="Sign up to get started"
          footer={
              <>
               Already have an account?{" "}
               <Link to="/login" className="text-primary font-medium hover:underline">
                    Log in
               </Link>
              </>
          }
      >
          <Button
              variant="outline"
              className="w-full h-12 text-sm font-medium mb-6"
              onClick={handleGoogle}
          >
              <GoogleIcon className="w-5 h-5 mr-2" />
              Continue with Google
          </Button>

          <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-border" />
              </div>

        <div className="relative flex justify-center text-xs uppercase">
           <span className="bg-card px-3 text-muted-foreground">or</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
           {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role selector */}
        <div className="space-y-2">
           <Label>Rol / Role</Label>
           <div className="grid grid-cols-2 gap-2">
              <button
                  type="button"
                  onClick={() => setRole("proveedor")}
                  className={`h-12 rounded-lg border-2 font-medium text-sm transition-all ${
                    role === "proveedor"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
              >
                  🎬 Proveedor
              </button>
              <button
                  type="button"
                  onClick={() => setRole("explorador")}
                  className={`h-12 rounded-lg border-2 font-medium text-sm transition-all ${
                    role === "explorador"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
              >
                  🌎 Explorador
              </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
                 id="confirm"
                 type="password"
                 autoComplete="new-password"
                 placeholder="••••••••"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 className="pl-10 h-12"
                 required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ref">Code de parrainage (optionnel)</Label>
          <Input
            id="ref"
            type="text"
            placeholder="QR-XXXXXX"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            className="h-12 font-mono tracking-widest"
          />
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                 Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
       </form>
    </AuthLayout>
  );
}
