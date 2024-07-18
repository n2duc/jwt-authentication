import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Skeleton } from "./ui/skeleton"
import { updateUserInfo, uploadImage } from "../apis"
import toast from "react-hot-toast";
import { AuthType } from "../types";

const formSchema = z.object({
  username: z.string().min(5, { message: "Username must be at least 3 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." })
})

const UpdateProfile = ({ dataUser }: { dataUser: AuthType }) => {
  const [userProfile, setUserProfile] = useState<AuthType | null>(dataUser)
  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(dataUser.avatar.url);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const tempUrl = URL.createObjectURL(file);
      setAvatarUrl(tempUrl);
      setFile(file);
    } else {
      setFile(null);
    }
  };

  const handleUpdateAvatar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file as Blob);
    try {
      setLoading(true);
      const url = await uploadImage(formData);
      setAvatarUrl(url);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: userProfile?.username || "",
      email: userProfile?.email || "",
    }
  })

  const onUpdateProfile = async (data: z.infer<typeof formSchema>) => {
    if (data.username === userProfile?.username && data.email === userProfile?.email) {
      toast.error("No changes detected.");
      return;
    }
    const res = await updateUserInfo(data)
    setUserProfile(res)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-3">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center">
          <form className="flex flex-col items-center" onSubmit={handleUpdateAvatar}>
            <label htmlFor="avatar" className="group">
              {avatarUrl && (
                <Avatar className="h-20 w-20 mb-2 border-2 border-slate-500">
                  <AvatarImage className="h-full w-full" src={avatarUrl} />
                  <AvatarFallback>
                    <Skeleton className="h-full w-full" />
                  </AvatarFallback>
                </Avatar>
              )}
              <input id="avatar" type="file" accept=".png, .jpg, .jpeg, .webp" hidden onChange={handleFileUpload} />
            </label>
            <Button type="submit" variant="outline" disabled={loading}>
              {loading ? "Uploading..." : "Update"}
            </Button>
          </form>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onUpdateProfile)} className="space-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn@ui.dev" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Save changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfile;
