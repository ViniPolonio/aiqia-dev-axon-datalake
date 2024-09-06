import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import {
    editControllConfig,
    getControllById,
} from "@/app/services/controlConfig";
import { EditButtonSubmit } from "../components/EditButtonSubmit/EditButtonSubmit";
import EditFormSkeleton from "../components/EditFormSkeleton/EditFormSkeleton";
import { DeleteButtonTable } from "../components/DeleteButton/DeleteButtonTable/DeleteButtonTable";

interface EditTableProps {
    id?: number;
    process_name?: string;
}

const formSchema = z.object({
    process_name: z
        .string()
        .min(1, {
            message: "O campo precisa ter no minimo 1 caracter",
        })
        .max(255, {
            message: "O campo pode ter no maximo 255 caracter",
        }),
});

export default function EditTable({ process_name }: EditTableProps) {
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string | null>(null);
    const [dataTable, setDataTable] = useState<EditTableProps>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);
    const [editFailed, setEditFailed] = useState(false);

    React.useEffect(() => {
        const path = window.location.pathname;
        const extractedId = path.split("/").pop();
        console.log(extractedId);
        
        if (extractedId == null) {
            console.error("ID não encontrado na URL");
            return;
        }
        setId(extractedId);
        const getData = async () => {
            setLoading(true);
            try {
                const result = await getControllById(extractedId);
                const oldData = result.data;

                const Data: EditTableProps = {
                    id: parseInt(extractedId),
                    process_name: oldData.process_name,
                };
                setDataTable(Data);
                form.reset(Data);
            } catch (error) {
                console.error("Erro ao buscar logs:", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [id]);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            process_name: process_name,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const payload = { ...values, id: id };
            const response = await editControllConfig(id, payload);
            if (response && response.status == 1) {
                setEditSuccess(true);
                setEditFailed(false);
            } else {
                setEditSuccess(false);
                setEditFailed(true);
            }
        } catch (error) {
            console.error("Erro ao criar configuracao", error);
            setEditSuccess(false);
            setEditFailed(true);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {loading ? (
                    <EditFormSkeleton cardHeight="h-[300px]" />
                ) : (
                    <Card className="w-[400px] h-[300px]">
                        <CardHeader>
                            <CardTitle>Edição tabela de configuração</CardTitle>
                            <CardDescription>
                                Edite os campos que deseja alterar
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <FormField
                                        control={form.control}
                                        name="process_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Nome do Processo
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nome do Processo..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Editar o nome do processo...
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
                                disabled={dataTable === null}
                            />
                            <DeleteButtonTable id={Number(id)} />
                        </CardFooter>
                    </Card>
                )}
            </form>
        </Form>
    );
}
