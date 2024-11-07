import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import PocketBase from 'pocketbase';

export default function DialogDemo({onLogin}) {
  const pb = new PocketBase('http://172.16.15.140:8080');

  const [user, setUser] = useState(null)
  const [pass, setPass] = useState(null)
  const [erro, setErro] = useState(false)
  const [open, setOpen] = useState(null)

  useEffect(()=>{
    setErro(false)
  }, [open])


  const handleUser = (e) =>{
    setUser(e.target.value)
  }
  const handlePass = (e) =>{

    setPass(e.target.value)


  }

  const handleButtonClick = async () =>{

    try{

      console.log(`username: ${user}`)
      console.log(`password: ${pass}`)
  
      const authData = await pb.collection('users').authWithPassword(
        user,
       pass,
     
    );


    }catch(err){
      setErro(true)
    }

   
    onLogin()
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              username
            </Label>
            <Input id="name"  className="col-span-3"onChange={(e)=>{handleUser(e)}}  />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              password
            </Label>
            <Input onChange={(e)=>{handlePass(e)}} id="username"  className="col-span-3" />
          </div>
        </div>
        <DialogFooter className="flex flex-col">
        {erro && <p>nie udało się zalogować</p>}
          <Button onClick={handleButtonClick}>Save changes</Button>
       
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
