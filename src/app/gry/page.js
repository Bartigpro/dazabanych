"use client"
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
import { useState, useEffect } from "react";
import PocketBase from 'pocketbase';
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";





export default function Home() {
    const pb = new PocketBase('http://172.16.15.140:8080');
    const [Rec, setRec] = useState()
    const [data, setData] = useState({
        tytul: "",
        opis: "",
        cena: "",
    });




    useEffect(() => {
        const getData = async () => {
            try {
                const records = await pb.collection('gry').getFullList({
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

    const handleInputChange = (id, e) => {

        setData((prev) => ({
            ...prev,
            [id]: e.target.value

        }),
            console.log(data))





    }

    const handleSubmit = async () => {


        const formData = new FormData()


        formData.append("tytul", data.tytul)
        formData.append("opis", data.opis)
        formData.append("cena", data.cena)
        formData.append("zdjecie", data.zdjecie)

        try {
            const record = await pb.collection('gry').create(formData);
            setRec((prev) => ([
                ...prev,
                record
            ]))
        }
        catch (err) {
            console.log(err)
        }

    }

    const handleZdjecie = (e) => {
        const file = e.target.files[0];  
        setData((prev) => ({
            ...prev,
            zdjecie: file,
        }));
        console.log(file); 

    }

    const handleSwitch = async (id, currentStatus) => {
        try {
         
            const updatedStatus = !currentStatus;
            await pb.collection('gry').update(id, {
                dostepnosc: updatedStatus,
            });
           
            setRec((prevRec) =>
                prevRec.map((gra) =>
                    gra.id === id ? { ...gra, dostepnosc: updatedStatus } : gra
                )
            );
        } catch (err) {
            console.error("Error updating dostepnosc:", err);
        }
    };
    return (
        <div className="flex flex-wrap gap-6">



            {Rec &&
                Rec.map((gra, idx) => (
                    <Card key={idx} className="w-[400px] h-[700px] flex flex-col  text-center">
                        <CardHeader>
                            <CardTitle> <Image
                                src={pb.files.getUrl(gra, gra.zdjecie)}
                                width={500}
                                height={400}
                                alt={gra.tytul}

                            />
                            </CardTitle>
                            <CardTitle>{gra.tytul}</CardTitle>
                            <CardDescription>cena: {gra.cena}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {gra.opis}
                        </CardContent>
                        <CardFooter className="gap-2">
                            <label>dostepnosc</label>
                            <Switch
                                checked={gra.dostepnosc}
                                onCheckedChange={() => handleSwitch(gra.id, gra.dostepnosc)}
                            />
                        </CardFooter>
                    </Card>
                ))}
            <Sheet>
                <SheetTrigger>
                    <Card className="w-[400px] h-[700px] flex flex-col  justify-center text-center items-center text-9xl">
                        <h1>+</h1>
                    </Card >
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Are you absolutely sure?</SheetTitle>
                       

                            <div className="mb-4" aschild="true">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="tytul">Tytul</Label>
                                    <Input onChange={(e) => { handleInputChange("tytul", e) }} type="text" placeholder="tytul" id="tytul" />
                                </div>

                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="opis">Opis</Label>
                                    <Input onChange={(e) => { handleInputChange("opis", e) }} type="text" placeholder="opis" id="opis" />
                                </div>

                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="cena">cena(zl)</Label>
                                    <Input onChange={(e) => { handleInputChange("cena", e) }} type="number" placeholder="cena" id="cena" />
                                </div>

                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="zdjecie">zdjęcie</Label>
                                    <Input onChange={(e) => { handleZdjecie(e) }} type="file" placeholder="zdjecie" id="zdjecie" />
                                </div>


                                <div className="w-full">
                                    <Button  onClick={handleSubmit}>dodaj</Button>
                                </div>
                            </div>


                       
                    </SheetHeader>
                </SheetContent>
            </Sheet>

        </div>
    );
}
