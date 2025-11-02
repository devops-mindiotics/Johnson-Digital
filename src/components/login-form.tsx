"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { handleApiError } from "@/lib/utils/error-handler";
import { loginUser } from "@/lib/api/auth";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  mobile: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onBlur",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mobile: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const response = await loginUser(values.mobile, values.password);
      console.log("🚀 Unable to login. response", { response });
      if (response.success) {
        const user = {
          userId: response?.data?.user?.userId ?? "",
          phone: response?.data?.user?.phone ?? "",
          displayName: response?.data?.user?.displayName ?? "User",
          avatarUrl:
            response?.data?.user?.avatarUrl ?? "https://picsum.photos/100",
          email: response?.data?.user?.email ?? null,
          status: response?.data?.user?.status ?? "active",
          createdAt: response?.data?.user?.createdAt ?? "",
          updatedAt: response?.data?.user?.updatedAt ?? "",
          globalRoles: response?.data?.user?.roles ?? null,
        };

        login(user);
        // toast({ title: 'Login Successful', description: 'Please wait Redirecting to dashboard...' });
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: response.message,
        });
      }
    } catch (error) {
      console.log("🚀 Unable to login. Please check your credentials.", {
        error,
      });

      handleApiError(error, "Unable to login. Please check your credentials.");
    }
  };

  return (
    <div className="relative w-full h-full pb-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your mobile number"
                    maxLength={10}
                    type="tel"
                    {...field}
                    onChange={(e) => {
                      const { value } = e.target;
                      if (/^[0-9]*$/.test(value)) {
                        field.onChange(e);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-right">
            <Button variant="link" asChild className="p-0 h-auto">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </Button>
          </div>
          <Button type="submit" className="w-full">
            {"Sign In"}
          </Button>
        </form>
      </Form>
      <div className="pt-4 text-center text-xs text-muted-foreground">
        <p>
          By signing in, you agree to our{" "}
          <Link
            href="/eula"
            className="text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            EULA
          </Link>
          {", "}
          <Link
            href="/privacy-policy"
            className="text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </Link>
          {" and "}
          <Link
            href="/terms-and-conditions"
            className="text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms &amp; Conditions
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
