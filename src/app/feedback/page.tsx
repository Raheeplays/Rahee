
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { ref, push } from "firebase/database";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { rtdb } from "@/lib/firebase";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  rating: z.number().min(1, "Rating is required").max(5),
  feedback: z.string().min(10, "Feedback must be at least 10 characters"),
});

export default function FeedbackPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [rating, setRating] = React.useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      rating: 0,
      feedback: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const feedbackRef = ref(rtdb, 'feedback');
      await push(feedbackRef, {
        name: values.name,
        email: values.email,
        rating: values.rating,
        message: values.feedback,
        time: new Date().toLocaleString(),
      });
      
      toast({
        title: "Feedback Sent!",
        description: "Thank you for helping us improve Rahee Cards.",
      });
      form.reset();
      setRating(0);
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not submit feedback. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSetRating = (rate: number) => {
    setRating(rate);
    form.setValue('rating', rate, { shouldValidate: true });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Player Feedback</CardTitle>
          <CardDescription>We value your opinion. Let us know how we can improve.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Your Name</FormLabel>
                      <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="player@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="rating"
                render={() => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                key={star}
                                className={cn(
                                    "w-8 h-8 cursor-pointer transition-colors",
                                    rating >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                                )}
                                onClick={() => handleSetRating(star)}
                                />
                            ))}
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us what you think..." className="resize-none" rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center">
                 <Button asChild variant="outline">
                    <Link href="/main-menu">Back to Menu</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <Send className="mr-2 h-4 w-4" />
                    )}
                    Submit Feedback
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
