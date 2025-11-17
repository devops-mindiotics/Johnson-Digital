'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, Info, Bug } from "lucide-react";

const formSchema = z.object({
  issueType: z.string().min(1, "Please select an issue type."),
  subject: z.string().min(1, "Subject is required."),
  description: z.string().min(1, "Description is required."),
  screenshot: z.any().optional(),
});

export default function ReportPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      issueType: "",
      subject: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 p-3 rounded-full w-fit">
            <Bug className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl pt-2">Report Bug or Feedback</CardTitle>
          <p className="text-muted-foreground">Help us improve your learning experience</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="issueType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bug">Bug</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject *</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of the issue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe the issue in detail. Include steps to reproduce if it's a bug."
                        className="resize-none"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="screenshot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Screenshot (Optional)</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload screenshot</span>
                            </p>
                            <p className="text-xs text-gray-500">Max file size: 3MB</p>
                          </div>
                          <Input id="dropzone-file" type="file" className="hidden" {...field} />
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Tips for better support:</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside text-sm">
                    <li>Be specific about the problem</li>
                    <li>Include steps to reproduce the issue</li>
                    <li>Screenshots help us understand better</li>
                    <li>Mention which device/browser you're using</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full">Submit Report</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
