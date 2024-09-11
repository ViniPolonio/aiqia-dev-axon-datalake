import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EllipsisIcon } from "lucide-react";
import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
interface IntervalorSincronizacaoProps {
    intervaloSincronizacao: Array<any>;
    // intervaloSincronizacao: string;
    className?: string;
    active: number;
}

export default function IntervalorSincronizacao({
    intervaloSincronizacao,
    className,
    active: initialActive,
}: IntervalorSincronizacaoProps) {
    const [active, setActive] = React.useState(initialActive);
    React.useEffect(() => {
        setActive(initialActive);
    }, [initialActive]);
    const formatType = (type: number) => {
        switch (type) {
            case 0:
                return 'Min';
            case 1:
                return 'H';
            case 2:
                return 'Dia(s)';
            default:
                return '--';
        }
    }

    const formatStatus = (status: string) => {
        return status === 'active' ? 'Success' : 'Unsynchronized';
    }
    const textClassName = (status: string) => {
        console.log(status)
        console.log(status === 'active');

        return active === 0
            ? 'text-center text-balance text-gray-600'
            : status === 'active'
            ? 'text-center text-balance text-green-600 dark:text-green-300' //600
            : 'text-center text-balance text-yellow-600 dark:text-yellow-300'; //600
    };

    const borderClassName = (status: string) => {
        return active === 0
            ? 'border-gray-500'
            : status === 'active'
            ? 'border-green-500'
            : 'border-yellow-500';
    }
    return (
        <div>
            <CardDescription className={`${className} pb-2`}>
                {'Intervalo entre Sincronizações:'}
            </CardDescription>
            <div className="flex justify-evenly truncate ">
                {/* {intervaloSincronizacao?.length > 4 ? (
                    <>
                        {intervaloSincronizacao.map((item, index) => (
                            <h1
                                key={index}
                                className={`${className} text-center text-balance truncate`}
                            >
                                {item.value}{' '}
                            </h1>
                        ))}

                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span>
                                        <EllipsisIcon />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent className="ml-3">
                                    <ul>
                                        {intervaloSincronizacao
                                            .slice(0, 4)
                                            .map((item, index) => (
                                                <li key={index}>
                                                    {item.value}
                                                </li>
                                            ))}
                                    </ul>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </>
                ) : ( */}
                {intervaloSincronizacao
                    ? intervaloSincronizacao.map((item, index) =>
                          item.value != 0 ? (
                              <h1
                                  key={index}
                                  className={`${className} text-center text-balance truncate`}
                              >
                                  <Card
                                      className={`p-1 border-2 w-[7vw] ${borderClassName(
                                          item.status
                                      )}`}
                                  >
                                      <CardTitle
                                          className={`text-[1.3rem] ${textClassName(
                                              item.status
                                          )}`}
                                      >
                                          {item.value + ' ' + formatType(index)}
                                      </CardTitle>
                                      <CardDescription>
                                          {formatStatus(item.status)}
                                      </CardDescription>
                                  </Card>
                              </h1>
                          ) : (
                              <h1
                                  key={index}
                                  className={`${className} text-center text-balance truncate`}
                              >
                                  <Card
                                      className={`p-1 border-2 w-[7vw] border-gray-500`}
                                  >
                                      <CardTitle
                                          className={`text-[1.3rem] border-gray-500 `}
                                      >
                                          --
                                      </CardTitle>
                                      <CardDescription>
                                          {'Não Possui'}
                                      </CardDescription>
                                  </Card>
                              </h1>
                          )
                      )
                    : null}
                {/* )} */}
            </div>
            {/* <div className="flex justify-evenly truncate">
                <h1
                    className={`${className} text-center text-balance truncate`}
                >
                    {intervaloSincronizacao}
                </h1>
            </div> */}
        </div>
    );
}
