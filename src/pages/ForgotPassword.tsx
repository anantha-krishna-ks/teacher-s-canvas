import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) {
        toast.error("Please enter your email address");
        return;
      }
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
        toast.success("Password reset link sent successfully");
      }, 1500);
    },
    [email]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    []
  );

  const handleBackToLogin = useCallback(() => navigate("/login"), [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-muted/40 to-accent/10 relative overflow-hidden">
      <div className="absolute top-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[350px] h-[350px] rounded-full bg-primary/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-4 flex flex-col items-center"
      >
        <img src={logo} alt="Saras SchoolAi" className="mb-6 h-14 w-auto" />

        <div className="w-full bg-card rounded-2xl shadow-lg border border-border/60 px-8 pt-6 pb-8 sm:px-10 sm:pt-8 sm:pb-10">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col items-center mb-8">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">
                    Reset Password
                  </h1>
                  <div className="w-full border-t border-border/60 mt-3 mb-2" />
                  <p className="text-muted-foreground text-sm mt-1.5 text-center">
                    Enter your email and we'll send you a link to reset your password
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <Label htmlFor="reset-email" className="sr-only">Email Address</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={handleEmailChange}
                      className="h-12 rounded-lg bg-background border-border px-4 text-sm placeholder:text-muted-foreground/60"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-lg text-sm font-semibold gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" aria-hidden="true" />
                        Sending...
                      </span>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" aria-hidden="true" />
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </form>

                <button
                  onClick={handleBackToLogin}
                  className="mt-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Back to Sign In
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-4"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Check Your Email</h2>
                <p className="text-muted-foreground text-sm text-center mb-6 max-w-[280px]">
                  We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                </p>
                <Button
                  variant="outline"
                  onClick={handleBackToLogin}
                  className="gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Back to Sign In
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
