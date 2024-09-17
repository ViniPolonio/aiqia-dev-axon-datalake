import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { EllipsisIcon } from 'lucide-react';
import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
interface IntervaloSincronizacaoProps {
    intervaloSincronizacao: Array<any>;
    showButton?: boolean;
    className?: string;
    active: number;
}

export default function IntervaloSincronizacao({
    intervaloSincronizacao,
    className,
    active: initialActive,
    showButton = true,
}: IntervaloSincronizacaoProps) {
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
    };

    const minutosIntervaloSincronizacao = intervaloSincronizacao[0];
    const horasIntervaloSincronizacao = intervaloSincronizacao[1];
    const diasIntervaloSincronizacao = intervaloSincronizacao[2];

//    


    const formatStatus = (status: string) => {
        return status === 'active' ? 'Sucesso' : 'Não Sincronizado';
    };
    const textClassName = (status: string) => {
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
    };

    const cardClass = showButton
        ? `p-1  border-2 w-[7vw]`
        : `p-1  mx-3 border-2 w-[7vw]`;
    const teste = (intervaloSincronizacao: Array<any>, type: number, teste?:number) => {
      if (Array.isArray(intervaloSincronizacao)) {
        if (intervaloSincronizacao.length > 1) {
            return (
                <div className="w-1/3">
                    {intervaloSincronizacao ? (
                        intervaloSincronizacao.map(
                            (item, index) =>
                                item.value != 0 && (
                                    <h1
                                        key={index}
                                        className={`${className} text-center text-balance truncate`}
                                    >
                                        {showButton ? (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        {index == 0 && (
                                                            <Card
                                                                className={`${cardClass} ${borderClassName(
                                                                    item.status
                                                                )}`}
                                                            >
                                                                <CardTitle
                                                                    className={`text-[1.3rem] ${textClassName(
                                                                        item.status
                                                                    )}`}
                                                                >
                                                                    {item.value +
                                                                        ' ' +
                                                                        formatType(
                                                                            type
                                                                        )}
                                                                </CardTitle>
                                                                <CardDescription>
                                                                    {formatStatus(
                                                                        item.status
                                                                    )}
                                                                </CardDescription>
                                                            </Card>
                                                        )}
                                                    </TooltipTrigger>
                                                    <TooltipContent className="">
                                                        <ul className="p-2">
                                                            {intervaloSincronizacao
                                                                .slice(1)
                                                                .map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="my-2"
                                                                        >
                                                                            <Card
                                                                                className={`${cardClass} ${borderClassName(
                                                                                    item.status
                                                                                )}`}
                                                                            >
                                                                                <CardTitle
                                                                                    className={`text-[1.3rem] ${textClassName(
                                                                                        item.status
                                                                                    )}`}
                                                                                >
                                                                                    {item.value +
                                                                                        ' ' +
                                                                                        formatType(
                                                                                            type
                                                                                        )}
                                                                                </CardTitle>
                                                                                <CardDescription>
                                                                                    {formatStatus(
                                                                                        item.status
                                                                                    )}
                                                                                </CardDescription>
                                                                            </Card>
                                                                        </li>
                                                                    )
                                                                )}
                                                        </ul>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        {index == 0 && (
                                                            <Card
                                                                className={`${cardClass} ${borderClassName(
                                                                    item.status
                                                                )}`}
                                                            >
                                                                <CardTitle
                                                                    className={`text-[1.3rem] ${textClassName(
                                                                        item.status 
                                                                    )}`}
                                                                >
                                                                    {item.value +
                                                                        ' ' +
                                                                        formatType(
                                                                            type
                                                                        )}
                                                                </CardTitle>
                                                                <CardDescription>
                                                                    {formatStatus(
                                                                        item.status
                                                                    )}
                                                                </CardDescription>
                                                            </Card>
                                                        )}
                                                    </TooltipTrigger>
                                                    <TooltipContent className="">
                                                        <ul className="p-2">
                                                            {intervaloSincronizacao
                                                                .slice(1)
                                                                .map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="my-2"
                                                                        >
                                                                            <Card
                                                                                className={`${cardClass} ${borderClassName(
                                                                                    item.status
                                                                                )}`}
                                                                            >
                                                                                <CardTitle
                                                                                    className={`text-[1.3rem] ${textClassName(
                                                                                        item.status
                                                                                    )}`}
                                                                                >
                                                                                    {item.value +
                                                                                        ' ' +
                                                                                        formatType(
                                                                                            type
                                                                                        ) }
                                                                                </CardTitle>
                                                                                <CardDescription>
                                                                                    {formatStatus(
                                                                                        item.status
                                                                                    )}
                                                                                </CardDescription>
                                                                            </Card>
                                                                        </li>
                                                                    )
                                                                )}
                                                        </ul>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </h1>
                                )
                        )
                    ) : (
                        <h1
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
                    )}
                </div>
            );
        }
else {return (
    <div className="w-1/3">
        {intervaloSincronizacao.length != 0 ? (
            intervaloSincronizacao.map(
                (item, index) =>
                    item.value != 0 && (
                        <h1
                            key={index}
                            className={`${className} text-center text-balance truncate`}
                        >
                            {showButton ? (
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
                                        {item.value + ' ' + formatType(type)}
                                    </CardTitle>
                                    <CardDescription>
                                        {formatStatus(item.status)}
                                    </CardDescription>
                                </Card>
                            ) : (
                                <Card
                                    className={`${cardClass} ${borderClassName(
                                        item.status
                                    )}`}
                                >
                                    <CardTitle
                                        className={`text-[1.3rem] ${textClassName(
                                            item.status
                                        )}`}
                                    >
                                        {item.value + ' ' + formatType(type)}
                                    </CardTitle>
                                    <CardDescription>
                                        {formatStatus(item.status)}
                                    </CardDescription>
                                </Card>
                            )}
                        </h1>
                    )
            )
        ) : (
            <h1 className={`${className} text-center text-balance truncate`}>
                <Card className={`${cardClass} border-gray-500`}>
                    <CardTitle className={`text-[1.3rem] border-gray-500 `}>
                        --
                    </CardTitle>
                    <CardDescription>{'Não Possui'}</CardDescription>
                </Card>
            </h1>
        )}
    </div>
);}}
        
    };
    return (
        <div>
            <CardDescription className={`${className} pb-2`}>
                {'Intervalo entre Sincronizações:'}
            </CardDescription>
            <div className="flex justify-evenly truncate ">
                {teste(minutosIntervaloSincronizacao, 0)}
                {teste(horasIntervaloSincronizacao, 1)}
                {teste(diasIntervaloSincronizacao, 2)}
            </div>
        </div>
    );
}
