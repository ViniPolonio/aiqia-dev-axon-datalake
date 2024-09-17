'use client';

import { editControlTime } from '@/app/services/controlTimeConfig';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { EditButtonSubmit } from '../components/EditButtonSubmit/EditButtonSubmit';
import { DeleteButtonTime } from '../components/DeleteButton/DeleteButtonTime/DeleteButtonTime';
import { toast } from '@/components/ui/use-toast';

export type EditTime = {
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
interface EditTimeProps {
    data: EditTime;
    onSave: () => void;
}

export default function EditTime({ data, onSave }: EditTimeProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);
    const [editFailed, setEditFailed] = useState(false);
    const [intervalType, setIntervalType] = useState<number>(data.data_value ? data.data_value : 1);
    const [dataType, setDataType] = useState<number>(
        data.data_type ? data.data_type : 1
    );

    const validateValueForType = (type: number) => {
        switch (type) {
            case 1:
                return 59;
            case 2:
                return 23;
            default:
                return 100000000000;
        }
    };

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
            .int()
            .min(1)
            .max(validateValueForType(intervalType)),
        data_type: z
            .number()
            .int()
            .transform(function (v) {
                setDataType(v);
                return v;
            }),
        data_value: z
            .number()
            .int()
            .min(0)
            .max(validateValueForType(dataType)),
        active: z.number(),
    });

 

    const handleTypeChange = (
        value: any,
        typeField: 'interval_type' | 'data_type',
        valueField: 'data_value' | 'interval_value'
    ) => {
        form.setValue(typeField, parseInt(value));
        form.setValue(
            valueField,
            Math.min(
                form.getValues(valueField),
                validateValueForType(parseInt(value))
            )
        );
        form.trigger(valueField);
    };

       const form = useForm<z.infer<typeof formSchema>>({
           resolver: zodResolver(formSchema),
           defaultValues: {
               id: data.id,
               active: data.active,
               interval_type: data.interval_type,
               interval_value: data.interval_value,
               data_type: data.data_type,
               data_value: data.data_value,
           },
       });
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            await form.trigger();

            if (
                form.formState.errors.data_value ||
                form.formState.errors.interval_value
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

            if (response && response.status === 1) {
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
            onSave();
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex relative">
                    <Card className="w-[50vh] h-[80vh] line-clamp-0">
                        <CardHeader className={`flex justify-between `}>
                            <CardTitle>{'Edição tabela de tempo'}</CardTitle>
                            <CardDescription>
                                Edite os campos que deseja alterar
                            </CardDescription>
                            <FormField
                                control={form.control}
                                name="active"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center space-x-2">
                                            <FormControl>
                                                <Switch
                                                    checked={field.value === 1}
                                                    id='active'
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        form.setValue(
                                                            'active',
                                                            checked ? 1 : 0
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormLabel className="transition-colors duration-300">
                                                {field.value === 0
                                                    ? 'Desligado'
                                                    : 'Ligado'}
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="interval_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Tipo do Intervalo de Sincronização
                                        </FormLabel>
                                        <Select
                                            value={field.value.toString()}
                                            onValueChange={(value) =>
                                                handleTypeChange(
                                                    value,
                                                    'interval_type',
                                                    'interval_value'
                                                )
                                            }
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
                                        <FormDescription>
                                            Selecione um tipo para realizar a
                                            sincronização com base no tipo
                                            selecionado
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="interval_value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Intervalo de sincronização
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(value) =>
                                                    field.onChange(
                                                        Number(
                                                            value.target.value
                                                        )
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Valor que representa o intervalo de
                                            tempo para realizar a sincronização
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="data_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Tipo de intervalo do periodo da
                                            sincronização
                                        </FormLabel>
                                        <Select
                                            value={field.value.toString()}
                                            onValueChange={(value) =>
                                                handleTypeChange(
                                                    value,
                                                    'data_type',
                                                    'data_value'
                                                )
                                            }
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
                                        <FormDescription>
                                            Selecione um tipo de tempo para ver
                                            o periodo de atualizacao dos dados
                                            com base no tipo selecionado
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
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
                                                onChange={(value) =>
                                                    field.onChange(
                                                        Number(
                                                            value.target.value
                                                        )
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Valor que representa o intervalo de
                                            tempo para realizar a sincronização
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
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
                </div>
            </form>
        </Form>
    );
}
