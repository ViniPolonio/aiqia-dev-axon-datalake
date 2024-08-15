"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { SuccessAlert } from "../../SuccessAlert/SuccessAlert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getAllConfigsTable } from "@/app/services/configurationTable"
import { FailedAlert } from "../../FailedAlert/FailedAlert"
import { storeConfigTime } from "@/app/services/configurationTime"

export function CreateTimeForm() {
    const [intervalType, setIntervalType] = useState<number>(1);
    const [dataType, setDataType] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successCreated, setSuccessCreated] = useState(false);
    const [erroCampo, setErroCampo] = useState("");
    const [loading, setLoading] = useState(true);
    const [failedCreated, setFailedCreated] = useState(false);
    const [configTables, setConfigTables] = useState<{ id: number, oracle_name: string }[]>([]);

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
        sync_table_config_id: z.number().int(),
        interval_type: z.number().int().transform(v => {
            setIntervalType(v);
            return v;
        }),
        interval_value: z.number().min(1).max(validateValueForType(intervalType)).int(),
        data_type: z.number().int().transform(v => {
            setDataType(v);
            return v;
        }),
        data_value: z.number().min(1).max(validateValueForType(dataType)).int(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllConfigsTable();
                const configTables = result.data.map((item: any) => ({
                    id: item.config_data.id,
                    oracle_name: item.config_data.oracle_name,
                }));
                setConfigTables(configTables);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            const response = await storeConfigTime(values);

            if (response && response.status === 1) {
                setSuccessCreated(true);
                setFailedCreated(false);
            } else {
                setSuccessCreated(false)
                setFailedCreated(true)
            }
        } catch (error) {
            console.error("Erro ao criar configuracao", error)
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>, field: string) {
        form.setValue(field, Number(event.target.value))
    }

    function handleIntervalTypeChange(value: string, field: string) {
        const numValue = Number(value);
        setIntervalType(numValue);
        form.setValue(field, numValue);
    }

    function handleDataTypeChange(value: string, field: string) {
        const numValue = Number(value);
        setDataType(numValue);
        form.setValue(field, numValue);
    }

    const getIntervalPlaceholder = () => {
        switch (intervalType) {
            case 1:
                return "1 - 59 minutos";
            case 2:
                return "1 - 23 horas";
            case 3:
                return "1 ou mais dias";
            default:
                return "Valor do intervalo";
        }
    }

    const getDataPlaceholder = () => {
        switch (dataType) {
            case 1:
                return "1 - 59 minutos";
            case 2:
                return "1 - 23 horas";
            case 3:
                return "1 ou mais dias";
            default:
                return "Valor do intervalo";
        }
    }

    return (
        <div>
            {successCreated && (
                <SuccessAlert name="Tabela de tempo" type="tabela de tempo de sincronização" />
            )}
            {failedCreated && (
                <FailedAlert type="tabela de tempo de sincronização" erro={erroCampo} />
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[700px]">
                    <FormField
                        control={form.control}
                        name="sync_table_config_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tabela de configurações</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => handleIntervalTypeChange(value, field.name)}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione qual tabela de configuração para atribuir a configuração" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {configTables.map(table => (
                                                <SelectItem key={table.id} value={table.id.toString()}>
                                                    {table.oracle_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    Selecione qual tabela para atribuir a configuração de tempo
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="interval_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de intervalo de sincronização</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => handleIntervalTypeChange(value, field.name)}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um tipo de intervalo de sincronização" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">Minuto</SelectItem>
                                            <SelectItem value="2">Hora</SelectItem>
                                            <SelectItem value="3">Dia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    Selecione um tipo para realizar a sincronização com base no tipo selecionado
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="interval_value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Intervalo de sincronização</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={getIntervalPlaceholder()}
                                        {...field}
                                        onChange={(e) => handleInputChange(e, field.name)}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Valor que representa o intervalo de tempo para realizar a sincronização
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="data_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de intervalo do período da sincronização</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => handleDataTypeChange(value, field.name)}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um tipo de intervalo do período de sincronização" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">Minuto</SelectItem>
                                            <SelectItem value="2">Hora</SelectItem>
                                            <SelectItem value="3">Dia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    Selecione um tipo de tempo para ver o período de atualização dos dados com base no tipo selecionado
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="data_value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Intervalo do período da sincronização</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={getDataPlaceholder()}
                                        {...field}
                                        onChange={(e) => handleInputChange(e, field.name)}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Valor que representa o intervalo de tempo para realizar a sincronização
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Salvando..." : "Salvar"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
