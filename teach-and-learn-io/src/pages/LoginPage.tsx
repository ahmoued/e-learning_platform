import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.ts"
import axios from "axios"
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e)=>{
    e.preventDefault()
    const response = await supabase.auth.signInWithPassword({email, password})
    const data = response.data
    const error = response.error
    if (error || !data.user){
        setError(error.message || "login failed")
        return
    }
    const user = data.user;
    const token = (await (supabase.auth.getSession())).data.session?.access_token;
    const res = await axios.get(
      "http://localhost:3000/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const {role} = res.data
     if (role === "instructor") {
      navigate("/instructor-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  };
  
    

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card rounded-xl shadow-soft border p-8 w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <BookOpen className="h-12 w-12 text-primary mb-2" />
          <h1 className="text-3xl font-bold text-foreground">Sign in</h1>
          <p className="text-muted-foreground mt-2 text-center">
            Welcome back! Enter your credentials to continue.
          </p>
        </div>
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleLogin(e); }}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}