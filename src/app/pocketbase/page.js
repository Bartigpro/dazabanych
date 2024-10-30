"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react";
import Image from "next/image";
import PocketBase from 'pocketbase';
import { ModeToggle } from "@/components/dark-mode";
import { Timer } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

const pb = new PocketBase('http://172.16.15.140:8080');

export default function Page() {
  const [rec, setRec] = useState()
  const [data, setData] = useState({
    marka: "",
    model: "",
    czas_parkowania: "",
  });
  const [zdjecie, setZdjecie] = useState(null)


  useEffect(() => {
    const getData = async () => {
      try {
        const records = await pb.collection('samochody').getFullList({
          sort: '-created',
        });

        console.log(records)
        setRec(records)

      }
      catch (err) {
        console.log(err)
      }
      finally {

      }







    }
    getData()
  }, [])


  const handleInputChange = (id, e)=>{
    
    setData((prev)=>({
      ...prev, 
      [id]:e.target.value
      
  }),
  console.log(data))





  }

  const handleSubmit = async ()=>{


    const formData = new FormData()


    formData.append("marka", data.marka)
    formData.append("model", data.model)
    formData.append("czas_parkowania", data.czas_parkowania)
    formData.append("zdjecie", zdjecie)

    try{
      const record = await pb.collection('samochody').create(formData);
      setRec((prev)=>([
        ...prev, 
        record
      ]))
    }
    catch(err){
      console.log(err)
    }

  }

  const handleZdjecie = (e)=>{
    console.log(e)
    setZdjecie(e.target.files[0])
  }
  const usun = async (id) => {
    try {
      await pb.collection('samochody').delete(id);
   
      setRec((prev) => prev.filter((item) => item.id !== id));
      console.log("sigma dziala");
    } catch (err) {
      console.log("niesigma niedziala", err);
    }
  };

 
  return (



    <div className="w-full h-screen flex flex-col gap-4">
      <div className="text-center p-8">
      <Sheet >
  <SheetTrigger>Otwórz panel dodawania</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle> Wprowadź dane</SheetTitle>
      <SheetDescription className="gap-7">

      <form onSubmit={handleSubmit}  className="mb-4 ">
        <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="marka">marka</Label>
        <Input onChange={(e)=>{handleInputChange("marka",e)}} type="text" placeholder="marka" id="marka"/>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="model">model</Label>
        <Input  onChange={(e)=>{handleInputChange("model",e)}} type="text" placeholder="model" id="model"/>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="marka">czas(min)</Label>
        <Input  onChange={(e)=>{handleInputChange("czas_parkowania",e)}} type="number" placeholder="czas" id="czas_parkowania"/>
        </div>

       <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="zdjecie">zdjęcie</Label>
        <Input  onChange={(e)=>{handleZdjecie(e)}} type="file" placeholder="zdjecie" id="zdjecie"/>
        </div> 
       
        
        <div className="w-full">
      <Button type="submit">dodaj</Button>
        </div>
      </form>
       
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
      </div>
    

     
    <div className="gap-7 flex flex-wrap justify-center text-center">
      {rec &&
        rec.map((item, idx) => (
          <Card key={idx} className="w-[400px] h-[600px] flex flex-col  text-center">
            <CardHeader>
              <CardTitle> marka: {item.marka}</CardTitle>
              <CardDescription>model: {item.model}</CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src={pb.files.getUrl(item, item.zdjecie)}
                width={500}
                height={400}
                

              />
            </CardContent>
            <CardFooter className="flex flex-col  text-center ">
              <Timer></Timer>
              <p>czas: {item.czas_parkowania} minut</p>
              <p className="text-gray-600">{item.id}</p>
              <AlertDialog>
  <AlertDialogTrigger >  <Button Aschild>USUŃ</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Czy na pewno chcesz usunąć ten rekord?</AlertDialogTitle>
      <AlertDialogDescription>
       
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>nie chce</AlertDialogCancel>
      <AlertDialogAction onClick={() => usun(item.id)}>spox</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
            
            </CardFooter>
          </Card>
        ))}


    </div>
    </div>



  )
}