import { CardDescription } from "@/components/ui/card";
import React from "react";

interface StatusGeralProps {
    status: number;

    active: number;
    className: string;
    showButton?: boolean;
}


export default function StatusGeral({
    showButton = true,
    status,
    active: initialActive,
    className,
}: StatusGeralProps) {
    const [active, setActive] = React.useState(initialActive);
    React.useEffect(() => {
        setActive(initialActive);
    }, [initialActive]);
    return (
        <div className={showButton ? '' : 'flex flex-col items-center '}>
            <CardDescription>Status Geral:</CardDescription>
            <h1
                className={`${className} font-semibold subpixel-antialiased text-lg`}
            >
                {(() => {
                    if (active === 1) {
                        switch (status) {
                            case 0:
                                return 'Falha';
                            case 1:
                                return 'Sincronizado';
                            default:
                                return 'Não Sincronizado';
                        }
                    } else {
                        return 'Inativo';
                    }
                })()}
            </h1>
        </div>
    );
}