import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { number, z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import React, { useEffect, useState } from 'react';
import {
    editControlTime,
    getControlTimeById,
} from '@/app/services/controlTimeConfig';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { EditButtonSubmit } from '../components/EditButtonSubmit/EditButtonSubmit';
import EditFormSkeleton from '../components/EditFormSkeleton/EditFormSkeleton';
import { DeleteButtonTime } from '../components/DeleteButton/DeleteButtonTime/DeleteButtonTime';
import { HourglassIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type EditTimeProps = {
    id?: number;
    created_at?: Date;
    interval_type?: number;
    interval_value?: number;
    data_type?: number;
    data_value?: number;
    active?: number;
    sync_control_config_id?: number;
    loading?: boolean;
};

export default function EditTime({ data }: { data: EditTimeProps }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);
    const [editFailed, setEditFailed] = useState(false);
    const [intervalType, setIntervalType] = useState<number>(1);
    const [dataType, setDataType] = useState<number>(1);

    const validateValueForType = (type: number) => {
        // console.log('Validating type:', type);
        switch (type) {
            case 1:
                return 59;
            case 2:
                return 23;
            default:
                return 100000000000;
        }
    };

    // const getIntervalPlaceholder = (type: number) => {
    //     switch (type) {
    //             case 1:
    //               return "1 - 59 minutos";
    //             case 2:
    //               return "1 - 23 horas";
    //             case 3:
    //               return "1 ou mais dias";
    //             default:
    //               return "Valor do intervalo";
    //           }
    // }

    const formSchema = z.object({
        id: z.number().int(),
        interval_type: z
            .number()
            .int()
            .transform(function (v) {
                setIntervalType(v);
                return v;
            }),
        interval_value: z
            .number()
            .min(1)
            .max(validateValueForType(intervalType))
            .int(),
        data_type: z
            .number()
            .int()
            .transform(function (v) {
                setDataType(v);
                return v;
            }),
        data_value: z.number().min(1).max(validateValueForType(dataType)).int(),
        active: z.number(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            interval_type: data.interval_type,
            interval_value: data.interval_value,
            data_type: data.data_type,
            data_value: data.data_value,
            active: data.active,
        },
    });

    const { watch } = form;
    const watchIntervalType = watch('interval_type');
    const watchIntervalValue = watch('interval_value');
    const watchDataType = watch('data_type');
    const watchDataValue = watch('data_value');

    // useEffect(() => {
    //     console.log('Interval type:', watchIntervalType);
    //     console.log('Interval Value:', watchIntervalValue);
    //     console.log('Data type:', watchDataType);
    //     console.log('Data Value:', watchDataValue);
    // }, [watchIntervalValue, watchDataValue]);

    const handleCreateTime = () => {
        router.push('/Create');
    };


    console.log('Form:', form);
    console.log('Form State:', form.formState);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        console.log("teste funcionaç");
        try {
            // await form.trigger();

            if (
                form.formState.errors.data_value ||
                form.formState.errors.data_type
            ) {
                setEditFailed(true);
                setEditSuccess(false);
                return;
            }

            const { id, ...payload } = {
                ...values,
                sync_control_config_id: Number(data.sync_control_config_id),
            };
            const response = await editControlTime(id, payload);
            if (response && response.status == 1) {
                setEditSuccess(true);
                setEditFailed(false);
            } else {
                setEditSuccess(false);
                setEditFailed(true);
            }
        } catch (error) {
            console.error('Erro ao criar configuracao', error);
            setEditSuccess(false);
            setEditFailed(true);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* <form onSubmit={(event) => { event.preventDefault();console.log(form.handleSubmit(onSubmit));}} className="space-y-8"> */}
                {
                    <div className="flex relative">
                        <Card
                            className={`w-[500px] h-[850px] line-clamp-0 `}
                            // className={`w-[500px] h-[850px] line-clamp-0  ${
                            //     allDates.length === 0
                            //         ? " text-gray-500 cursor-not-allowed blur-sm"
                            //         : ""
                            // }`}
                        >
                            <CardHeader className={`flex justify-between `}>
                                <CardTitle>
                                    {'Edição tabela de tempo'}
                                </CardTitle>
                                <CardDescription>
                                    Edite os campos que deseja alterar
                                </CardDescription>
                                <FormField
                                    control={form.control}
                                    name="active"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="active"
                                                        checked={
                                                            field.value === 1
                                                        }
                                                        onCheckedChange={(
                                                            checked
                                                        ) =>
                                                            form.setValue(
                                                                'active',
                                                                checked ? 1 : 0
                                                            )
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor="active"
                                                        title="Ativar/desativar sincronizacao"
                                                        className="transition-colors duration-300 "
                                                    >
                                                        {field.value === 0
                                                            ? 'Desligado'
                                                            : 'Ligado'}
                                                    </Label>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardHeader>
                            <CardContent>
                                <div className="w-full grid items-center place-content-center gap-4">
                                    <div>
                                        {/* <div className="flex flex-col space-y-1.5">
                                                <FormField
                                                    control={form.control}
                                                    name="id"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Tabelas de tempo
                                                                por data
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={(
                                                                        value
                                                                    ) =>
                                                                        handleSelectChange(
                                                                            parseInt(
                                                                                value
                                                                            )
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        allDates.length ===
                                                                        0
                                                                    }
                                                                >
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Selecione uma tabela" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {allDates.map(
                                                                            (
                                                                                date
                                                                            ) =>
                                                                                date.id !==
                                                                                    undefined &&
                                                                                date.created_at !==
                                                                                    undefined ? (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            date.id
                                                                                        }
                                                                                        value={date.id.toString()}
                                                                                    >
                                                                                        {format(
                                                                                            new Date(
                                                                                                date.created_at
                                                                                            ),
                                                                                            "dd/MM/yyyy HH:mm:ss"
                                                                                        )}
                                                                                    </SelectItem>
                                                                                ) : (
                                                                                    ""
                                                                                )
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormDescription>
                                                                Selecione qual
                                                                tabela de
                                                                intervalo de
                                                                sincronização
                                                                deseja editar
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div> */}
                                        <div className="flex flex-col space-y-1.5">
                                            <FormField
                                                control={form.control}
                                                name="interval_type"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Tipo de intervalo de
                                                            sincronização
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                value={
                                                                    field.value
                                                                        ? field.value.toString()
                                                                        : ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    form.setValue(
                                                                        'interval_type',
                                                                        parseInt(
                                                                            value
                                                                        )
                                                                    );
                                                                    form.setValue(
                                                                        'interval_value',
                                                                        Math.min(
                                                                            form.getValues(
                                                                                'interval_value'
                                                                            ),
                                                                            validateValueForType(
                                                                                parseInt(
                                                                                    value
                                                                                )
                                                                            )
                                                                        )
                                                                    );
                                                                    form.trigger(
                                                                        'interval_value'
                                                                    );
                                                                }}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Selecione um intervalo de sincronização" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="1">
                                                                        Minuto
                                                                    </SelectItem>
                                                                    <SelectItem value="2">
                                                                        Hora
                                                                    </SelectItem>
                                                                    <SelectItem value="3">
                                                                        Dia
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Selecione um tipo
                                                            para realizar a
                                                            sincronização com
                                                            base no tipo
                                                            selecionado
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex flex-col space-y-1.5">
                                            <FormField
                                                control={form.control}
                                                name="interval_value"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Intervalo de
                                                            sincronização
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Valor que representa
                                                            o intervalo de tempo
                                                            para realizar a
                                                            sincronização
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <FormField
                                                control={form.control}
                                                name="data_type"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Tipo de intervalo do
                                                            periodo da
                                                            sincronização
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                value={
                                                                    field.value
                                                                        ? field.value.toString()
                                                                        : ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    form.setValue(
                                                                        'data_type',
                                                                        parseInt(
                                                                            value
                                                                        )
                                                                    );
                                                                    form.setValue(
                                                                        'data_type',
                                                                        Math.min(
                                                                            form.getValues(
                                                                                'data_type'
                                                                            ),
                                                                            validateValueForType(
                                                                                parseInt(
                                                                                    value
                                                                                )
                                                                            )
                                                                        )
                                                                    );
                                                                    form.trigger(
                                                                        'data_value'
                                                                    );
                                                                }}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Selecione um tipo de intervalo do periodo sincronização" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="1">
                                                                        Minuto
                                                                    </SelectItem>
                                                                    <SelectItem value="2">
                                                                        Hora
                                                                    </SelectItem>
                                                                    <SelectItem value="3">
                                                                        Dia
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Selecione um tipo de
                                                            tempo para ver o
                                                            periodo de
                                                            atualizacao dos
                                                            dados com base no
                                                            tipo selecionado
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <FormField
                                            control={form.control}
                                            name="data_value"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Intervalo do periodo da
                                                        sincronização
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Valor que representa o
                                                        intervalo de tempo para
                                                        realizar a sincronização
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-around">
                                <EditButtonSubmit
                                    isSubmitting={isSubmitting}
                                    editFailed={editFailed}
                                    editSuccess={editSuccess}
                                    disabled={false}
                                    
                                />

                                <DeleteButtonTime
                                    id={Number(data.id)}
                                    sync_control_config_id={Number(
                                        data.sync_control_config_id
                                    )}
                                    disabled={false}
                                />
                            </CardFooter>
                        </Card>
                        {/* {allDates.length === 0 ? (
                                <Button
                                    className=" w-[60%] h-[7%]  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                                    
                                    onClick={handleCreateTime}
                                >
                                    <span>Criar configuracao de tempo</span>
                                </Button>
                            ) : (
                                ""
                            )} */}
                    </div>
                }
            </form>
        </Form>
    );
}
