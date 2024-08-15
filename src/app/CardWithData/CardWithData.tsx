

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { EditButton } from "@/components/botoes/EditButton/EditButton"
import { PowerButton } from "@/components/botoes/PowerButton/PowerButton"

interface CardWithDataProps {
  id: number
  nomeOracle: string,
  nomeInterno: string,
  date: Date,
  active: number,
  status: number,
  showButton?: boolean,
  loading?: boolean,
}

export function CardWithData({ 
  id,
  nomeOracle, 
  nomeInterno, 
  date, 
  status = 2,
  active: initialActive,
  showButton = true,
  loading = false,
  }: CardWithDataProps)
  {
    const [active, setActive] = React.useState(initialActive);

    React.useEffect(() => {
      setActive(initialActive); // Garantir que o estado inicial esteja correto
    }, [initialActive]);

    const router = useRouter();
    const formateDate = format(date, 'dd/MM/yyyy HH:mm:ss')
    if (loading) {
      return (
        <Card className="w-[350px] h-[290px] animation_skeleton">
          <CardHeader>
            <div className="bg-gray-300 h-5 rounded-md dark:bg-gray-600"></div>
            <div className="bg-gray-300 h-4 mt-2 rounded-md dark:bg-gray-600"></div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-300 h-4 mb-2 rounded-md dark:bg-gray-600"></div>
            <div className="bg-gray-300 h-4 mb-2 rounded-md dark:bg-gray-600"></div>
          </CardContent>
          {showButton && (
            <CardFooter className="flex place-content-evenly">
              <div className="bg-gray-300 h-8 w-20 rounded-md dark:bg-gray-600"></div>
              <div className="bg-gray-300 h-8 w-20 rounded-md dark:bg-gray-600"></div>
              <div className="bg-gray-300 h-8 w-20 rounded-md dark:bg-gray-600"></div>
            </CardFooter>
          )}
        </Card>
      );
    }
    const cardClass = active === 0
      ? "w-[350px] h-[290px] animation_default"

      : ( showButton ? (
            status === 0 ? "w-[350px] h-[290px] animation_failed" 
            : status === 1 ? "w-[350px] h-[290px] animation_success" 
            : "w-[350px] h-[290px] animation_unsyncronized"
          ) : (
            status === 0 ? " w-[350px] h-[220px] animation_failed" 
            : status === 1 ? "w-[350px] h-[220px] animation_success" 
            : "w-[350px] h-[220px] animation_unsyncronized"
          ))
    const titlesClass = active === 0 
            ? "text-gray-600 truncate"
            : (status === 0 ? "text-red-500 truncate" 
                : status === 1 ? "text-green-500 truncate" 
                : "text-yellow-600 truncate"
            )
    const statusClass = active === 0 
            ? "text-center text-balance text-gray-600"
            : (status === 0 ? "text-center text-balance text-red-500" 
              : status === 1 ? "text-center text-balance text-green-500" 
              : "text-center text-balance text-yellow-600"
            )

    const buttonClass = active === 0
            ? "bg-gray-600 transition-colors duration-700 hover:bg-gray-500"
            : (status === 0 ? " transition-colors duration-700 hover:bg-red-500  " 
              : status === 1 ? "transition-colors duration-700 hover:bg-green-500" 
              : "transition-colors duration-700 hover:bg-yellow-500"
            )
    const handleHistoric = () => {
      router.push(`/historic/${id}`);
    }
    return (
      <Card className={`${cardClass}`}>
        <CardHeader>
          <CardTitle className={`${titlesClass}`} title={ nomeOracle }>{ nomeOracle } </CardTitle>
          <CardDescription className="truncate">{ nomeInterno } </CardDescription>
        </CardHeader>
        <CardContent className="">
          <div>
            <CardDescription className="pb-2">{status == 2 ? "Criado em: " : "Ultima Atulização: "}</CardDescription>
            <h1 className="text-center text-balance truncate"> {formateDate}</h1>
          </div>
          <div>
            <CardDescription>Status:</CardDescription>
            <h1 className={`${statusClass}`}>{
              (() => {
                if (active === 1){
                  switch (status) {
                    case 0:
                      return "Failed";
                    case 1:
                      return "Success";
                    default:
                      return "Unsyncronized";
                  }
              }
              else{
                return "Inactive";
              }
              })()
            }
            </h1>
          </div>
        </CardContent>
        {showButton && (
          <CardFooter className="flex place-content-evenly">
            <EditButton
              id={ id }
            />
            <Button onClick={handleHistoric} className={`${buttonClass}`}>See more</Button>
            <PowerButton 
              active={active}
              id = {id}
              onPowerChange={setActive}
            />
          </CardFooter>
        )}
        
      </Card>
    )
}
