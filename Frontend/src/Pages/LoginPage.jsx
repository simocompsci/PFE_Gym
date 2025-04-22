
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import myImage from '../assets/logo.jpg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password, userType);

      if (result.success) {
        // Redirect to appropriate dashboard
        navigate(`/${userType}/dashboard`);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-blue-200 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="overflow-hidden bg-white p-0 border-gray-200 shadow-md rounded-2xl">
            <CardContent className="grid p-0 md:grid-cols-2 ">
              <form className="p-6 md:p-8 border-gray-300" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground text-balance">
                      Login to your Gym  account
                    </p>
                    {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                      </div>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">User Type</label>
                      <Select value={userType} onValueChange={(value) => setUserType(value)} className={"bg-gray-400 focus:ring-gray-300"}>
                        <SelectTrigger className="w-full bg-gray-200 text-black border border-gray-400 rounded-md shadow-sm focus:ring-2 focus:ring-gray-300">
                          <SelectValue placeholder="Selectionner Un Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                          <SelectGroup>
                            <SelectLabel>Types</SelectLabel>
                            <SelectItem className="px-3 py-2 hover:bg-gray-100 cursor-pointer" value="admin">Admin</SelectItem>
                            <SelectItem className="px-3 py-2 hover:bg-gray-100 cursor-pointer" value="coach">Coach</SelectItem>
                            <SelectItem className="px-3 py-2 hover:bg-gray-100 cursor-pointer" value="secretary">Secretary</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required className={"border-gray-200 focus:ring-gray-300"} />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password" value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required className={"border-gray-200 focus:ring-gray-300"} />
                  </div>
                  <Button type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>


                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a href="#" className="underline underline-offset-4">
                      Sign up
                    </a>
                  </div>
                </div>
              </form>
              <div className="bg-muted relative hidden md:block m-5">
                <img
                  src={myImage}
                  alt="Image"
                  className="absolute inset-0 h-full w-full rounded-xl object-cover dark:brightness-[0.2] dark:grayscale" />
              </div>
            </CardContent>
          </Card>
          <div
            className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>

  );
}

export default LoginPage;