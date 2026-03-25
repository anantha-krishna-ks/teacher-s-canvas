import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 relative overflow-hidden">
      {/* iOS-style soft gradient blurs */}
      <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
      <div className="absolute bottom-[-150px] left-[-80px] w-[400px] h-[400px] rounded-full bg-primary/6 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[420px] mx-4 flex flex-col items-center"
      >
        {/* Logo outside card */}
        <img
          src={logo}
          alt="Saras SchoolAi"
          className="mb-8 h-12 w-auto"
        />

        <div className="w-full bg-card/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.12)] border border-border/40 px-8 pt-8 pb-10 sm:px-10 sm:pt-10 sm:pb-12">
          {/* Title */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-[28px] font-semibold text-foreground tracking-[-0.02em]">
              ClassSphere
            </h1>
            <p className="text-muted-foreground text-[13px] mt-2 font-light tracking-wide">
              Sign in to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[50px] rounded-xl bg-muted/50 border-transparent px-4 text-[15px] font-light placeholder:text-muted-foreground/50 focus:border-primary/30 focus:bg-background transition-all duration-200"
              />
            </div>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[50px] rounded-xl bg-muted/50 border-transparent px-4 pr-12 text-[15px] font-light placeholder:text-muted-foreground/50 focus:border-primary/30 focus:bg-background transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" className="rounded-md border-border/60 data-[state=checked]:bg-primary" />
                <Label htmlFor="remember" className="text-[13px] text-muted-foreground cursor-pointer font-light">
                  Remember me
                </Label>
              </div>
              <button type="button" className="text-[13px] text-primary hover:text-primary/80 font-medium transition-colors">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-[50px] rounded-xl text-[15px] font-medium mt-2 shadow-[0_4px_14px_-4px_hsl(var(--primary)/0.4)] hover:shadow-[0_6px_20px_-4px_hsl(var(--primary)/0.5)] transition-all duration-200"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-[13px] text-muted-foreground font-light">
            Don't have an account?{" "}
            <button className="text-primary font-medium hover:text-primary/80 transition-colors">
              Create one
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
