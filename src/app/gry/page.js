"use client"

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





export default function Home() {
    const pb = new PocketBase('http://172.16.15.140:8080');
    const [Rec, setRec] = useState()


    const handleSwitch = async () =>{


        

    }


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
                                <Switch  checked={gra.dostepnosc}></Switch>
                        </CardFooter>
                    </Card>
                ))}
                <Card  className="w-[400px] h-[700px] flex flex-col  justify-center text-center items-center">
                   
                </Card >  className="text-9xl w-full justify-center text-center items-center"
        </div>
    );
}
