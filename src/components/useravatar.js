import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react";
import PocketBase from 'pocketbase';
import  DialogDemo  from "./login_dia";


export default function Av({onLogin, user, setUser}) {
  
    const pb = new PocketBase('http://172.16.15.140:8080');

// useEffect(()=>{
//     setUser(pb.authStore.model)
// }, [])

const login = async () =>{

    setUser(pb.authStore.model)
    
    

}


const logout = async () =>{

    pb.authStore.clear();
    console.log(pb.authStore)
    setUser(null)

}
    return (


        <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Avatar>
      <AvatarImage src={user && pb.files.getUrl(user, user.avatar)} />
      <AvatarFallback />
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>{user ? user.username : "niezalogowany"}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {user ? (
      <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
    ) : (
      <DropdownMenuItem asChild>
        <DialogDemo onLogin={onLogin}/>
      </DropdownMenuItem>
    )}
  </DropdownMenuContent>
</DropdownMenu>
       

    )
}