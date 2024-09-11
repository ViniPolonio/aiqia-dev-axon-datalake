import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardFooter, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import EditTime from '../EditTime/EditTime';
import { useRef, useState } from 'react';

export type EditTime = {
    id?: number;
    created_at?: Date;
    interval_type?: number;
    interval_value?: number;
    data_type?: number;
    data_value?: number;
    active?: number;
    sync_control_config_id?: number;
};
interface CardEditTimeProps {
    date: EditTime;
    onSave: () => void;
}

const intervalType = (time: number) => {
    switch (time) {
        case 1:
            return 'Minuto(s)';
        case 2:
            return 'Hora(s)';
        default:
            return 'Dia(s)';
    }
};

export function CardEditTime({ date, onSave }: CardEditTimeProps) {
    const [open, setOpen] = useState(false);
    const [hoverTitle, setHoverTitle] = useState<boolean>(
        false
    );
    const [hoverDescription, setHoverDescription] = useState<boolean>(
        false
    );
    const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
        }
        enterTimeoutRef.current = setTimeout(() => {
            setHoverTitle(
                true
            );
            setHoverDescription(true);
        }, 500);
    };

    const handleMouseLeave = () => {
        if (enterTimeoutRef.current) {
            clearTimeout(enterTimeoutRef.current);
        }
        leaveTimeoutRef.current = setTimeout(() => {
            setHoverTitle(
                false
            );
            setHoverDescription(false);
        }, 200);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="m-3" asChild>
                <motion.div
                    whileHover={{ scaleY: 1.3, scaleX: 1.2, translateY: 50 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Card className="flex w-[15vw] h-[15vw] m-6 items-center flex-col cursor-pointer overflow-hidden hover:shadow-lg">
                        <div
                            className={`flex flex-col items-center justify-center  w-full h-full text-center ${
                                hoverTitle ? 'justify-evenly' : 'justify-center'
                            }`}
                        >
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        fontSize: 'clamp(0.1rem)',
                                    }}
                                >
                                    {hoverTitle ? (
                                        <div className="mx-0.5 my-3   ">
                                            <div className="flex justify-between m-2 my-4">
                                                <DialogDescription className="text-[1rem] ">
                                                    Estado:{' '}
                                                </DialogDescription>
                                                <CardTitle className="text-[1rem] flex self-center ">
                                                    {date.active
                                                        ? 'Ligado'
                                                        : 'Desligado'}
                                                </CardTitle>
                                            </div>

                                            <div className="m-2 my-4 flex justify-between">
                                                <DialogDescription className="text-[1rem] text-left">
                                                    Intervalo de sincronização:{' '}
                                                </DialogDescription>
                                                <CardTitle className="text-[1rem] relative z-0 flex self-center justify-self-center truncate pr-3">
                                                    {date.interval_value}{' '}
                                                    {date.interval_type
                                                        ? intervalType(
                                                              date.interval_type
                                                          )
                                                        : 'Tempo não foi definido'}{' '}
                                                </CardTitle>
                                            </div>
                                            <div className="m-2 my-4 flex justify-between content-center">
                                                <DialogDescription className="text-[1rem] text-left">
                                                    Periodo da sincronização:{' '}
                                                </DialogDescription>
                                                <CardTitle className="text-[1rem] flex self-center justify-self-center pr-3 truncate">
                                                    {date.data_value
                                                        ? date.data_value
                                                        : ''}{' '}
                                                    {date.data_type
                                                        ? intervalType(
                                                              date.data_type
                                                          )
                                                        : '--'}
                                                </CardTitle>
                                            </div>
                                        </div>
                                    ) : (
                                        <DialogTitle className="m-4 text-[1.8rem]">
                                            {date.interval_value}{' '}
                                            {date.interval_type
                                                ? intervalType(
                                                      date.interval_type
                                                  )
                                                : 'Tempo não foi definido'}
                                        </DialogTitle>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {hoverDescription ? (
                                        <DialogDescription className="text-[1rem] text-left">
                                            Clique para editar
                                        </DialogDescription>
                                    ) : (
                                        <CardFooter className="text-[1.3rem]">
                                            Intervalo de Sincronização
                                        </CardFooter>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </Card>
                </motion.div>
            </DialogTrigger>
            <DialogContent className="p-0">
                <EditTime data={date} onSave={onSave} />
            </DialogContent>
        </Dialog>
    );
}
